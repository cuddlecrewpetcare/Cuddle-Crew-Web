'use client';

import { useEffect, useRef } from 'react';
import type { GeoJsonObject } from 'geojson';
import type { GeoJSON as LeafletGeoJSON, Map, Path } from 'leaflet';

const zoneByZip: Record<string, { name: string; color: string; fee: string }> = {};
for (const zip of ['95608','95628','95821','95864']) zoneByZip[zip] = { name: 'Core', color: '#64FF41', fee: 'No travel fee' };
for (const zip of ['95610','95621','95662','95825','95841','95842']) zoneByZip[zip] = { name: 'Standard', color: '#3075FF', fee: 'No travel fee' };
for (const zip of ['95660','95661','95670','95678','95826','95827','95843','95655']) zoneByZip[zip] = { name: 'Extended', color: '#FFBF5E', fee: '$5 per visit' };
for (const zip of ['95630','95648','95650','95677','95742','95746','95747','95762','95765']) zoneByZip[zip] = { name: 'Far Extended', color: '#E45CFF', fee: '$10 per visit' };

export default function ServiceAreaMap({ selectedZip, onSelect }: { selectedZip: string; onSelect: (zip: string) => void }) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const geoRef = useRef<LeafletGeoJSON | null>(null);
  const zipLayers = useRef<Record<string, Path>>({});

  useEffect(() => {
    if (!mapEl.current) return;
    let disposed = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (disposed || !mapEl.current) return;
      const map = L.map(mapEl.current, { scrollWheelZoom: false, zoomControl: true });
      mapRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 18 }).addTo(map);
      const data = await (await fetch('/service-areas.geojson')).json() as GeoJsonObject;
      if (disposed) return;
      const layer = L.geoJSON(data, {
        style: feature => {
          const zone = zoneByZip[String(feature?.properties?.ZCTA5 ?? '')];
          return { color: zone.color, fillColor: zone.color, fillOpacity: .5, weight: 2 };
        },
        onEachFeature: (feature, zipLayer) => {
          const zip = String(feature.properties?.ZCTA5 ?? '');
          const zone = zoneByZip[zip];
          zipLayers.current[zip] = zipLayer as Path;
          zipLayer.bindTooltip(`<strong>${zip}</strong><br>${zone.name}`, { direction: 'center', permanent: true, className: 'zip-map-label' });
          zipLayer.on('click', () => onSelect(zip));
        },
      }).addTo(map);
      geoRef.current = layer;
      map.fitBounds(layer.getBounds(), { padding: [18, 18] });
    })().catch(() => undefined);
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; geoRef.current = null; zipLayers.current = {}; };
  }, [onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    const fullLayer = geoRef.current;
    if (!map || !fullLayer) return;
    for (const [zip, layer] of Object.entries(zipLayers.current)) {
      const zone = zoneByZip[zip];
      layer.setStyle({ color: zip === selectedZip ? '#3B241A' : zone.color, fillColor: zone.color, fillOpacity: zip === selectedZip ? .72 : .5, weight: zip === selectedZip ? 5 : 2 });
    }
    const selected = zipLayers.current[selectedZip];
    if (selected && 'getBounds' in selected) map.fitBounds((selected as Path & { getBounds: () => import('leaflet').LatLngBounds }).getBounds(), { padding: [48, 48], maxZoom: 12 });
    else map.fitBounds(fullLayer.getBounds(), { padding: [18, 18] });
  }, [selectedZip]);

  return <div className="territory-map" ref={mapEl} role="img" aria-label="Interactive map of Cuddle Crew Pet Care ZIP-code service zones. Select a ZIP area to check its travel fee." />;
}

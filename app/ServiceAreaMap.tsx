'use client';

import { useEffect, useRef } from 'react';
import type { GeoJsonObject } from 'geojson';
import type { GeoJSON as LeafletGeoJSON, Map, Path } from 'leaflet';
import {business} from './config/business';

const zoneByZip: Record<string, { name: string; color: string; fee: string }> = {};
for(const zone of Object.values(business.zones))for(const zip of zone.zips)zoneByZip[zip]={name:zone.name,color:zone.color,fee:zone.fee?`$${zone.fee} per visit`:'No travel fee'};

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

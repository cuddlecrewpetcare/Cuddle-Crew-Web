'use client';

import { useEffect, useRef } from 'react';
import type { GeoJsonObject } from 'geojson';

const zoneByZip: Record<string, { name: string; color: string; fee: string }> = {};
for (const zip of ['95608','95628','95821','95864']) zoneByZip[zip] = { name: 'Core', color: '#64FF41', fee: 'No travel fee' };
for (const zip of ['95610','95621','95662','95825','95841','95842']) zoneByZip[zip] = { name: 'Standard', color: '#3075FF', fee: 'No travel fee' };
for (const zip of ['95660','95661','95670','95678','95826','95827','95843','95655']) zoneByZip[zip] = { name: 'Extended', color: '#FFBF5E', fee: '$5 per visit' };
for (const zip of ['95630','95648','95650','95677','95742','95746','95747','95762','95765']) zoneByZip[zip] = { name: 'Far Extended', color: '#E45CFF', fee: '$10 per visit' };

export default function ServiceAreaMap({ selectedZip, onSelect }: { selectedZip: string; onSelect: (zip: string) => void }) {
  const mapEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapEl.current) return;
    let disposed = false;
    let map: import('leaflet').Map | undefined;

    (async () => {
      const L = (await import('leaflet')).default;
      if (disposed || !mapEl.current) return;
      map = L.map(mapEl.current, { scrollWheelZoom: false, zoomControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);
      const response = await fetch('/service-areas.geojson');
      const data = await response.json() as GeoJsonObject;
      if (disposed || !map) return;
      const layer = L.geoJSON(data, {
        style: feature => {
          const zip = String(feature?.properties?.ZCTA5 ?? '');
          const zone = zoneByZip[zip];
          return { color: zip === selectedZip ? '#3B241A' : zone.color, fillColor: zone.color, fillOpacity: .5, weight: zip === selectedZip ? 4 : 2 };
        },
        onEachFeature: (feature, zipLayer) => {
          const zip = String(feature.properties?.ZCTA5 ?? '');
          const zone = zoneByZip[zip];
          zipLayer.bindTooltip(`<strong>${zip}</strong><br>${zone.name}`, { direction: 'center', permanent: true, className: 'zip-map-label' });
          zipLayer.on('click', () => onSelect(zip));
        },
      }).addTo(map);
      map.fitBounds(layer.getBounds(), { padding: [18, 18] });
    })().catch(() => undefined);

    return () => { disposed = true; map?.remove(); };
  }, [selectedZip, onSelect]);

  return <div className="territory-map" ref={mapEl} role="img" aria-label="Interactive map of Cuddle Crew Pet Care ZIP-code service zones. Select a ZIP area to check its travel fee." />;
}

'use client';

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { fromLonLat, transformExtent } from 'ol/proj';

const WENDESSEN_EXTENT_LON_LAT: [number, number, number, number] = [
    10.581421,
    52.149073,
    10.598289,
    52.159423,
];

const WENDESSEN_CENTER_LON_LAT: [number, number] = [
    (10.581421 + 10.598289) / 2,
    (52.149073 + 52.159423) / 2,
];

type BasemapOption = {
    id: string;
    label: string;
    url: string;
    attribution: string;
};

type OverpassElement = {
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: {
        'addr:housenumber'?: string;
    };
};

type OverpassResponse = {
    elements: OverpassElement[];
};

const BASEMAPS: BasemapOption[] = [
    {
        id: 'carto-nolabels',
        label: 'CARTO Hell (ohne Labels)',
        url: 'https://{a-d}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap-Mitwirkende &copy; CARTO',
    },
    {
        id: 'carto-voyager-nolabels',
        label: 'CARTO Voyager (ohne Labels)',
        url: 'https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap-Mitwirkende &copy; CARTO',
    },
    {
        id: 'carto-dark-nolabels',
        label: 'CARTO Dunkel (ohne Labels)',
        url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap-Mitwirkende &copy; CARTO',
    },
];

function createHouseNumberStyle(houseNumber: string) {
    return new Style({
        text: new Text({
            text: houseNumber,
            font: 'bold 12px Arial, sans-serif',
            fill: new Fill({ color: '#111827' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
            overflow: true,
        }),
    });
}

async function fetchHouseNumberFeatures(
    bbox: [number, number, number, number],
    signal: AbortSignal
) {
    const [west, south, east, north] = bbox;
    const overpassQuery = `
        [out:json][timeout:25];
        (
          node["addr:housenumber"](${south},${west},${north},${east});
          way["addr:housenumber"](${south},${west},${north},${east});
          relation["addr:housenumber"](${south},${west},${north},${east});
        );
        out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
        },
        body: overpassQuery,
        signal,
    });

    if (!response.ok) {
        throw new Error('Failed to load house numbers from Overpass API');
    }

    const data = (await response.json()) as OverpassResponse;

    return data.elements
        .map((element) => {
            const houseNumber = element.tags?.['addr:housenumber'];
            const latitude = element.lat ?? element.center?.lat;
            const longitude = element.lon ?? element.center?.lon;

            if (!houseNumber || latitude === undefined || longitude === undefined) {
                return null;
            }

            const feature = new Feature({
                geometry: new Point(fromLonLat([longitude, latitude])),
                houseNumber,
            });

            feature.setStyle(createHouseNumberStyle(houseNumber));
            return feature;
        })
        .filter((feature): feature is Feature<Point> => feature !== null);
}

export default function WendessenMap() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [selectedBasemapId, setSelectedBasemapId] = useState<string>(
        BASEMAPS[0].id
    );

    useEffect(() => {
        let map: Map | null = null;
        const abortController = new AbortController();

        const initializeMap = async () => {
            if (!mapContainerRef.current) {
                return;
            }

            const selectedBasemap =
                BASEMAPS.find((option) => option.id === selectedBasemapId) ??
                BASEMAPS[0];

            const projectedExtent = transformExtent(
                WENDESSEN_EXTENT_LON_LAT,
                'EPSG:4326',
                'EPSG:3857'
            );

            const houseNumberFeatures = await fetchHouseNumberFeatures(
                WENDESSEN_EXTENT_LON_LAT,
                abortController.signal
            );

            if (abortController.signal.aborted) {
                return;
            }

            const houseNumberLayer = new VectorLayer({
                source: new VectorSource({
                    features: houseNumberFeatures,
                }),
                declutter: true,
            });

            const view = new View({
                center: fromLonLat(WENDESSEN_CENTER_LON_LAT),
                zoom: 14,
                maxZoom: 19,
                extent: projectedExtent,
                constrainOnlyCenter: false,
            });

            map = new Map({
                target: mapContainerRef.current,
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: selectedBasemap.url,
                            attributions: selectedBasemap.attribution,
                            wrapX: false,
                        }),
                    }),
                    houseNumberLayer,
                ],
                view,
            });

            map.updateSize();
            const mapSize = map.getSize();
            if (mapSize) {
                view.fit(projectedExtent, {
                    size: mapSize,
                    padding: [0, 0, 0, 0],
                    nearest: true,
                    duration: 0,
                });
                const fittedZoom = view.getZoom();
                if (typeof fittedZoom === 'number') {
                    view.setMinZoom(fittedZoom);
                    view.setZoom(fittedZoom);
                }
            }
        };

        initializeMap().catch((error) => {
            if (!abortController.signal.aborted) {
                console.error('Failed to initialize map with house numbers:', error);
            }
        });

        return () => {
            abortController.abort();
            if (map) {
                map.setTarget(undefined);
            }
        };
    }, [selectedBasemapId]);

    return (
        <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <label
                    htmlFor="basemap-select"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Kartenstil
                </label>
                <select
                    id="basemap-select"
                    value={selectedBasemapId}
                    onChange={(event) => setSelectedBasemapId(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                >
                    {BASEMAPS.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                <div ref={mapContainerRef} className="aspect-square w-full" aria-label="Interaktive Karte von Wendessen" />
            </div>
        </div>
    );
}

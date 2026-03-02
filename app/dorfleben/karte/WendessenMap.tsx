"use client";

import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import { fromLonLat, transformExtent } from "ol/proj";

const WENDESSEN_EXTENT_LON_LAT: [number, number, number, number] = [
    10.581421, 52.149073, 10.598289, 52.159423,
];

const WENDESSEN_CENTER_LON_LAT: [number, number] = [
    (10.581421 + 10.598289) / 2,
    (52.149073 + 52.159423) / 2,
];

type Basemap = {
    url: string;
    attribution: string;
};

type OverpassElement = {
    type?: string;
    id?: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string | undefined>;
};

type OverpassResponse = {
    elements: OverpassElement[];
};

type UnlabeledPlaceLog = {
    category: PlaceCategory;
    osmType: string;
    osmId: number | string;
    amenity?: string;
    leisure?: string;
    tourism?: string;
    shop?: string;
    latitude: number;
    longitude: number;
};

const BASEMAP: Basemap = {
    url: "https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap-Mitwirkende &copy; CARTO",
};

const MAP_VISIBILITY_CONFIG = {
    houseNumbers: {
        startZoom: 16.75,
        fullOpacityZoom: 18,
    },
    places: {
        benchMinZoom: 18.25,
    },
} as const;

const ZOOM_LABEL_UPDATE_INTERVAL_MS = 80;

type PlaceCategory = "parking" | "playground" | "poi";

const BENCH_ICON_SVG = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="600.000000pt" height="442.000000pt" viewBox="0 0 600.000000 442.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,442.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M709 3990 c-45 -13 -79 -42 -107 -89 l-27 -46 -3 -435 c-3 -465 -1 -499 45 -559 46 -60 86 -71 276 -71 l167 0 0 -345 0 -344 -386 -3 -386 -3 -34 -37 -34 -38 0 -290 c0 -320 3 -335 60 -365 24 -12 76 -15 285 -15 l255 0 0 -454 c0 -418 1 -455 18 -476 17 -21 22 -21 272 -21 l255 1 23 26 22 25 0 450 0 449 1590 0 1590 0 0 -449 0 -450 23 -25 22 -26 240 0 c132 0 246 -1 253 0 6 0 21 9 32 20 19 19 20 33 20 475 l0 455 255 0 c209 0 261 3 285 15 57 30 60 45 60 365 l0 290 -34 38 -34 37 -386 3 -386 3 0 344 0 345 168 0 c192 0 228 10 278 76 l29 37 3 479 c3 478 2 479 -19 518 -13 22 -41 52 -63 67 l-41 28 -2280 2 c-1254 1 -2292 -2 -2306 -7z m2647 -20 c371 4 460 3 471 -8 7 -7 13 -10 13 -5 0 6 1426 8 1450 2 3 -1 8 -1 11 -1 3 1 26 -20 50 -45 24 -25 37 -42 29 -38 -13 8 -13 6 -2 -8 14 -17 25 -180 11 -171 -9 5 -6 -17 6 -35 5 -9 5 -16 -1 -18 -5 -2 -8 -143 -6 -350 1 -192 0 -358 -3 -370 -9 -38 -55 -82 -96 -93 -22 -6 -108 -11 -190 -11 -123 0 -153 -3 -169 -16 -17 -15 -19 -37 -20 -356 -1 -306 1 -342 16 -358 16 -18 37 -19 321 -19 236 0 303 -3 303 -12 0 -9 3 -9 9 1 6 10 25 14 58 12 70 -2 84 -6 94 -22 5 -8 9 -9 9 -4 0 6 7 -1 15 -15 11 -20 14 -81 15 -302 0 -158 -4 -288 -10 -303 -5 -14 -22 -30 -36 -35 -16 -6 -131 -11 -272 -11 l-245 0 -19 -24 c-18 -23 -19 -47 -18 -455 1 -345 -1 -436 -12 -452 -13 -19 -24 -20 -253 -20 -217 0 -240 2 -252 18 -10 14 -13 113 -13 459 0 419 -1 443 -19 459 -16 15 -48 17 -294 16 -152 -1 -281 1 -287 5 -5 3 -10 3 -10 -2 0 -7 -1059 -7 -1603 -1 -108 2 -197 -1 -197 -5 0 -4 -8 -3 -19 2 -10 6 -20 8 -23 6 -2 -3 -174 -5 -381 -5 l-377 -1 -17 -25 c-15 -23 -17 -76 -20 -462 -2 -241 -5 -443 -8 -450 -3 -9 -62 -12 -247 -12 -134 0 -249 4 -256 8 -10 7 -13 103 -13 453 0 418 -1 445 -19 467 -18 22 -21 22 -265 22 -258 0 -293 5 -309 46 -4 9 -6 148 -6 307 l1 290 27 21 c26 20 38 21 401 24 331 3 378 5 394 19 16 15 18 41 17 359 -1 307 -3 344 -18 357 -11 10 -44 15 -97 16 -44 2 -85 7 -92 13 -12 10 -17 4 -14 -14 1 -11 -21 -10 -39 1 -8 6 -19 7 -25 3 -43 -27 -185 41 -185 88 0 9 -2 19 -5 22 -3 2 -6 133 -7 290 -2 157 0 281 4 275 5 -8 8 -8 8 -1 0 6 -3 14 -7 17 -12 13 -6 326 8 360 15 36 42 62 79 79 18 7 346 10 1098 9 769 -1 1072 1 1072 9 0 7 6 8 14 3 8 -4 220 -6 472 -3z"/><path d="M2812 3904 c16 -19 8 -19 -895 -19 -502 1 -974 -2 -1050 -5 -133 -5 -139 -6 -157 -30 -19 -24 -20 -47 -20 -457 l0 -432 23 -26 c23 -28 39 -33 101 -34 35 -1 37 -3 25 -18 -10 -12 -4 -10 18 5 31 22 63 29 63 15 0 -5 314 -7 697 -6 384 2 1001 4 1371 5 369 2 672 -1 672 -5 0 -5 5 -5 10 -2 13 8 918 7 963 -1 18 -3 27 -2 20 3 -6 4 125 7 292 6 l303 -3 31 30 32 29 -1 313 c-1 354 -1 366 10 323 l8 -30 1 27 c0 15 -3 30 -9 33 -6 3 -10 50 -10 104 0 93 -1 100 -26 125 l-27 26 -728 0 c-549 0 -728 3 -731 12 -2 6 -9 8 -16 5 -6 -4 -218 -9 -471 -11 -456 -4 -461 -4 -488 17 -25 19 -26 19 -11 1z m2458 -73 c6 -13 10 -171 10 -445 l0 -425 -22 -15 c-20 -14 -251 -16 -2258 -16 -2007 0 -2238 2 -2258 16 l-22 15 0 433 c0 323 3 435 12 444 9 9 527 12 2270 12 2221 0 2257 0 2268 -19z"/><path d="M1281 3494 c-57 -47 -30 -136 46 -150 27 -5 37 -1 63 24 40 41 41 83 1 123 -36 36 -70 37 -110 3z m101 -28 c12 -18 9 -50 -7 -72 -10 -16 -22 -20 -42 -16 -37 6 -50 17 -56 47 -9 48 78 81 105 41z"/><path d="M4611 3494 c-44 -37 -44 -91 1 -129 84 -71 186 48 109 126 -36 36 -70 37 -110 3z m87 -22 c28 -16 29 -55 2 -82 -48 -48 -114 16 -81 79 11 20 46 21 79 3z"/><path d="M1206 3483 c-6 -14 -5 -15 5 -6 7 7 10 15 7 18 -3 3 -9 -2 -12 -12z"/><path d="M1416 3318 c3 -5 10 -6 15 -3 13 9 11 12 -6 12 -8 0 -12 -4 -9 -9z"/><path d="M849 2853 c-13 -16 -12 -17 4 -4 9 7 17 15 17 17 0 8 -8 3 -21 -13z"/><path d="M2144 2820 c-385 -4 -494 -8 -507 -18 -14 -12 -16 -56 -16 -355 -1 -277 2 -345 13 -360 12 -16 30 -18 137 -17 68 1 129 1 134 0 6 0 210 0 454 0 326 0 447 -2 457 -11 12 -9 13 -9 9 3 -5 13 9 16 45 9 3 -1 338 -1 745 -1 687 0 741 1 753 17 9 13 12 98 12 360 -1 341 -1 343 -23 358 -19 13 -72 15 -379 15 -197 -1 -362 1 -368 5 -5 3 -10 3 -10 -2 0 -4 -11 -9 -25 -9 -14 -1 -25 1 -25 5 0 3 -33 5 -72 4 -154 -6 -838 -8 -841 -3 -1 3 -223 3 -493 0z m2206 -375 l0 -345 -1350 0 -1350 0 0 345 0 345 1350 0 1350 0 0 -345z"/><path d="M1195 2804 c-18 -13 -19 -31 -19 -358 0 -268 3 -348 13 -360 11 -13 39 -16 160 -16 102 0 152 4 164 13 15 10 17 42 22 256 2 145 0 251 -5 262 -6 10 -6 19 -1 21 14 5 -2 178 -18 187 -7 5 -77 8 -155 9 -105 0 -146 -4 -161 -14z m305 -359 l0 -345 -147 0 -148 0 0 345 0 345 148 0 147 0 0 -345z"/><path d="M4484 2799 c-16 -18 -18 -46 -18 -359 0 -266 3 -342 14 -355 11 -13 34 -15 141 -14 71 2 132 0 135 -4 4 -3 19 0 34 8 l27 14 6 175 c9 236 -2 526 -20 533 -7 3 -11 9 -8 13 3 4 -62 8 -144 8 -136 1 -150 0 -167 -19z m311 -354 l0 -345 -147 0 -148 0 0 345 0 345 148 0 147 0 0 -345z"/><path d="M1930 2049 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10 -5 -10 -11z"/><path d="M4625 2020 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0 -8 -4 -11 -10z"/><path d="M1836 2003 c-6 -14 -5 -15 5 -6 7 7 10 15 7 18 -3 3 -9 -2 -12 -12z"/><path d="M1852 1987 c-9 -11 -23 -12 -55 -6 -23 4 -353 8 -733 8 l-692 0 -21 -23 c-22 -23 -22 -30 -20 -250 1 -130 6 -226 11 -226 5 0 7 -4 4 -9 -3 -5 1 -11 9 -15 8 -3 421 -5 917 -6 l902 0 23 -26 c13 -15 23 -22 23 -17 0 6 -7 16 -15 23 -9 7 -13 15 -11 17 7 7 1828 3 1839 -4 5 -3 14 1 19 8 5 8 11 10 14 4 4 -11 887 -10 905 0 5 4 14 3 21 -1 17 -11 68 -12 62 -2 -3 4 0 8 5 8 6 0 11 -5 11 -11 0 -5 4 -8 9 -5 4 3 131 6 281 6 265 1 274 2 292 22 17 19 18 39 13 247 -4 184 -8 228 -20 241 -14 13 -218 15 -1893 15 -1032 0 -1880 4 -1883 8 -3 4 -11 2 -17 -6z m3788 -267 l0 -230 -2640 0 -2640 0 0 230 0 230 2640 0 2640 0 0 -230z"/><path d="M1179 1385 c-3 -2 -53 -5 -113 -6 -95 -2 -109 -5 -122 -23 -12 -17 -14 -89 -14 -417 0 -365 1 -397 18 -412 26 -24 294 -23 323 1 18 16 19 33 19 417 l0 400 -32 22 c-24 17 -35 20 -51 11 -14 -7 -17 -7 -13 1 7 11 -6 16 -15 6z m81 -440 l0 -405 -150 0 -150 0 0 405 0 405 150 0 150 0 0 -405z"/><path d="M4868 1385 c-3 -3 -33 -6 -67 -7 -101 -3 -95 24 -95 -435 0 -304 2 -397 12 -401 7 -2 10 -8 6 -13 -3 -5 -2 -9 3 -10 4 0 17 -3 28 -5 25 -6 137 -5 144 1 2 3 11 0 18 -7 11 -9 16 -9 23 2 7 12 11 11 26 -1 14 -11 16 -11 9 0 -6 11 -1 13 24 9 17 -2 31 0 31 5 0 6 3 7 7 4 3 -4 12 1 19 11 11 13 13 100 13 407 0 333 -2 393 -15 410 -8 11 -20 20 -27 21 -7 0 -25 4 -41 9 -16 4 -31 4 -35 -2 -7 -11 -63 -12 -72 0 -3 4 -8 5 -11 2z m172 -440 l0 -405 -150 0 -150 0 0 405 0 405 150 0 150 0 0 -405z"/><path d="M4597 359 c7 -7 15 -10 18 -7 3 3 -2 9 -12 12 -14 6 -15 5 -6 -5z"/></g></svg>`;

function getLinearOpacity(
    zoom: number,
    startZoom: number,
    fullOpacityZoom: number,
) {
    if (zoom <= startZoom) {
        return 0;
    }
    if (zoom >= fullOpacityZoom) {
        return 1;
    }
    return (zoom - startZoom) / (fullOpacityZoom - startZoom);
}

function createHouseNumberStyle(
    houseNumber: string,
    fontSizePx: number,
    opacity: number,
) {
    return new Style({
        text: new Text({
            text: houseNumber,
            font: `bold ${fontSizePx}px Arial, sans-serif`,
            fill: new Fill({ color: `rgba(107, 114, 128, ${opacity})` }),
            stroke: new Stroke({
                color: `rgba(255, 255, 255, ${opacity})`,
                width: 3,
            }),
            overflow: true,
        }),
    });
}

function createPlaceStyle(category: PlaceCategory, placeSubtype?: string) {
    const iconSvg =
        placeSubtype === "bench"
            ? BENCH_ICON_SVG
            : category === "parking"
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4" fill="#2563eb"/><path d="M7 5h4.5a3 3 0 0 1 0 6H9.2v3H7V5Zm2.2 1.9v2.3h2.1a1.15 1.15 0 1 0 0-2.3H9.2Z" fill="#fff"/></svg>`
              : category === "playground"
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#16a34a"/><path d="M6 5.5h1.2V14H6V5.5Zm6.8 0H14V14h-1.2V5.5ZM7.2 6.3h5.6v1H7.2v-1Zm1.6 2.3h2.4c.5 0 .8.3.8.8v2.2c0 .5-.3.8-.8.8H8.8c-.5 0-.8-.3-.8-.8V9.4c0-.5.3-.8.8-.8Z" fill="#fff"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10 1.8a6 6 0 0 0-6 6c0 4.3 4.5 8.6 5.4 9.4.35.3.85.3 1.2 0 .9-.8 5.4-5.1 5.4-9.4a6 6 0 0 0-6-6Z" fill="#d97706"/><circle cx="10" cy="7.8" r="2.2" fill="#fff"/></svg>`;
    const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(iconSvg)}`;

    return new Style({
        image: new Icon({
            src: iconUrl,
            anchor: [0.5, 0.9],
        }),
    });
}

async function fetchHouseNumberFeatures(
    bbox: [number, number, number, number],
    signal: AbortSignal,
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

    const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
        },
        body: overpassQuery,
        signal,
    });

    if (!response.ok) {
        throw new Error("Failed to load house numbers from Overpass API");
    }

    const data = (await response.json()) as OverpassResponse;

    return data.elements
        .map((element) => {
            const houseNumber = element.tags?.["addr:housenumber"];
            const latitude = element.lat ?? element.center?.lat;
            const longitude = element.lon ?? element.center?.lon;

            if (
                !houseNumber ||
                latitude === undefined ||
                longitude === undefined
            ) {
                return null;
            }

            const feature = new Feature({
                geometry: new Point(fromLonLat([longitude, latitude])),
                houseNumber,
            });

            return feature;
        })
        .filter((feature): feature is Feature<Point> => feature !== null);
}

async function fetchPlaceFeatures(
    bbox: [number, number, number, number],
    signal: AbortSignal,
) {
    const [west, south, east, north] = bbox;
    const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="parking"](${south},${west},${north},${east});
          way["amenity"="parking"](${south},${west},${north},${east});
          relation["amenity"="parking"](${south},${west},${north},${east});

          node["leisure"="playground"](${south},${west},${north},${east});
          way["leisure"="playground"](${south},${west},${north},${east});
          relation["leisure"="playground"](${south},${west},${north},${east});

          node["amenity"](${south},${west},${north},${east});
          way["amenity"](${south},${west},${north},${east});
          relation["amenity"](${south},${west},${north},${east});
          node["tourism"](${south},${west},${north},${east});
          way["tourism"](${south},${west},${north},${east});
          relation["tourism"](${south},${west},${north},${east});
          node["shop"](${south},${west},${north},${east});
          way["shop"](${south},${west},${north},${east});
          relation["shop"](${south},${west},${north},${east});
        );
        out center;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8",
        },
        body: overpassQuery,
        signal,
    });

    if (!response.ok) {
        throw new Error("Failed to load places from Overpass API");
    }

    const data = (await response.json()) as OverpassResponse;
    const seen = new Set<string>();
    const unlabeledPlaces: UnlabeledPlaceLog[] = [];

    const features = data.elements
        .map((element) => {
            const latitude = element.lat ?? element.center?.lat;
            const longitude = element.lon ?? element.center?.lon;

            if (latitude === undefined || longitude === undefined) {
                return null;
            }

            const amenity = element.tags?.amenity;
            const leisure = element.tags?.leisure;

            const category: PlaceCategory =
                amenity === "parking" || amenity === "parking_space"
                    ? "parking"
                    : leisure === "playground"
                      ? "playground"
                      : "poi";

            const dedupeKey = `${element.type ?? "u"}-${element.id ?? `${latitude}-${longitude}`}-${category}`;
            if (seen.has(dedupeKey)) {
                return null;
            }
            seen.add(dedupeKey);

            const name = element.tags?.name?.trim();
            if (!name) {
                unlabeledPlaces.push({
                    category,
                    osmType: element.type ?? "unknown",
                    osmId: element.id ?? `${latitude}-${longitude}`,
                    amenity: element.tags?.amenity,
                    leisure: element.tags?.leisure,
                    tourism: element.tags?.tourism,
                    shop: element.tags?.shop,
                    latitude,
                    longitude,
                });
            }

            const feature = new Feature({
                geometry: new Point(fromLonLat([longitude, latitude])),
                placeCategory: category,
                placeSubtype:
                    element.tags?.amenity ??
                    element.tags?.leisure ??
                    element.tags?.tourism ??
                    element.tags?.shop ??
                    undefined,
            });

            return feature;
        })
        .filter((feature): feature is Feature<Point> => feature !== null);

    if (unlabeledPlaces.length > 0) {
        console.groupCollapsed(
            `[WendessenMap] Unlabeled places (${unlabeledPlaces.length})`,
        );
        console.table(unlabeledPlaces);
        console.groupEnd();
    }

    return features;
}

export default function WendessenMap() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number | null>(null);

    useEffect(() => {
        let map: Map | null = null;
        let removeZoomListener: (() => void) | null = null;
        const abortController = new AbortController();

        const initializeMap = async () => {
            if (!mapContainerRef.current) {
                return;
            }

            const projectedExtent = transformExtent(
                WENDESSEN_EXTENT_LON_LAT,
                "EPSG:4326",
                "EPSG:3857",
            );

            const [houseNumberFeatures, placeFeatures] = await Promise.all([
                fetchHouseNumberFeatures(
                    WENDESSEN_EXTENT_LON_LAT,
                    abortController.signal,
                ),
                fetchPlaceFeatures(
                    WENDESSEN_EXTENT_LON_LAT,
                    abortController.signal,
                ),
            ]);

            if (abortController.signal.aborted) {
                return;
            }

            const view = new View({
                center: fromLonLat(WENDESSEN_CENTER_LON_LAT),
                zoom: 14,
                maxZoom: 19,
                extent: projectedExtent,
                constrainOnlyCenter: false,
            });

            let lastZoomLabelUpdate = 0;
            const updateZoomLevel = () => {
                const now = performance.now();
                if (now - lastZoomLabelUpdate < ZOOM_LABEL_UPDATE_INTERVAL_MS) {
                    return;
                }
                lastZoomLabelUpdate = now;
                const currentZoom = view.getZoom();
                if (typeof currentZoom === "number") {
                    setZoomLevel(Number(currentZoom.toFixed(2)));
                }
            };

            view.on("change:resolution", updateZoomLevel);
            removeZoomListener = () => {
                view.un("change:resolution", updateZoomLevel);
            };

            const styleCache = new globalThis.Map<string, Style>();
            const placeStyleCache = new globalThis.Map<string, Style>();

            const placeLayer = new VectorLayer({
                source: new VectorSource({
                    features: placeFeatures,
                }),
                declutter: true,
                updateWhileAnimating: true,
                updateWhileInteracting: true,
                style: (feature, resolution) => {
                    const category = feature.get("placeCategory");
                    if (
                        category !== "parking" &&
                        category !== "playground" &&
                        category !== "poi"
                    ) {
                        return undefined;
                    }

                    const subtype = feature.get("placeSubtype");
                    const placeSubtype =
                        typeof subtype === "string" ? subtype : undefined;

                    const zoom = view.getZoomForResolution(resolution);
                    const zoomBucket =
                        typeof zoom === "number"
                            ? Math.round(zoom * 10) / 10
                            : 0;

                    if (
                        placeSubtype === "bench" &&
                        zoomBucket < MAP_VISIBILITY_CONFIG.places.benchMinZoom
                    ) {
                        return undefined;
                    }

                    const benchVisibilityBucket =
                        placeSubtype === "bench" ? "bench-visible" : "default";
                    const styleSubtypeBucket =
                        placeSubtype === "bench" ? "bench" : "default";
                    const cacheKey = `${category}-${benchVisibilityBucket}-${styleSubtypeBucket}`;
                    const cachedStyle = placeStyleCache.get(cacheKey);
                    if (cachedStyle) {
                        return cachedStyle;
                    }

                    const style = createPlaceStyle(category, placeSubtype);
                    placeStyleCache.set(cacheKey, style);
                    return style;
                },
            });

            const houseNumberLayer = new VectorLayer({
                source: new VectorSource({
                    features: houseNumberFeatures,
                }),
                declutter: true,
                updateWhileAnimating: true,
                updateWhileInteracting: true,
                style: (feature, resolution) => {
                    const houseNumber = feature.get("houseNumber");
                    if (typeof houseNumber !== "string") {
                        return undefined;
                    }

                    const zoom = view.getZoomForResolution(resolution);
                    if (
                        zoom === undefined ||
                        zoom <= MAP_VISIBILITY_CONFIG.houseNumbers.startZoom
                    ) {
                        return undefined;
                    }

                    const zoomBucket = Math.round(zoom * 10) / 10;

                    const fontSizeRaw = Math.max(
                        8,
                        Math.min(14, 8 + (zoomBucket - 14) * 1.5),
                    );
                    const fontSizePx = Math.round(fontSizeRaw * 2) / 2;
                    const opacityRaw = getLinearOpacity(
                        zoomBucket,
                        MAP_VISIBILITY_CONFIG.houseNumbers.startZoom,
                        MAP_VISIBILITY_CONFIG.houseNumbers.fullOpacityZoom,
                    );
                    const opacityBucket = Math.round(opacityRaw * 20) / 20;

                    const cacheKey = `${houseNumber}-${fontSizePx}-${opacityBucket}`;
                    const cachedStyle = styleCache.get(cacheKey);
                    if (cachedStyle) {
                        return cachedStyle;
                    }

                    const style = createHouseNumberStyle(
                        houseNumber,
                        fontSizePx,
                        opacityBucket,
                    );
                    styleCache.set(cacheKey, style);
                    return style;
                },
            });

            map = new Map({
                target: mapContainerRef.current,
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: BASEMAP.url,
                            attributions: BASEMAP.attribution,
                            wrapX: false,
                        }),
                    }),
                    placeLayer,
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
                if (typeof fittedZoom === "number") {
                    view.setMinZoom(12.5);
                    view.setZoom(fittedZoom);
                }
            }

            updateZoomLevel();
        };

        initializeMap().catch((error) => {
            if (!abortController.signal.aborted) {
                console.error("Failed to initialize map data:", error);
            }
        });

        return () => {
            abortController.abort();
            if (removeZoomListener) {
                removeZoomListener();
            }
            if (map) {
                map.setTarget(undefined);
            }
        };
    }, []);

    return (
        <div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">
                    Zoom: {zoomLevel?.toFixed(2) ?? "-"}
                </div>
                <div
                    ref={mapContainerRef}
                    className="aspect-square w-full"
                    aria-label="Interaktive Karte von Wendessen"
                />
            </div>
        </div>
    );
}

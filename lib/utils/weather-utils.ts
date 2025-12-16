// Weather data parsing utilities for Wendessen weather station

export interface WeatherData {
    location: string;
    elevation: string;
    lastUpdate: string;
    temperature: {
        current: number;
        average: number;
        min: { value: number; time: string };
        max: { value: number; time: string };
        change5min: number;
        change60min: number;
    };
    humidity: {
        current: number;
        average: number;
        min: { value: number; time: string };
        max: { value: number; time: string };
    };
    dewPoint: {
        current: number;
        average: number;
        min: { value: number; time: string };
        max: { value: number; time: string };
    };
    windChill: {
        current: number;
        average: number;
        min: { value: number; time: string };
        max: { value: number; time: string };
    };
    wind: {
        speed: number;
        speedAvg: number;
        speedMax: number;
        speedMaxTime: string;
        direction: string;
        degrees: number;
        directionDominant: string;
        gusts: number;
        gustsAvg: number;
        gustsMax: number;
        gustsMaxTime: string;
    };
    pressure: {
        current: number;
        average: number;
        min: { value: number; time: string };
        max: { value: number; time: string };
        trend1h: number;
        trend3h: number;
        trend6h: number;
        trend12h: number;
        trend24h: number;
    };
    solar: {
        current: number;
        average: number;
        max: number;
        maxTime: string;
        uvIndex: number;
        uvIndexAvg: number;
        uvIndexMax: number;
        sunshineToday: number; // minutes
        sunshineYear: string; // hours:minutes
    };
    precipitation: {
        lastHour: number;
        last24h: number;
        today: number;
        week: number;
        month: number;
        year: number;
        daysYear: number;
    };
    forecast: string;
}

/**
 * Parse weather report text from Wendessen weather station
 */
export function parseWeatherReport(reportText: string): WeatherData {
    const lines = reportText.split('\n').map(l => l.trim());

    // Helper to extract number from text
    const extractNumber = (text: string): number => {
        const match = text.match(/-?\d+[,.]?\d*/);
        if (!match) return 0;
        return parseFloat(match[0].replace(',', '.'));
    };

    // Helper to extract time
    const extractTime = (text: string): string => {
        const match = text.match(/\d{2}:\d{2}/);
        return match ? match[0] : '';
    };

    // Helper to get value from "label value" line
    const getValue = (lineIndex: number): number => {
        if (lineIndex < 0 || lineIndex >= lines.length) return 0;
        const line = lines[lineIndex];
        // Extract the last number from the line (handles formats like "aktuell    3,4 °C")
        const numbers = line.match(/-?\d+[,.]?\d*/g);
        if (!numbers || numbers.length === 0) return 0;
        // Get the first significant number (skip Bft values)
        const value = numbers[0].replace(',', '.');
        return parseFloat(value);
    };

    // Helper to get time from line
    const getTime = (lineIndex: number): string => {
        if (lineIndex < 0 || lineIndex >= lines.length) return '';
        return extractTime(lines[lineIndex]);
    };

    // Use fixed 0-based line indices based on the stable report layout
    const tempIndex = 3; // "Temperatur Außen"
    const humidityIndex = 19; // "Luftfeuchte Außen"
    const dewPointIndex = 25; // "Taupunkt"
    const windChillIndex = 31; // "Windchill"
    const solarIndex = 37; // "Solarstrahlung"
    const uvIndex = 43; // "UV-Index"
    const windSpeedIndex = 53; // "Windgeschwindigkeit"
    const windGustsIndex = 58; // "Windböen"
    const windDirIndex = 63; // "Windrichtung"
    const precipIndex = 67; // "Niederschlag"
    const pressureIndex = 76; // "Luftdruck"
    const forecastIndex = 89; // "Wettervorhersage"

    return {
        location: 'Wendessen bei Wolfenbüttel',
        elevation: '79 m über NN',
        lastUpdate: lines[1] || '',

        temperature: {
            current: getValue(tempIndex + 1),
            average: getValue(tempIndex + 2),
            min: {
                value: getValue(tempIndex + 3),
                time: getTime(tempIndex + 3),
            },
            max: {
                value: getValue(tempIndex + 4),
                time: getTime(tempIndex + 4),
            },
            change5min: getValue(16),
            change60min: getValue(17),
        },

        humidity: {
            current: getValue(humidityIndex + 1),
            average: getValue(humidityIndex + 2),
            min: {
                value: getValue(humidityIndex + 3),
                time: getTime(humidityIndex + 3),
            },
            max: {
                value: getValue(humidityIndex + 4),
                time: getTime(humidityIndex + 4),
            },
        },

        dewPoint: {
            current: getValue(dewPointIndex + 1),
            average: getValue(dewPointIndex + 2),
            min: {
                value: getValue(dewPointIndex + 3),
                time: getTime(dewPointIndex + 3),
            },
            max: {
                value: getValue(dewPointIndex + 4),
                time: getTime(dewPointIndex + 4),
            },
        },

        windChill: {
            current: getValue(windChillIndex + 1),
            average: getValue(windChillIndex + 2),
            min: {
                value: getValue(windChillIndex + 3),
                time: getTime(windChillIndex + 3),
            },
            max: {
                value: getValue(windChillIndex + 4),
                time: getTime(windChillIndex + 4),
            },
        },

        wind: {
            speed: getValue(windSpeedIndex + 1),
            speedAvg: getValue(windSpeedIndex + 2),
            speedMax: getValue(windSpeedIndex + 3),
            speedMaxTime: getTime(windSpeedIndex + 3),
            direction: windDirIndex >= 0 ? lines[windDirIndex + 1].trim().split(/\s+/)[1] || 'N' : 'N',
            degrees: windDirIndex >= 0 ? extractNumber(lines[windDirIndex + 1].match(/\d+\s*°/)?.[0] || '0') : 0,
            directionDominant: windDirIndex >= 0 ? lines[windDirIndex + 2].trim().split(/\s+/).pop() || 'N' : 'N',
            gusts: getValue(windGustsIndex + 1),
            gustsAvg: getValue(windGustsIndex + 2),
            gustsMax: getValue(windGustsIndex + 3),
            gustsMaxTime: getTime(windGustsIndex + 3),
        },

        pressure: {
            current: getValue(pressureIndex + 1),
            average: getValue(pressureIndex + 2),
            min: {
                value: getValue(pressureIndex + 3),
                time: getTime(pressureIndex + 3),
            },
            max: {
                value: getValue(pressureIndex + 4),
                time: getTime(pressureIndex + 4),
            },
            trend1h: getValue(82),
            trend3h: getValue(84),
            trend6h: getValue(85),
            trend12h: getValue(86),
            trend24h: getValue(87),
        },

        solar: {
            current: getValue(solarIndex + 1),
            average: getValue(solarIndex + 2),
            max: getValue(solarIndex + 4),
            maxTime: getTime(solarIndex + 4),
            uvIndex: getValue(uvIndex + 1),
            uvIndexAvg: getValue(uvIndex + 2),
            uvIndexMax: getValue(uvIndex + 4),
            sunshineToday: getValue(50),
            sunshineYear: lines[51]?.split(/\s+/).filter(p => p.includes(':'))[0] || '0:00',
        },

        precipitation: {
            lastHour: getValue(68),
            last24h: getValue(69),
            today: getValue(70),
            week: getValue(71),
            month: getValue(72),
            year: getValue(73),
            daysYear: getValue(74),
        },

        forecast: forecastIndex >= 0 ? lines[forecastIndex].split(':').pop()?.trim() || 'veränderlich' : 'veränderlich',
    };
}

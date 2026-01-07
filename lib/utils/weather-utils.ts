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
    // Keep raw (untrimmed) lines for column-based slicing (first 25 chars are label/padding)
    const rawLines = reportText.split('\n').map(l => l.replace(/\r?$/, ''));

    // Helper to extract number from text


    // Helper to extract time
    const extractTime = (text: string): string => {
        const match = text.match(/\d{2}:\d{2}/);
        return match ? match[0] : '';
    };

    // Helper to parse a "label value" line into structured data.
    // Values in the report are aligned: the first 25 characters are the label/padding.
    const parseLine = (lineIndex: number) => {
        const empty = { raw: '', value: 0, numbers: [] as number[], unit: '', time: '' };
        if (lineIndex < 0 || lineIndex >= rawLines.length) return empty;
        const rawLine = rawLines[lineIndex];
        // Find the first numeric character in the line and slice from there.
        // This is robust against slight alignment differences while still
        // ignoring the left label area.
        const firstNum = rawLine.search(/-?\d/);
        let data = '';
        if (firstNum >= 0) {
            data = rawLine.slice(firstNum).replace(/^\s+/, '');
        } else {
            // Fallback: slice at column 25 then trim
            data = rawLine.length > 25 ? rawLine.slice(25).replace(/^\s+/, '') : rawLine.replace(/^\s+/, '');
        }

        const timeMatch = data.match(/\d{2}:\d{2}/);
        const time = timeMatch ? timeMatch[0] : '';

        const numberMatches = data.match(/-?\d+[,.]?\d*/g) || [];
        const numbers = numberMatches.map(n => parseFloat(n.replace(',', '.')));
        const value = numbers.length > 0 ? numbers[0] : 0;

        const unitMatch = data.match(/(°C|W\/m²|UV-I|%|hPa|l\/m²|Bft|km\/h|Minuten|Stunden|°)/i);
        const unit = unitMatch ? unitMatch[1] : '';

        return { raw: data, value, numbers, unit, time };
    };

    // Backwards-compatible wrapper: returns the parsed object (use `.value` or `.time` at call sites)
    const getValue = (lineIndex: number) => parseLine(lineIndex);

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

    const pressureIndex = 76; // "Luftdruck"
    const forecastIndex = 89; // "Wettervorhersage"

    return {
        location: 'Wendessen bei Wolfenbüttel',
        elevation: '79 m über NN',
        lastUpdate: lines[1] || '',

        temperature: {
            current: getValue(tempIndex + 1).value,
            average: getValue(tempIndex + 2).value,
            min: {
                value: getValue(tempIndex + 3).value,
                time: getValue(tempIndex + 3).time || getTime(tempIndex + 3),
            },
            max: {
                value: getValue(tempIndex + 4).value,
                time: getValue(tempIndex + 4).time || getTime(tempIndex + 4),
            },
            change5min: getValue(16).value,
            change60min: getValue(17).value,
        },

        humidity: {
            current: getValue(humidityIndex + 1).value,
            average: getValue(humidityIndex + 2).value,
            min: {
                value: getValue(humidityIndex + 3).value,
                time: getValue(humidityIndex + 3).time || getTime(humidityIndex + 3),
            },
            max: {
                value: getValue(humidityIndex + 4).value,
                time: getValue(humidityIndex + 4).time || getTime(humidityIndex + 4),
            },
        },

        dewPoint: {
            current: getValue(dewPointIndex + 1).value,
            average: getValue(dewPointIndex + 2).value,
            min: {
                value: getValue(dewPointIndex + 3).value,
                time: getValue(dewPointIndex + 3).time || getTime(dewPointIndex + 3),
            },
            max: {
                value: getValue(dewPointIndex + 4).value,
                time: getValue(dewPointIndex + 4).time || getTime(dewPointIndex + 4),
            },
        },

        windChill: {
            current: getValue(windChillIndex + 1).value,
            average: getValue(windChillIndex + 2).value,
            min: {
                value: getValue(windChillIndex + 3).value,
                time: getValue(windChillIndex + 3).time || getTime(windChillIndex + 3),
            },
            max: {
                value: getValue(windChillIndex + 4).value,
                time: getValue(windChillIndex + 4).time || getTime(windChillIndex + 4),
            },
        },

        wind: {
            speed: getValue(windSpeedIndex + 1).value,
            speedAvg: getValue(windSpeedIndex + 2).value,
            speedMax: getValue(windSpeedIndex + 3).value,
            speedMaxTime: getValue(windSpeedIndex + 3).time || getTime(windSpeedIndex + 3),
            direction: windDirIndex >= 0 ? (lines[windDirIndex + 1] ? lines[windDirIndex + 1].slice(25).trim().split(/\s+/)[0] : 'N') : 'N',
            degrees: windDirIndex >= 0 ? (getValue(windDirIndex + 1).numbers.find(n => n >= 0) || 0) : 0,
            directionDominant: windDirIndex >= 0 ? (lines[windDirIndex + 2] ? lines[windDirIndex + 2].slice(25).trim().split(/\s+/).pop() || 'N' : 'N') : 'N',
            gusts: getValue(windGustsIndex + 1).value,
            gustsAvg: getValue(windGustsIndex + 2).value,
            gustsMax: getValue(windGustsIndex + 3).value,
            gustsMaxTime: getValue(windGustsIndex + 3).time || getTime(windGustsIndex + 3),
        },

        pressure: {
            current: getValue(pressureIndex + 1).value,
            average: getValue(pressureIndex + 2).value,
            min: {
                value: getValue(pressureIndex + 3).value,
                time: getValue(pressureIndex + 3).time || getTime(pressureIndex + 3),
            },
            max: {
                value: getValue(pressureIndex + 4).value,
                time: getValue(pressureIndex + 4).time || getTime(pressureIndex + 4),
            },
            trend1h: getValue(82).value,
            trend3h: getValue(84).value,
            trend6h: getValue(85).value,
            trend12h: getValue(86).value,
            trend24h: getValue(87).value,
        },

        solar: {
            current: getValue(solarIndex + 1).value,
            average: getValue(solarIndex + 2).value,
            max: getValue(solarIndex + 4).value,
            maxTime: getValue(solarIndex + 4).time || getTime(solarIndex + 4),
            uvIndex: getValue(uvIndex + 1).value,
            uvIndexAvg: getValue(uvIndex + 2).value,
            uvIndexMax: getValue(uvIndex + 4).value,
            sunshineToday: getValue(50).value,
            sunshineYear: lines[51]?.slice(25).trim().split(/\s+/).filter(p => p.includes(':'))[0] || '0:00',
        },

        precipitation: {
            lastHour: getValue(68).value,
            last24h: getValue(69).value,
            today: getValue(70).value,
            week: getValue(71).value,
            month: getValue(72).value,
            year: getValue(73).value,
            daysYear: getValue(74).value,
        },

        forecast: forecastIndex >= 0 ? lines[forecastIndex].split(':').pop()?.trim() || 'veränderlich' : 'veränderlich',
    };
}

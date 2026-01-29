import { expect, test, describe } from "bun:test";
import { parseWeatherReport } from "../../lib/utils/weather-utils";

describe("weather-utils", () => {
  const generateMockReport = () => {
    const lines = new Array(100).fill(" ".repeat(30));
    lines[1] = "Last Update: 27.01.2026 17:00";
    
    // Temperature
    lines[3] = "Temperatur Außen".padEnd(25) + " ";
    lines[4] = "  Current".padEnd(25) + " 1.5 C";
    lines[5] = "  Average".padEnd(25) + " 1.2 C";
    lines[6] = "  Min".padEnd(25) + " 0.5 C (04:30)";
    lines[7] = "  Max".padEnd(25) + " 2.5 C (14:15)";
    lines[16] = "  Change 5m".padEnd(25) + " +0.1 C";
    lines[17] = "  Change 60m".padEnd(25) + " -0.2 C";

    // Humidity
    lines[19] = "Luftfeuchte Außen".padEnd(25) + " ";
    lines[20] = "  Current".padEnd(25) + " 85 %";
    lines[21] = "  Average".padEnd(25) + " 82 %";
    lines[22] = "  Min".padEnd(25) + " 75 % (12:00)";
    lines[23] = "  Max".padEnd(25) + " 90 % (02:00)";

    // Wind
    lines[53] = "Windgeschwindigkeit".padEnd(25) + " ";
    lines[54] = "  Speed".padEnd(25) + " 10.0 km/h";
    lines[63] = "Windrichtung".padEnd(25) + " ";
    lines[64] = " ".repeat(25) + "SW 225 °";

    // Pressure
    lines[76] = "Luftdruck".padEnd(25) + " ";
    lines[77] = "  Current".padEnd(25) + " 1013.2 hPa";
    lines[82] = "  Trend".padEnd(25) + " +0.5 hPa";

    // Solar
    lines[37] = "Solarstrahlung".padEnd(25) + " ";
    lines[38] = "  Current".padEnd(25) + " 150 W/m2";

    // Precipitation
    lines[70] = "  Today".padEnd(25) + " 1.2 mm";
    lines[73] = "  Year".padEnd(25) + " 120.4 mm";

    // Forecast
    lines[89] = "Wettervorhersage: Increasing clouds";

    return lines.join("\n");
  };

  const mockReport = generateMockReport();

  test("parseWeatherReport - should extract basic information", () => {
    const data = parseWeatherReport(mockReport);
    
    expect(data.location).toBeDefined();
    expect(data.temperature.current).toBe(1.5);
    expect(data.temperature.min.value).toBe(0.5);
    expect(data.temperature.max.value).toBe(2.5);
  });

  test("parseWeatherReport - should extract humidity", () => {
    const data = parseWeatherReport(mockReport);
    expect(data.humidity.current).toBe(85);
    expect(data.humidity.min.value).toBe(75);
  });

  test("parseWeatherReport - should extract wind", () => {
    const data = parseWeatherReport(mockReport);
    expect(data.wind.speed).toBe(10);
    expect(data.wind.direction).toBe("SW");
    expect(data.wind.degrees).toBe(225);
  });

  test("parseWeatherReport - should extract pressure", () => {
    const data = parseWeatherReport(mockReport);
    expect(data.pressure.current).toBe(1013.2);
    expect(data.pressure.trend1h).toBe(0.5);
  });

  test("parseWeatherReport - should extract precipitation", () => {
    const data = parseWeatherReport(mockReport);
    expect(data.precipitation.today).toBe(1.2);
    expect(data.precipitation.year).toBe(120.4);
  });
});

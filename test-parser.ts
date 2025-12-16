import { parseWeatherReport } from './lib/utils/weather-utils';
import * as fs from 'fs';

const reportText = fs.readFileSync('weather_sample.txt', 'utf-8');
const data = parseWeatherReport(reportText);

console.log('Parsed Weather Data:');
console.log('Temperature current:', data.temperature.current);
console.log('Temperature min:', data.temperature.min);
console.log('Temperature max:', data.temperature.max);
console.log('Humidity current:', data.humidity.current);
console.log('Wind speed:', data.wind.speed);
console.log('Wind direction:', data.wind.direction, data.wind.degrees);
console.log('Pressure:', data.pressure.current);
console.log('Solar:', data.solar.current);
console.log('Precipitation today:', data.precipitation.today);
console.log('Forecast:', data.forecast);

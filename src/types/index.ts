export interface StationConfig {
  stationId: string;
  busNumbers: string[];
}

export interface BusArrival {
  busNo: string;
  arrivalTimestamp: number;
  estimatedArrival: string;
}

export interface StopData {
  [stationId: string]: [number, number, string, string, string]; // [lat, lng, name, road, area]
}

export interface ServiceData {
  [busNumber: string]: {
    name: string;
    routes: string[][];
  };
}

export interface WeatherData {
  expected: boolean;
  details?: string[];
}

export type Theme = 'light' | 'dark';

export type TabType = 'home' | 'nearby' | 'settings' | 'notifications' | 'info';

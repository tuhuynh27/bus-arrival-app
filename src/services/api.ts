import type { BusArrival } from '../types';
import { timeoutSignal } from '../lib/utils';

// Define types for the bus API response
interface BusService {
  no: string;
  next?: {
    duration_ms: number | null;
    load?: string;
    type?: string;
  };
  subsequent?: {
    duration_ms: number | null;
    load?: string;
    type?: string;
  };
  next2?: {
    duration_ms: number | null;
    load?: string;
    type?: string;
  };
  next3?: {
    duration_ms: number | null;
    load?: string;
    type?: string;
  };
}

interface BusApiResponse {
  services: BusService[];
}

export const fetchBusArrivals = async (stationId: string, busNumbers: string[]): Promise<BusArrival[]> => {
  try {
    // Check if we're offline first
    if (!navigator.onLine) {
      throw new Error('Device is offline');
    }

    // Use the actual Singapore bus API from arrivelah2.busrouter.sg
    const response = await fetch(`https://arrivelah2.busrouter.sg/?id=${stationId}`, {
      signal: timeoutSignal(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch bus arrivals`);
    }
    
    const data: BusApiResponse = await response.json();
    const buses = data.services;
    const targetBuses = buses.filter((bus: BusService) => busNumbers.includes(bus.no));

    let arrivalTimes: BusArrival[] = [];

    targetBuses.forEach((bus: BusService) => {
      (['next', 'subsequent', 'next2', 'next3'] as const).forEach(key => {
        const busData = bus[key];
        if (busData && busData.duration_ms !== null && busData.duration_ms >= 0) {
          arrivalTimes.push({
            busNo: bus.no,
            arrivalTimestamp: Date.now() + busData.duration_ms,
            estimatedArrival: `${Math.floor(busData.duration_ms / 60000)} min`
          });
        }
      });
    });

    // Remove duplicates
    arrivalTimes = arrivalTimes.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.busNo === value.busNo && t.arrivalTimestamp === value.arrivalTimestamp
      ))
    );

    return arrivalTimes.sort((a, b) => a.arrivalTimestamp - b.arrivalTimestamp);
  } catch (error) {
    console.error(`Error fetching bus data for station ${stationId}:`, error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('offline')) {
        throw new Error('No internet connection');
      }
      if (error.name === 'TimeoutError') {
        throw new Error('Request timed out');
      }
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
    }
    
    throw error;
  }
};

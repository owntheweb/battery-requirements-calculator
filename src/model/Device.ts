export interface Device {
  id: string;
  name: string;
  quantity: number;
  volts: number;
  amps: number;
  ampType: 'A' | 'mA';
  maxWatts: number;
  estimatedWatts: number;
  hoursRunPerDay: number;
  totalWatts: number;
  totalEstimatedWatts: number;
  error: string;
}

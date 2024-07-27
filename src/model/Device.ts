export interface Device {
  id: number;
  name: string;
  quantity: number;
  volts: number;
  amps: number;
  ampType: 'A' | 'mA';
  maxWatts: number;
  estimatedWatts: number;
  totalWatts: number;
  totalEstimatedWatts: number;
  error: string;
}

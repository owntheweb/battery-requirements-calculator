import {useState, useCallback, useMemo} from 'react';
import {BatteryData} from '../model/BatteryData';
import {BatteryConfigurationData} from '../model/BatteryConfigurationData';
import {Device} from '../model/Device';
import {DeviceTotals} from '../model/DeviceTotals';

export interface BatteryMathData {
  totalMaxWatts: number;
  totalEstimatedWatts: number;
  totalDeviceAmps: number;
  dailyUsageEstimated: number;
  dailyUsageMax: number;
  totalBatteryVolts: number;
  totalBatteryAmpHours: number;
  totalBatteryWattHours: number;
  estimatedRunTime: number;
  worstCaseRunTime: number;
  estimatedDailyRunTime: number;
  maxDailyRunTime: number;
}

export function useBatteryCalculator() {
  const [batteryData, setBatteryData] = useState<BatteryData>({
    batteryType: 'Car Battery',
    volts: 13.5,
    ampHours: 100,
    wattHours: 1350,
    chemistry: 0.5,
  });

  const [batteryConfigurationData, setBatteryConfigurationData] =
    useState<BatteryConfigurationData>({
      seriesCount: 1,
      parallelCount: 1,
      totalVolts: 13.5,
      totalAmpHours: 100,
      totalWattHours: 1350,
    });

  const [devices, setDevices] = useState<Device[]>([]);

  const [deviceTotals, setDeviceTotals] = useState<DeviceTotals>({
    totalMaxWatts: 0,
    totalEstimatedWatts: 0,
  });

  const updateBatteryData = useCallback((data: BatteryData) => {
    setBatteryData(data);
  }, []);

  const updateBatteryConfig = useCallback(
    (config: BatteryConfigurationData) => {
      setBatteryConfigurationData(config);
    },
    []
  );

  const updateDevices = useCallback(
    (newDevices: Device[], totals: DeviceTotals) => {
      setDevices(newDevices);
      setDeviceTotals(totals);
    },
    []
  );

  const batteryMathData = useMemo<BatteryMathData>(() => {
    // Calculate total device amps
    const totalDeviceAmps = devices.reduce((sum, device) => {
      const amps = device.ampType === 'mA' ? device.amps / 1000 : device.amps;
      return sum + amps * device.quantity;
    }, 0);

    // Calculate daily usage
    const calculateDailyUsage = (useMaxWatts: boolean) => {
      return devices.reduce((sum, device) => {
        const watts = useMaxWatts ? device.maxWatts : device.estimatedWatts;
        return sum + watts * device.quantity * device.hoursRunPerDay;
      }, 0);
    };

    const dailyUsageEstimated = calculateDailyUsage(false);
    const dailyUsageMax = calculateDailyUsage(true);

    // Battery configuration calculations
    const totalBatteryVolts = batteryConfigurationData.totalVolts;
    const totalBatteryAmpHours = batteryConfigurationData.totalAmpHours;
    const totalBatteryWattHours = batteryConfigurationData.totalWattHours;

    // Run time calculations
    const estimatedRunTime =
      totalBatteryWattHours / deviceTotals.totalEstimatedWatts;
    const worstCaseRunTime = totalBatteryWattHours / deviceTotals.totalMaxWatts;
    const estimatedDailyRunTime = totalBatteryWattHours / dailyUsageEstimated;
    const maxDailyRunTime = totalBatteryWattHours / dailyUsageMax;

    return {
      totalMaxWatts: deviceTotals.totalMaxWatts,
      totalEstimatedWatts: deviceTotals.totalEstimatedWatts,
      totalDeviceAmps,
      dailyUsageEstimated,
      dailyUsageMax,
      totalBatteryVolts,
      totalBatteryAmpHours,
      totalBatteryWattHours,
      estimatedRunTime,
      worstCaseRunTime,
      estimatedDailyRunTime,
      maxDailyRunTime,
    };
  }, [devices, deviceTotals, batteryConfigurationData]);

  return {
    batteryData,
    batteryConfigurationData,
    devices,
    deviceTotals,
    batteryMathData,
    updateBatteryData,
    updateBatteryConfig,
    updateDevices,
  };
}

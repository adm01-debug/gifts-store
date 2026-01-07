import { useBitrixSyncAsync } from '@/hooks/useBitrixSyncAsync';
import { Progress } from '@/components/ui/progress';

export function BitrixSyncPageV2() {
  const { progress, startSync } = useBitrixSyncAsync();
  return <div><Progress value={progress} /><button onClick={startSync}>Sync</button></div>;
}

export default BitrixSyncPageV2;

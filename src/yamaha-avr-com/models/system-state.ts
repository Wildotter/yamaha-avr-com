export interface SystemState {
  isOn: boolean;
  isSleeping: boolean;
  volumeRelative: number;
  volumeDb: number;
  isMuted: boolean;
  currentInput: string;
  isPartyModeOn: boolean;
  isPureDirectModeOn: boolean;
  isExtraBassOn: boolean;
}

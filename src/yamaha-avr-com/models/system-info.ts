export interface SystemInfo {
  modelName: string;
  destination: string;
  deviceId: string;
  systemId: string;
  systemVersion: number;
  apiVersion: number;
  netModuleGeneration: number;
  netModuleVersion: number;
  netModuleChecksum: string;
  serialNumber: string;
  categoryCode: number;
  operationMode: string;
  updateErrorCode: string;
  netModuleNum: number;
  updateDataType: number
}

import {map, Observable} from "rxjs";
import {SystemFeatures} from "../models/system-features";
import {AdjustmentRangeStep} from "../models/adjustment-range-step";
import {SystemInfo} from "../models/system-info";
import {DEFAULT_HEADER, YAMAHA_SYSTEM_ENDPOINT} from "../globals";
import {Axios} from "axios-observable";


export class AvReceiverSystemService {

  constructor(private readonly http: Axios) { }

  get(): Observable<SystemInfo> {
    return this.http.get(
      `${YAMAHA_SYSTEM_ENDPOINT}/getDeviceInfo`,
      DEFAULT_HEADER
    ).pipe(
      map((response: any) => {
        const unmapped = response.data;
        const should: SystemInfo = {
          netModuleChecksum: unmapped.netmodule_checksum,
          apiVersion: unmapped.api_version,
          categoryCode: unmapped.category_code,
          destination: unmapped.destination,
          deviceId: unmapped.device_id,
          modelName: unmapped.model_name,
          netModuleGeneration: unmapped.netmodule_generation,
          netModuleNum: unmapped.netmodule_num,
          systemId: unmapped.system_id,
          netModuleVersion: unmapped.netmodule_version,
          systemVersion: unmapped.system_version,
          operationMode: unmapped.operation_mode,
          serialNumber: unmapped.serial_number,
          updateDataType: unmapped.update_data_type,
          updateErrorCode: unmapped.update_error_code
        };
        return should;
      })
    );
  }

  getFeatures(): Observable<SystemFeatures> {
    return this.http.get(
      `${YAMAHA_SYSTEM_ENDPOINT}/getFeatures`,
      DEFAULT_HEADER
    ).pipe(map((response: any) => {
      const unMapped = response.data;
      const zones: Array<any> = unMapped.zone;
      const unMappedZone = zones.find(o => o.id === 'main');
      const uncastRageSteps: Array<any> = unMappedZone.range_step;
      const castedRanges = new Map<string, AdjustmentRangeStep>();
      uncastRageSteps.forEach((range) => {
        castedRanges.set(range.id, range);
      });
      const shouldLookLike: SystemFeatures = {
        actual_volume_mode_list: unMappedZone.actual_volume_mode_list,
        audio_select_list: unMappedZone.audio_select_list,
        ccs_supported: unMappedZone.ccs_supported,
        id: unMappedZone.id,
        cursor_list: unMappedZone.cursor_list,
        func_list: unMappedZone.func_list,
        input_list: unMappedZone.input_list,
        link_audio_delay_list: unMappedZone.link_audio_delay_list,
        link_control_list: unMappedZone.link_control_list,
        menu_list: unMappedZone.menu_list,
        range_step: castedRanges,
        scene_num: unMappedZone.scene_num,
        sound_program_list: unMappedZone.sound_program_list,
        surr_decoder_type_list: unMappedZone.surr_decoder_type_list,
        tone_control_mode_list: unMappedZone.tone_control_mode_list
      }
      return shouldLookLike;
    }));
  }
}

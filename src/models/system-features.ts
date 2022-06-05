import {AdjustmentRangeStep} from "./adjustment-range-step";

export interface SystemFeatures {
  id: string;
  func_list: Array<string>;
  input_list: Array<string>;
  sound_program_list: Array<string>;
  surr_decoder_type_list: Array<string>;
  tone_control_mode_list: Array<string>;
  link_control_list:Array<string>;
  link_audio_delay_list: Array<string>;
  range_step: Map<string, AdjustmentRangeStep>;
  scene_num: number;
  cursor_list: Array<string>;
  menu_list: Array<string>;
  actual_volume_mode_list: Array<string>;
  audio_select_list: Array<string>;
  ccs_supported: Array<string>;
}

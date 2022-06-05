export const YAMAHA_AVR_IP = '';
export const YAMAHA_REST_ENDPOINT_V1 = `${YAMAHA_AVR_IP}/YamahaExtendedControl/v1`;

export const YAMAHA_MAIN_ENDPOINT = `${YAMAHA_REST_ENDPOINT_V1}/main`
export const YAMAHA_SYSTEM_ENDPOINT = `${YAMAHA_REST_ENDPOINT_V1}/system`
export const YAMAHA_TUNER_ENDPOINT = `${YAMAHA_REST_ENDPOINT_V1}/tuner`

/*
export const DEFAULT_HEADER = {
  headers: {'Content-Type': 'application/json'}
};
 */
export const DEFAULT_HEADER = {
  headers: {'Content-Type': 'application/json'}
};

export enum PowerMode {
  ON = "on",
  STAND_BY = "standby",
  TOGGLE = "toggle"
}
// CaseSensitive!
export enum InputChannel {
  TUNER = 'tuner',
  FM = 'fm',
  DAB = 'Dab'
}

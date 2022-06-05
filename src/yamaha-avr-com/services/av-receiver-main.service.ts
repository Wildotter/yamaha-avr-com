import {delay, map, Observable, of} from "rxjs";
import {SystemState} from "../models/system-state";
import {DEFAULT_HEADER, InputChannel, PowerMode, YAMAHA_MAIN_ENDPOINT} from "../globals";
import {Axios} from "axios-observable";

export class AvReceiverMainService {

  constructor(private readonly http: Axios) { }

  get(): Observable<SystemState> {
    return this.http.get(
      `${YAMAHA_MAIN_ENDPOINT}/getStatus`,
        DEFAULT_HEADER
    ).pipe(map((response: any) => {
      const unMapped = response.data;
      const should: SystemState = {
        isOn: unMapped.power === 'on',
        isMuted: unMapped.mute,
        currentInput: unMapped.input_text,
        volumeRelative: unMapped.volume,
        volumeDb: unMapped.actual_volume.value,
        isPartyModeOn: unMapped.party_enable,
        isPureDirectModeOn: unMapped.pure_direct,
        isExtraBassOn: unMapped.extra_bass,
        isSleeping: unMapped.power === 'standby'
      }
      return should;
    }));
  }

  setPower(to: PowerMode): Observable<boolean> {
    return this.http.get(
      `${YAMAHA_MAIN_ENDPOINT}/setPower?power=${to}`,
        DEFAULT_HEADER
    ).pipe(map((response: any) => {
      const unMapped = response.data;
      return unMapped.response_code === 0;
    }));
  }

  setInput(to: InputChannel): Observable<boolean> {
    return this.http.get(
      `${YAMAHA_MAIN_ENDPOINT}/setInput?input=${to}`,
        DEFAULT_HEADER
    ).pipe(map((response: any) => {
      const unMapped = response.data;
      return unMapped.response_code === 0;
    }));
  }

  setPureDirect(to: boolean): Observable<boolean> {
    return this.http.get(
      `${YAMAHA_MAIN_ENDPOINT}/setPureDirect?enable=${to}`,
        DEFAULT_HEADER
    ).pipe(map((response: any) => {
      const unMapped = response.data;
      return unMapped.response_code === 0;
    }));
  }

  setVolume(to: number): Observable<boolean> {
    return this.http.get(
      `${YAMAHA_MAIN_ENDPOINT}/setVolume?volume=${to}`,
        DEFAULT_HEADER
    ).pipe(map((response: any) => {
      const unMapped = response.data;
      return unMapped.response_code === 0;
    }));
  }

  timer(inMs: number): Observable<boolean> {
    return of(true).pipe(
      delay(inMs)
    )
  }
}

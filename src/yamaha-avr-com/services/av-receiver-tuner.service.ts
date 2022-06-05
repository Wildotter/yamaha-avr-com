import { delay, map, Observable, of, take} from "rxjs";
import {TunerPlayInfo} from "../models/tuner-play-info";
import {TunerPreset} from "../models/tuner-preset";
import {DEFAULT_HEADER, YAMAHA_TUNER_ENDPOINT} from "../globals";
import {Axios} from "axios-observable";


export enum BAND {
  FM = "fm",
  DAB = "dab"
}

export class AvReceiverTunerService {

  constructor(private readonly http: Axios) { }

  getPresets(forBand: BAND): Observable<Map<string, TunerPreset>> {
    return this.http.get(
      `${YAMAHA_TUNER_ENDPOINT}/getPresetInfo?band=${forBand}`,
        DEFAULT_HEADER
    ).pipe(
      take(1), // Unsubscribe after Response
      map((response: any) => {
        const unMapped = response.data;
        let list: Array<any> = unMapped.preset_info;
        const should = new Map<string, TunerPreset>();
        list = list.filter(o => o.band !== 'unknown');
        list.forEach(o => {
          should.set(o.text.trim(), {
            name: o.text,
            id: o.number
          });
        });
        return should;
      })
    );
  }

  set(band: BAND): Observable<any> {
    return this.http.get(
      `${YAMAHA_TUNER_ENDPOINT}/setBand?band=${band}`,
        DEFAULT_HEADER
    ).pipe(
      take(1), // Unsubscribe after Response
    );
  }

  nextPreset(): Observable<boolean> {
    return this.http.get(
      `${YAMAHA_TUNER_ENDPOINT}/switchPreset?dir=next`,
        DEFAULT_HEADER
    ).pipe(
      take(1), // Unsubscribe after Response
      map((response: any) => {
        const unMapped = response.data;
      return unMapped.response_code === 0;
    }));
  }

  timer(inMs: number): Observable<boolean> {
    return of(true).pipe(
      delay(inMs)
    )
  }

  justPlaying(): Observable<TunerPlayInfo> {
      return this.http.get(
        `${YAMAHA_TUNER_ENDPOINT}/getPlayInfo`,
          DEFAULT_HEADER
      ).pipe(
        take(1),
        map((response: any) => {
          const unMapped = response.data;
          return unMapped.dab;
        })
      );
  }

}

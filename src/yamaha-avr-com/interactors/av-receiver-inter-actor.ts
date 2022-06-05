import {AvReceiverSystemService} from "../services/av-receiver-system.service";
import {AvReceiverMainService} from "../services/av-receiver-main.service";
import {TunerInterActor} from "./tuner-inter-actor";
import {SystemState} from "../models/system-state";
import {map, Observable, of} from 'rxjs';
import {SystemFeatures} from "../models/system-features";
import {SystemInfo} from "../models/system-info";
import {Axios} from "axios-observable";
import {InputChannel, PowerMode} from "../globals";

export const TIME_AV_RECEIVER_NEEDS_TO_START = 2000;
export const TIME_AV_RECEIVER_NEEDS_TO_SWITCH_INPUT = 1000;

export interface StateSubscriber {
  updateState(state: SystemState): void;
}

export class AvReceiverInterActor {
  private state!: SystemState;
  info!: SystemInfo;
  set (newState: SystemState) {
    this.stateSubscriber?.updateState(newState);
  }

  tuner!: TunerInterActor;
  private readonly systemService: AvReceiverSystemService;
  private readonly mainService: AvReceiverMainService;
  stateSubscriber?: StateSubscriber;

  constructor() {
    const http = Axios;
    // @ts-ignore
    this.systemService = new AvReceiverSystemService(http);
    // @ts-ignore
    this.mainService = new AvReceiverMainService(http);
    this.tuner = new TunerInterActor();
    this.getState().subscribe((state) => {
      console.log('Fetched Initial State (see next Line)');
      console.log(state);
    });
  }

  getInfo(): Observable<SystemInfo> {
    if (this.info) {
      return of(this.info);
    } else {
      return this.systemService.get().pipe(map((info) => {
        this.info = info;
        return info;
      }));
    }
  }

  getState(): Observable<SystemState> {
    if (this.state) {
      return of(this.state);
    } else {
      return this.mainService.get().pipe(map((state) => {
        this.state = state;
        this.stateSubscriber?.updateState(state);
        return state;
      }));
    }
  }

  getFeatures(): Observable<SystemFeatures> {
    return this.systemService.getFeatures();
  }

  setPureDirect(activate: boolean): Observable<boolean> {
    return this.mainService.setPureDirect(activate).pipe(
      map((success) => {
        if (success){
          this.state.isPureDirectModeOn = activate;
        } else {
          throw new Error(`Not able to change Pure-Mode to ${activate}`)
        }
        return success;
      })
    );
  }

  setPower(mode: PowerMode): Observable<boolean> {
    return this.mainService.setPower(mode).pipe(
      map((success) => {
        if (success){
          this.state.isOn = mode === PowerMode.ON;
        } else {
          throw new Error(`Not able to change Power-Mode to ${mode}`)
        }
        return success;
      })
    );
  }

  changeVolume(to: number): Observable<boolean> {
    return this.mainService.setVolume(to).pipe(
      map((success) => {
        if (success){
          this.state.volumeRelative = to;
        } else {
          throw new Error(`Not able to change Volume to ${to}`)
        }
        return success;
      })
    );
  }

  activateAvIfNecessary(whenAvReceiverIsActivated: (avReceiverIsActivated: boolean) => void) {
    if (this.state.isOn) {
      whenAvReceiverIsActivated(true);
    } else {
      this.setPower(PowerMode.ON).subscribe((success) => {
        if (success) {
          this.mainService.timer(TIME_AV_RECEIVER_NEEDS_TO_START).subscribe(() => {
            whenAvReceiverIsActivated(success);
          });
        } else {
          throw new Error('Not able to start AV-Receiver')
        }
      });
    }
  }

  activateTunerIfNecessary(whenTunerIsActivated: (tunerIsActivated: boolean) => void) {
    if (this.state.currentInput.toLowerCase() === InputChannel.TUNER) {
      whenTunerIsActivated(true);
    } else {
      this.mainService.setInput(InputChannel.TUNER).subscribe((success) => {
        if (success) {
          this.state.currentInput = 'TUNER'
          this.mainService.timer(TIME_AV_RECEIVER_NEEDS_TO_SWITCH_INPUT).subscribe(() => {
            whenTunerIsActivated(success);
          });
        } else {
          throw new Error('Not able to set Input to Tuner')
        }
      })
    }
  }

}

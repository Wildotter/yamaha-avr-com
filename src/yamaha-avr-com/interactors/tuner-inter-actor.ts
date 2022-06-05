import {BAND, AvReceiverTunerService} from "../services/av-receiver-tuner.service";
import {TunerPlayInfo} from "../models/tuner-play-info";
import {Observable} from "rxjs";
import {TunerPreset} from "../models/tuner-preset";
import {Axios} from "axios-observable";

const DURATION_RECEIVER_NEEDS_TO_SWITCH_DAB_CHANNEL_MS = 1000;

export class TunerInterActor {

  private currentlyPlaying?: TunerPlayInfo;
  private readonly tunerService: AvReceiverTunerService


  constructor() {
    const http = Axios;
    // @ts-ignore
    this.tunerService = new AvReceiverTunerService(http);
    console.log(`Creating TunerInterActor with ${this.tunerService}`);
  }

  nextPreset(afterChannelSwitch: (info: TunerPlayInfo) => void) {
    this.tunerService.nextPreset().subscribe(() => {
      this.justPlaying(afterChannelSwitch);
    });
  }

  justPlaying(onInfoReceived: (info: TunerPlayInfo) => void) {
    this.tunerService.timer(DURATION_RECEIVER_NEEDS_TO_SWITCH_DAB_CHANNEL_MS).subscribe(() => {
      this.tunerService.justPlaying().subscribe((info) => {
          this.currentlyPlaying = info;
          onInfoReceived(info);
      });
    });
  }

  getPresets(): Observable<Map<string, TunerPreset>> {
    return this.tunerService.getPresets(BAND.DAB);
  }

  turnTo(desiredChannelName: string, onInfoReceived: (info: TunerPlayInfo) => void) {
    if (this.currentlyPlaying?.service_label !== desiredChannelName ) {
      this.tunerService.nextPreset().subscribe(() => {
        this.tunerService.timer(DURATION_RECEIVER_NEEDS_TO_SWITCH_DAB_CHANNEL_MS).subscribe(() => {
          this.tunerService.justPlaying().subscribe((info) => {
            this.currentlyPlaying = info;
            this.turnTo(desiredChannelName, onInfoReceived)
          });
        });
      });
    } else {
      onInfoReceived(this.currentlyPlaying);
    }
  }
}

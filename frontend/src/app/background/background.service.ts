import { Injectable } from '@angular/core';
import {
  BackgroundState,
  BackgroundAnimationState,
  BackgroundEvent,
  BackgroundEventType
} from './background';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  private _backgroundEvents = new Subject();
  backgroundEvents$ = this._backgroundEvents.asObservable();
  eventBackground: BackgroundEvent;

  setBackgroundState(backgroundState: BackgroundState) {
    this.eventBackground = {
      type: BackgroundEventType.STATE,
      value: backgroundState
    };
    this.next();
  }

  setBackgroundAnimationState(animationState: BackgroundAnimationState) {
    this.eventBackground = {
      type: BackgroundEventType.ANIMATION_STATE,
      value: animationState
    };
    this.next();
  }

  next() {
    this._backgroundEvents.next(this.eventBackground);
  }
}

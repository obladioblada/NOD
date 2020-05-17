export enum BackgroundState {
  IDLE = 0,
  LOADING = 1,
  SUCCESS = 2,
  ERROR = 3,
  PLAY = 4,
  JOINED = 5
}

export enum BackgroundAnimationState {
  PLAY = 0,
  PAUSE = 1,
  STOP = 2
}

export enum BackgroundEventType {
  STATE,
  ANIMATION_STATE,
}

export class BackgroundEvent {
  type: BackgroundEventType;
  value: BackgroundAnimationState | BackgroundState;
}

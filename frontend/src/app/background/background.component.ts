import { Component } from '@angular/core';
import { BackgroundService } from './background.service';
import { BackgroundEvent, BackgroundEventType, BackgroundAnimationState, BackgroundState } from './background';

@Component({
  selector: 'nod-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent {

  BackgroundState = BackgroundState;
  BackgroundAnimationState = BackgroundAnimationState;

  state: BackgroundState;
  animationState: BackgroundAnimationState;

  constructor(backgroundService: BackgroundService) {
    backgroundService.backgroundEvents$.subscribe((event: BackgroundEvent) => {
      switch (event.type) {
        case BackgroundEventType.ANIMATION_STATE:
          this.setBackgroundAnimationState(event.value as BackgroundAnimationState);
          break;
        case BackgroundEventType.STATE:
          this.setBackgroundState(event.value as BackgroundState);
          break;
        }
      });
    }
    setBackgroundAnimationState(value: BackgroundAnimationState) {
      this.animationState = value;
    }
    setBackgroundState(value: BackgroundState) {
      console.log("received state")
      console.log(value)
      this.state = value;
      if(value === BackgroundState.SUCCESS){
        setTimeout(() => {
          this.state = BackgroundState.IDLE;
        }, 300);
      }
    }
}

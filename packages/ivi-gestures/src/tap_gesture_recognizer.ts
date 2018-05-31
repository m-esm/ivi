import { GesturePointerEvent, GesturePointerAction } from "./gesture_pointer_event";
import { GestureRecognizer, GestureRecognizerState, GestureRecognizerUpdateAction } from "./gesture_recognizer";
import { GestureBehavior } from "./gesture_behavior";
import { GestureController } from "./gesture_controller";

const enum TapConstants {
  Delay = 300,
}

export class TapGestureRecognizer extends GestureRecognizer {
  private startX = 0;
  private startY = 0;
  private pointerId = -1;
  private timeoutHandle = -1;
  private timeoutHandler = () => {
    if (this.state & GestureRecognizerState.Active) {
      this.cancel();
    }
  }

  constructor(controller: GestureController) {
    super(
      controller,
      GestureBehavior.Tap,
      0,
      1,
    );
  }

  update(action: GestureRecognizerUpdateAction, data: GesturePointerEvent) {
    if (action === GestureRecognizerUpdateAction.Accepted) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = -1;
    } else if (action === GestureRecognizerUpdateAction.HandleEvent) {
      const evAction = data.action;
      if (evAction & GesturePointerAction.Down) {
        if (!(this.state & GestureRecognizerState.Active)) {
          this.pointerId = data.id;
          this.startX = data.pageX;
          this.startY = data.pageY;
          this.activate();
          setTimeout(this.timeoutHandler, TapConstants.Delay);
        }
      } else if (evAction & (GesturePointerAction.Move | GesturePointerAction.Up)) {
        if (this.pointerId === data.id) {
          if (evAction & GesturePointerAction.Move) {
            if (!(this.state & GestureRecognizerState.Resolved)) {
              let delta = Math.abs(this.startX - data.pageX);
              if (delta >= 8) {
                this.cancel();
              } else {
                delta = Math.abs(this.startY - data.pageY);
                if (delta >= 8) {
                  this.cancel();
                }
              }
            }
          } else {
            this.resolve();
            this.finish();
          }
        }
      }
    }
  }

  reset() {
    super.reset();
    if (this.timeoutHandle !== -1) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = -1;
    }
  }
}
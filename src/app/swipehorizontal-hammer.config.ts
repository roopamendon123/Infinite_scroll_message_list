import { HammerGestureConfig } from "@angular/platform-browser";
import * as Hammer from "hammerjs";

export class SwipeHorizontalHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
    pinch: { enable: false },
    rotate: { enable: false },
  };
}

import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  NgZone,
  OnDestroy,
} from "@angular/core";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { map, pairwise, filter, throttleTime } from "rxjs/operators";
import {
  trigger,
  animate,
  style,
  transition,
  keyframes,
} from "@angular/animations";
import { MessageService } from "../service/message.service";
import { Message } from "../model/message.model";
import { Observable } from "rxjs/internal/Observable";
import { Subscription } from "rxjs";

export const slideOutRight = [
  style({ transform: "translate3d(0, 0, 0)", offset: 0 }),
  style({ transform: "translate3d(150%, 0, 0)", opacity: 0, offset: 1 }), // can customize based on the requirement
];
export const slideOutLeft = [
  style({ transform: "translate3d(0, 0, 0)", offset: 0 }),
  style({ transform: "translate3d(-150%, 0, 0)", opacity: 0, offset: 1 }), // can customize based on the requirement
];

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.scss"],
  animations: [
    // these animations for swipeout and dismiss functionality
    trigger("swipeOut", [
      transition(
        "* => slideOutLeft",
        animate("3000ms ease-out", keyframes(slideOutLeft)) // can increase or decrease the animation timings
      ),
      transition(
        "* => slideOutRight",
        animate("3000ms ease-out", keyframes(slideOutRight)) // can increase or decrease the animation timings
      ),
    ]),
  ],
})
export class MessagesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("scroller") scroller: CdkVirtualScrollViewport;
  messageList: Message[] = [];

  loading: boolean = false;
  animationState: string[] = [];
  private sub: Subscription; // subscriptions

  constructor(
    private readonly messageService: MessageService,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {
    sessionStorage.removeItem("pageToken"); // here to remove or reset the token after refresh
    this.fetchMoreMessages();
  }

  // load the messages for infinite scroll
  ngAfterViewInit(): void {
    this.sub = this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset("bottom")),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.loading = true;
          this.fetchMoreMessages();
        });
      });
  }

  fetchMoreMessages(): void {
    this.sub = this.messageService.getMessages().subscribe(
      (data) => {
        this.loading = false;
        this.messageList = [...this.messageList, ...data];
        // sort the list
        this.messageList = this.messageList.sort((a: any, b: any) => {
          return <any>new Date(b.time) - <any>new Date(a.time);
        });
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  startAnimation(state: string, index: number): void {
    if (!this.animationState[index]) {
      this.animationState[index] = state;
    }
  }

  resetAnimationState(currentIndex: number, id: number): void {
    if (
      this.animationState[currentIndex] &&
      (this.animationState[currentIndex] == "slideOutLeft" ||
        this.animationState[currentIndex] == "slideOutRight")
    )
      this.messageList = this.messageList.filter((entry) => entry.id !== id);
    this.animationState.splice(currentIndex, 1);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

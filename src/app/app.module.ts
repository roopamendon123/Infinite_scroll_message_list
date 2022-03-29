import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerModule,
} from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatListModule } from "@angular/material/list";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MessagesComponent } from "./messages/messages.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SwipeHorizontalHammerConfig } from "./swipehorizontal-hammer.config";
import { RequestInterceptor } from "./service/request-interceptor";

@NgModule({
  declarations: [AppComponent, MessagesComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ScrollingModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    HammerModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: SwipeHorizontalHammerConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

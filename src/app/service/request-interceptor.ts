import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";

/**
 *
 * It is used to add common request header and authentication token for all the http request
 * ensure the header is applicable for all the API, otherwise add it in the http service itself
 * it is not good place if each API has different header info
 *
 */

@Injectable({ providedIn: "root" })
export class RequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (sessionStorage.getItem("pageToken")) {
      req = req.clone({
        url: `${req.url}?pageToken=${sessionStorage.getItem("pageToken")}`,
      });
    }
    return next
      .handle(req)
      .pipe(
        catchError((err) => {
          console.log("Error", err.message);
          throw err;
        })
      )
      .pipe(
        map<HttpEvent<any>, any>((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            sessionStorage.setItem("pageToken", event.body.pageToken);
          }
          return event;
        })
      );
  }
}

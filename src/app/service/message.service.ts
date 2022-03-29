import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Message } from "../model/message.model";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  protected resource: string = "https://message-list.appspot.com/";
  constructor(protected httpClient: HttpClient) {}

  // To get messages
  getMessages(): Observable<Message[]> {
    return this.httpClient.get(`${this.resource}/messages`).pipe(
      map((data: any) => {
        return this.convertDataToMessage(data);
      })
    );
  }

  // convert data into Message model
  convertDataToMessage(data): Message[] {
    let messageList: Message[] = [];
    return (messageList = data?.messages.map((list) => {
      return {
        id: list.id,
        name: list.author.name,
        photoUrl: `${this.resource}/${list.author.photoUrl}`,
        time: list.updated,
        description: list.content,
      };
    }));
  }
}

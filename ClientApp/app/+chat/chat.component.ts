import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'appc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    private _hubConnection: HubConnection;
  public async: any;
  message = '';
  messages: string[] = [];

  constructor() {
  }

  public sendMessage(): void {
    const data = `Sent: ${this.message}`;

    this._hubConnection.invoke('send', data);
    this.messages.push(data);
    this.message = '';
  }

  ngOnInit() {
    //this._hubConnection = new HubConnection('/chathub');
      this._hubConnection = new HubConnectionBuilder()
          .withUrl('/chathub')
          .build();

    this._hubConnection.on('send', (data: any) => {
      const received = `Received: ${data}`;
      this.messages.push(received);
    });

    this._hubConnection.start()
      .then(() => {
        console.log('Hub connection started')
      })
      .catch(err => {
        console.log('Error while establishing connection')
      });
  }

}

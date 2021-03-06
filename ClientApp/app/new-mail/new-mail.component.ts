import { Component, OnInit } from '@angular/core';
import { NewMailService } from './new-mail.service';
import { Mail } from '../core/models/mail';
import { ActivatedRoute, Params, Router } from '@angular/router';

function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

@Component({
  selector: 'appc-new-mail',
  templateUrl: './new-mail.component.html',
  styleUrls: ['./new-mail.component.scss']
})
export class NewMailComponent implements OnInit {

    public errors: string[] = [];
    public sendingMail: boolean = false;

  constructor(private newMailService: NewMailService, private activatedRoute: ActivatedRoute, private router: Router,) { }

  model = new Mail();

  ngOnInit() {
      this.activatedRoute.queryParams.subscribe((params: Params) => {
          if (params['draftId'] != null) {
              console.log("jest");
              this.newMailService.getDraft(params['draftId']).subscribe(response => {
                  console.log(response);
                  this.model.body = response[0].body;
                  this.model.title = response[0].title;
                  this.model.to = response[0].receiver;
              },
                  (errors: any) => {
                      let error = JSON.parse(errors.error);
                      this.errors = error;
                  });
          }
      });
  }

  onAttachmentChange(event: EventTarget) {
      console.log(event);
      let event1: MSInputMethodContext = <MSInputMethodContext>event;
      let target: HTMLInputElement = <HTMLInputElement>event1.target;
      if (target.files != null) {
          let files: FileList = target.files;
          let file = files.item(0);
          if (file != null) {
              getBase64(file).then(data => {
                  this.model.attachment = data.split(',')[1];
                  this.model.attachmentName = file!.name;
              });
          }
      }
  }

  onSubmit() {
      console.log(this.model);
      this.startSending();
      this.newMailService.sendMail(this.model).subscribe(response => {
          this.stopSending();
          this.router.navigate([`../mails`], { relativeTo: this.activatedRoute });
      },
      (errors: any) => {
          if (errors.status == 200) {
              this.stopSending();
              this.router.navigate([`../mails`], { relativeTo: this.activatedRoute });
          }
          else {
              this.stopSending();
              let error = JSON.parse(errors.error);
              this.errors = error;
          }
      });
  }

  onSaveDraft() {
      console.log(this.model);
      this.startSending();
      this.newMailService.saveDraft(this.model).subscribe(response => {
          console.log("Response: " + response);
          this.stopSending();
          this.router.navigate([`../mails`], { relativeTo: this.activatedRoute });
      },
          (errors: any) => {
              if (errors.status == 200) {
                  this.stopSending();
                  this.router.navigate([`../mails`], { relativeTo: this.activatedRoute });
              }
              else {
                  let error = JSON.parse(errors.error);
                  this.stopSending();
                  this.errors = error;
              }
          
      });
  }

  startSending() {
      this.sendingMail = true;
  }
  stopSending() {
      this.sendingMail = false;
  }
}

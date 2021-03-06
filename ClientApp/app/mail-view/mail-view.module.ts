import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { MailViewComponent } from './mail-view.component';
import { MailViewService } from './mail-view.service';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [CommonModule, SharedModule, NgbModule],
    declarations: [MailViewComponent],
    providers: [MailViewService]
})
export class MailViewModule { }

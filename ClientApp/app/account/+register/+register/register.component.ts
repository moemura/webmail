﻿import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { RegisterModel } from '../../../core/models/register-model';
import { ControlBase } from '../../../shared/forms/control-base';
import { ControlTextbox } from '../../../shared/forms/control-textbox';
import { AccountService } from '../../../core/services/account.service';
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'appc-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    public errors: string[] = [];
    public controls: Array<ControlBase<any>>;
    public register_button_translation: string;

    constructor(public accountService: AccountService, public router: Router, public route: ActivatedRoute, private translate: TranslateService) { }

    public register(model: RegisterModel): void {
        this.accountService.register(model)
            .subscribe((res: Response) => {
                this.router.navigate(['../registerconfirmation'], { relativeTo: this.route, queryParams: { emailConfirmed: true } });
            },
            (errors: any) => {
                let error = JSON.parse(errors.error);
                this.errors.push(error['error_description']);
            });
    };

    public ngOnInit() {

        let translation: Array<string>;
        if (this.translate.getBrowserLang().match(/pl/)) {
            translation = ['Nazwa użytkownika', 'Imię', 'Nazwisko', 'Email', 'Hasło','Rejestracja'];
        } else {
            translation = ['Username', 'Firstname', 'Lastname', 'Email', 'Password', 'Register'];
        }
     
        this.register_button_translation = translation[5];

        const controls: Array<ControlBase<any>> = [
            new ControlTextbox({
                key: 'username',
                label: translation[0],
                placeholder: translation[0],
                value: '',
                type: 'textbox',
                required: true,
                order: 1
            }),
            new ControlTextbox({
                key: 'firstname',
                label: translation[1],
                placeholder: translation[1],
                value: '',
                type: 'textbox',
                required: true,
                order: 2
            }),
            new ControlTextbox({
                key: 'lastname',
                label: translation[2],
                placeholder: translation[2],
                value: '',
                type: 'textbox',
                required: true,
                order: 3
            }),
            new ControlTextbox({
                key: 'email',
                label: translation[3],
                placeholder: translation[3],
                value: '',
                type: 'email',
                required: true,
                order: 4
            }),
            new ControlTextbox({
                key: 'password',
                label: translation[4],
                placeholder: translation[4],
                value: '',
                type: 'password',
                required: true,
                order: 5
            })
        ];

        this.controls = controls;
                
        
    }

}

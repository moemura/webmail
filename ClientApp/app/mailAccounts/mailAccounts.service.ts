﻿import { Injectable } from '@angular/core';
import { DataService } from '../core/services/data.service';

import { MailServerModel } from "../core/models/mail-server-model";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class mailAccountsService {
    public servers: Array<MailServerModel>;

    constructor(public dataService: DataService) { }

    public getServers() {
        this.dataService.get('/api/MailAccounts').subscribe(servers => {
            this.servers = servers as Array<MailServerModel>;
        });
    }

    public setServers(toSend: MailServerModel): Observable<Array<MailServerModel>> {

        return this.dataService.post('/api/MailAccounts', toSend) as Observable<Array<MailServerModel>>;
    }
    public deleteServer(mailAddress: String): Observable<Array<MailServerModel>> {
        return this.dataService.delete('/api/MailAccounts/' + mailAddress) as Observable<Array<MailServerModel>>;
    }
}
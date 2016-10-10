import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
export interface Return {
    $promise: Promise<any>;
    $observables: Observable<any>;
}
export declare class RestResource {
    private _http;
    protected url: string;
    protected params: Object;
    protected methods: Object;
    private _request;
    constructor(_http: Http);
    private buildParams(data?);
    private buildUrl(data?);
    private createRequest(type, data?);
    sendResponse(): Return;
    query(data?: Object): Return;
    save(data?: Object): Return;
    update(data?: Object): Return;
    delete(data?: Object): Return;
}

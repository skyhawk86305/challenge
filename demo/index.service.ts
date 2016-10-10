import { RestResource } from '../';
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

const URL_PREFIX = "http://jsonplaceholder.typicode.com/";

@Injectable()
export class DataProvider extends RestResource{
  protected url : string = URL_PREFIX + "posts/:id";

  protected params : Object = { ':id' : '@id' }

  constructor(_http: Http) {
    super(_http);
  }
}

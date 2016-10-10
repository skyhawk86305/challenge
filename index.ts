import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
 import 'rxjs/add/operator/map';

export interface Return {
  $promise : Promise<any>;
  $observables: Observable<any>;
}

@Injectable()
export class RestResource {

  protected url: string;

  protected params: Object;

  protected methods: Object;

  private _request: Observable<any>;

  constructor(private _http : Http){
    if(typeof this._http == undefined) {
      throw new Error('super(_http) is not called on class that is extended RestProvider');
    }
  }

  private buildParams(data : any = {}) : Object {
    let _defaultParams : any = Object.assign({},this.params);
    //first lookup in default params if reference is found we replace with default params
    for(var _prop in _defaultParams) {
      delete _defaultParams[_prop];
      if(data[_defaultParams[_prop.substr(1)]]) {
        _defaultParams[_prop.substr(1)] = data[_defaultParams[_prop.substr(1)]];
        delete data[_prop.substr(1)];
      }
    }
    return Object.assign({},_defaultParams,data);
  }

  private buildUrl (data ?: Object) : string {
    let _url = this.url;
    let _params : any = this.buildParams(data);
    let splitUrl: Array<string> = _url.split("/");
    let _defaultParams : any = Object.assign({},this.params);
    // check all the parts of url and replace with parameters
    // priority of parameters
    // direct named Parameter found then it will take first priority
    // if not found directly then it will try to find reference for ex. :id:@postId then postId will be looked up
    // if reference not found then it will try to match param name with url part for ex. :id:@postId if postId not found it will try to find id in params
    splitUrl.forEach((urlPart,index) => {
      if(urlPart.charAt && urlPart.charAt(0) === ':') {
        let _paramName = urlPart.substr(1);
        let _propName = _defaultParams.hasOwnProperty(urlPart) ? _defaultParams[urlPart] : undefined;
        if( _propName == undefined ) {
          if(_params.hasOwnProperty(_paramName)) {
              splitUrl[index] = _params[_paramName];
              delete _params[_paramName];
            } else {
            splitUrl.splice(index,1);
          }
        } else {
          if( _propName && _propName.charAt && _propName.charAt(0) == '@') {
            _propName = _propName.substr(1);
            if(_params.hasOwnProperty(_propName)) {
              splitUrl[index] = _params[_propName];
              delete _params[_propName];
            } else if(_params.hasOwnProperty(_paramName)) {
              splitUrl[index] = _params[_paramName];
              delete _params[_paramName];
            } else {
              delete splitUrl.splice(index,1);
            }
          } else {
            splitUrl.splice(index,1);
          }
        }
      }
    });
    splitUrl = splitUrl.filter(o => o[0] != '@')
    let substituedUrl:string = '';
    for( var _prop in _params) {
      substituedUrl += _prop + "=" + _params[_prop] + "&";
    }
    return splitUrl.join("/") + (substituedUrl.length ? "?" + substituedUrl.substr(0,substituedUrl.length-1) : "") ;
  }

  private createRequest(type: string,data ?: Object) : Observable<any> {
    let _url : string = this.buildUrl(data);
    let _request : Observable<any>
    let stringParam : string = '';
    let _jsonBuild : any = {}
    if(_url.split('?')[1] && _url.split('?')[1].length) {
      (_url.split('?')[1].split('&')).forEach( _paramPart => {
        _jsonBuild[_paramPart.split('=')[0]] = _paramPart.split('=')[1];
      });
      stringParam = JSON.stringify(_jsonBuild);
    }
    switch (type) {
      case "post":
        _request = this._http.post(_url.split('?')[0], stringParam);
        break;
      case "patch":
        _request = this._http.patch(_url.split('?')[0], stringParam);
        break;
      case "put":
        _request = this._http.put(_url.split('?')[0], stringParam);
        break;
      case "delete":
        _request = this._http.delete(_url);
        break;
      case "head":
        _request = this._http.head(_url);
        break;
      default:
        _request = this._http.get(_url);
        break;
    }
    this._request = _request.map((response: Response) => response.json());
    return this._request;
  }

  sendResponse() : Return {
    return {
      $promise: this._request.toPromise().catch((e:any)=>console.error(e)),
      $observables: this._request
    }
  }

  query (data ?: Object) : Return{
    let _request : Observable<Response> = this.createRequest("get",data);
    return this.sendResponse();
  }

  save (data ?: Object) : Return {
    let _request : Observable<Response> = this.createRequest("post",data);
    return this.sendResponse();
  }

  update( data ?: Object) : Return {
    let _request : Observable<Response> = this.createRequest("put",data);
    return this.sendResponse();
  }

  delete( data ?: Object) : Return {
    let _request : Observable<Response> = this.createRequest("delete",data);
    return this.sendResponse();
  }


}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var RestResource = (function () {
    function RestResource(_http) {
        this._http = _http;
        if (typeof this._http == undefined) {
            throw new Error('super(_http) is not called on class that is extended RestProvider');
        }
    }
    RestResource.prototype.buildParams = function (data) {
        if (data === void 0) { data = {}; }
        var _defaultParams = Object.assign({}, this.params);
        //first lookup in default params if reference is found we replace with default params
        for (var _prop in _defaultParams) {
            delete _defaultParams[_prop];
            if (data[_defaultParams[_prop.substr(1)]]) {
                _defaultParams[_prop.substr(1)] = data[_defaultParams[_prop.substr(1)]];
                delete data[_prop.substr(1)];
            }
        }
        return Object.assign({}, _defaultParams, data);
    };
    RestResource.prototype.buildUrl = function (data) {
        var _url = this.url;
        var _params = this.buildParams(data);
        var splitUrl = _url.split("/");
        var _defaultParams = Object.assign({}, this.params);
        // check all the parts of url and replace with parameters
        // priority of parameters
        // direct named Parameter found then it will take first priority
        // if not found directly then it will try to find reference for ex. :id:@postId then postId will be looked up
        // if reference not found then it will try to match param name with url part for ex. :id:@postId if postId not found it will try to find id in params
        splitUrl.forEach(function (urlPart, index) {
            if (urlPart.charAt && urlPart.charAt(0) === ':') {
                var _paramName = urlPart.substr(1);
                var _propName = _defaultParams.hasOwnProperty(urlPart) ? _defaultParams[urlPart] : undefined;
                if (_propName == undefined) {
                    if (_params.hasOwnProperty(_paramName)) {
                        splitUrl[index] = _params[_paramName];
                        delete _params[_paramName];
                    }
                    else {
                        splitUrl.splice(index, 1);
                    }
                }
                else {
                    if (_propName && _propName.charAt && _propName.charAt(0) == '@') {
                        _propName = _propName.substr(1);
                        if (_params.hasOwnProperty(_propName)) {
                            splitUrl[index] = _params[_propName];
                            delete _params[_propName];
                        }
                        else if (_params.hasOwnProperty(_paramName)) {
                            splitUrl[index] = _params[_paramName];
                            delete _params[_paramName];
                        }
                        else {
                            delete splitUrl.splice(index, 1);
                        }
                    }
                    else {
                        splitUrl.splice(index, 1);
                    }
                }
            }
        });
        splitUrl = splitUrl.filter(function (o) { return o[0] != '@'; });
        var substituedUrl = '';
        for (var _prop in _params) {
            substituedUrl += _prop + "=" + _params[_prop] + "&";
        }
        return splitUrl.join("/") + (substituedUrl.length ? "?" + substituedUrl.substr(0, substituedUrl.length - 1) : "");
    };
    RestResource.prototype.createRequest = function (type, data) {
        var _url = this.buildUrl(data);
        var _request;
        var stringParam = '';
        var _jsonBuild = {};
        if (_url.split('?')[1] && _url.split('?')[1].length) {
            (_url.split('?')[1].split('&')).forEach(function (_paramPart) {
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
        this._request = _request.map(function (response) { return response.json(); });
        return this._request;
    };
    RestResource.prototype.sendResponse = function () {
        return {
            $promise: this._request.toPromise().catch(function (e) { return console.error(e); }),
            $observables: this._request
        };
    };
    RestResource.prototype.query = function (data) {
        var _request = this.createRequest("get", data);
        return this.sendResponse();
    };
    RestResource.prototype.save = function (data) {
        var _request = this.createRequest("post", data);
        return this.sendResponse();
    };
    RestResource.prototype.update = function (data) {
        var _request = this.createRequest("put", data);
        return this.sendResponse();
    };
    RestResource.prototype.delete = function (data) {
        var _request = this.createRequest("delete", data);
        return this.sendResponse();
    };
    RestResource = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], RestResource);
    return RestResource;
}());
exports.RestResource = RestResource;
//# sourceMappingURL=index.js.map
/// <reference path="../typings/browser.d.ts" />``
import {
  Component, enableProdMode, provide
} from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { bootstrap } from '@angular/platform-browser-dynamic';
import {DataProvider} from './index.service';
import { HTTP_PROVIDERS, RequestOptions } from '@angular/http';
import { JsonRequest } from './json.request.options';
import { RestResource } from '../';
// todo: enable prod mod only for prod build
enableProdMode();

export interface PostsModel {
  id: number;
  title: string;
  body: string;
  userId: number;
}


@Component({
  selector: 'app',
  template: require('./posts_render.html') ,
  providers: [DataProvider]
})
export class Demo {
  posts: Array<PostsModel>;

  useObservables: boolean = false;

  loading : boolean = false;

  constructor( private _dataProvider : DataProvider) {
    this.refreshPosts();
  }

  getPosts(params: Object = {}) {
    this.loading = true;
    let request = this._dataProvider.query(params);
    if(this.useObservables) {
      request.$observables.subscribe(data => {
        this.posts = data;
        this.loading = false;
      });
    }
    else {
      request.$promise.then(response => {
        this.posts = response;
        this.loading = false;
      });
    }
  }

  refreshPosts(params: Object = {}) {
    this.posts = [];
    this.getPosts(params);
  }

  useObservers() {
    this.useObservables = true;
    this.refreshPosts();
  }

  usePromise() {
    this.useObservables = false;
    this.refreshPosts();
  }

  filterWithUserId() {
    this.refreshPosts({userId:1});
  }

  create() {
    this._dataProvider.save({
      postId: 1,
      name: "sample",
      email: "sample@g.com",
      body: "sample body"
    }).$promise.then(data=>this.posts.push(data));
  }

  update() {
    this._dataProvider.update({
      name: "sample",
      email: "sample@g.com",
      body: "sample body",
      id:1
    }).$promise.then(data=>this.posts[0] = data);
  }

}

bootstrap(Demo,[
  HTTP_PROVIDERS,
  provide(RequestOptions,{useClass:JsonRequest}),
  RestResource
]);

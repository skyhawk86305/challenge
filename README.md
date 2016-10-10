# ng2-resource
Restful resource module for angular2

To use the module install the module using below command

`npm install --save ng2-resource`

import the package using below syntax into your angular 2 app

```javascript
//first import the rest provider
import {RestResource} from "ng2-resource";
.......

//inject rest service provider at app level
bootstrap(Demo,[
  HTTP_PROVIDERS,
  provide(RequestOptions,{useClass:JsonRequest}),
  RestResource
  ]);
// here you can inject any version of RequestOptions or Http the classes injected before rest resource will be used in the RestResource

//next implement data sevice provider using below in service file
import {RestResource} from 'ng2-resource';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class DataProvider extends RestResource{
  protected url : string = URL_PREFIX + "posts/:id";
  
  protected params : Object = { ':id' : '@id' }
  constructor(_http : Http) {
    // super is compulsory as Super class needs Http from the DI
    super(_http);
  }
}
```
```javascript
  // now you can use the service to work as resource with your component
  @Component({
    selector: 'app',
    template: require('./posts_render.html') ,
    providers: [DataProvider]
  })
```

** check the demo folder for the reference on how to use **

### It provides the following method out of box
- query(params) get method
- save(params) post method
- update(params) put method
- delete(params) delete method

## It returns both Observables as well as promise in the response as below
- resource.query().$observables which is inturn the object of observable so it can be subscribed
- resource.query().$promise which is the promise object and it can be used to handle resolve or reject
- all methods returns promise as well as observables

### to run the example in demo field
- clone the repo
- npm install
- npm start
- navigate to http://localhost:8000 in browser

## To Do:
- add support for custom methods
- add support for Request options specific to single request
- add flexibility to remove super() call in constructor()
- add support for configuration at run time

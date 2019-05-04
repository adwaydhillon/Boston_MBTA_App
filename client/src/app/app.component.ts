import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [AppService]
})
export class AppComponent {
  title: string;
  routeFilters: Map<any, any>;
  stopFilters: Map<any, any>;
  subwayRoutes: any;
  

  constructor(public appService: AppService) {
    this.title = 'client';
    this.routeFilters = new Map();
    this.stopFilters = new Map();
    this.subwayRoutes = [];
  }

  ngOnInit() {
    // FOR PROBLEM 1; Filter the request only for subway routes, i.e. "Light Rail" (type 0) and “Heavy Rail” (type 1). 
    // let routeFilters = new Map();
    // routeFilters.set('type', [0,1]);
    // this.setRouteFilters(routeFilters);
    // this.getRoutes();

    // FOR PROBLEM 2; Filter the request for each of the aforementioned subway routes
    let stopFilters = new Map();
    stopFilters.set('route', 'Orange');
    this.setStopFilters(stopFilters);
    this.getStops();
  }

  getRoutes() {
      return this.appService.getRoutes(this.routeFilters)
      .then(function (data) {
        let long_names = []
        for (let route of data) {
          long_names.push(route.attributes.long_name); 
        }
        return long_names;
      })
      .then(function (data) {
        //this.subwayRoutes = data;
        console.log(data);
      })
    }

    getStops() {
      return this.appService.getStops(this.stopFilters)
      .then(function (data) {
        let stop_names = []
        for (let stop of data) {
          stop_names.push(stop.attributes.name); 
        }
        return stop_names;
      })
      .then(function (data) {
        console.log(data);
      })
    }
    
    setRouteFilters(routeFilters: Map<any, any>) {
      this.routeFilters = routeFilters;
    }

    setStopFilters(stopFilters: Map<any, any>) {
      this.stopFilters = stopFilters;
    }
}
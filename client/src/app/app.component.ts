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
  subwayRoutes: Map<string, string>;
  routeToStopsDict: Map<any, any>;
  maxStopRoute: any;
  minStopRoute: any;
  

  constructor(public appService: AppService) {
    this.title = 'client';
    this.routeFilters = new Map();
    this.stopFilters = new Map();
    this.routeToStopsDict = new Map();
    this.subwayRoutes = new Map();
    this.maxStopRoute = {};
    this.minStopRoute = {};
  }

  ngOnInit() {
    // FOR PROBLEM 1; Filter the request only for subway routes, i.e. "Light Rail" (type 0) and “Heavy Rail” (type 1). 
    // let routeFilters = new Map();
    // routeFilters.set('type', [0,1]);
    // this.setRouteFilters(routeFilters);
    // this.getRoutes()
    // .then((data) => {
    //   console.log(data.values());
    // });

    // FOR PROBLEM 2; Filter the request for each of the aforementioned subway routes
    if (this.subwayRoutes.size == 0) {
      let routeFilters = new Map();
      routeFilters.set('type', [0,1]);
      this.setRouteFilters(routeFilters);
      return this.getRoutes()
        .then((data) => {
          return this.findStopsForEachRoute(data)
        });
    }
    else {
      return this.findStopsForEachRoute(this.subwayRoutes);
    }
  }

  getRoutes() {
      return this.appService.getRoutes(this.routeFilters)
      .then((data) => {
        for (let route of data) {
          this.subwayRoutes.set(route.id, route.attributes.long_name);
        }
        return this.subwayRoutes;
      });
    }

  getStops() {
    return this.appService.getStops(this.stopFilters)
    .then((data) => {
      let stop_ids = []
      for (let stop of data) {
        stop_ids.push(stop.id); 
      }
      return stop_ids;
    });
  }

  private findStopsForEachRoute(subwayRoutes: Map<string, string>) {
    let maxStops = Number.MIN_SAFE_INTEGER, 
        minStops = Number.MAX_SAFE_INTEGER;

    for (let subwayRoute of Array.from(subwayRoutes.keys())) {
      let stopFilters = new Map();
      stopFilters.set('route', subwayRoute);
      this.setStopFilters(stopFilters);
      this.getStops()
      .then((data) => {
        if (data.length > maxStops) {
          maxStops = data.length;
          this.maxStopRoute = {
            route: subwayRoutes.get(subwayRoute), 
            count: data.length
          };
        }
        if (data.length < minStops) {
          minStops = data.length;
          this.minStopRoute = {
            route: subwayRoutes.get(subwayRoute), 
            count: data.length
          };
        }
        this.routeToStopsDict.set(subwayRoute, data);
        console.log(this.routeToStopsDict.values());
      });
    }
  }

  private findRoutesForEachStop(subwayRoutes: Map<string, string>, routeToStopsDict: Map<string, string>) {
    let stopToRoutesDict;
    stopToRoutesDict = new Map<any, []>();
    for (let route of Array.from(routeToStopsDict.keys())) {
      for (let stop of routeToStopsDict.get(route)) {
        if (stopToRoutesDict.get(stop)) {
          let routeList = stopToRoutesDict.get(stop);
          routeList.push(route);
          stopToRoutesDict.set(stop, routeList);
        } else {
          let routeList = [];
          routeList.push(route);
          stopToRoutesDict.set(stop, routeList);
        }
      }
    }
    console.log(stopToRoutesDict);
  }

  private setRouteFilters(routeFilters: Map<any, any>) {
    this.routeFilters = routeFilters;
  }

  private setStopFilters(stopFilters: Map<any, any>) {
    this.stopFilters = stopFilters;
  }

  private async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
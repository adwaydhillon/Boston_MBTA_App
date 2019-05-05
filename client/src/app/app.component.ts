import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  providers: [AppService]
})
export class AppComponent {
  title: string;
  routeFilters: Map<any, any>;
  stopFilters: Map<any, any>;
  subwayRoutes: Map<string, string>;
  stops: Map<string, string>;
  routeToStopsDict: Map<any, any>;
  stopToRoutesDict: Map<any, []>;
  maxStopRoute: any;
  minStopRoute: any;
  

  constructor(public appService: AppService) {
    this.title = 'client';
    this.routeFilters = new Map();
    this.stopFilters = new Map();
    this.routeToStopsDict = new Map();
    this.subwayRoutes = new Map();
    this.stops = new Map();
    this.stopToRoutesDict = new Map();
    this.maxStopRoute = {};
    this.minStopRoute = {};
  }

  ngOnInit() {
  }

  // FOR PROBLEM 1; Filter the request only for subway routes, i.e. "Light Rail" (type 0) and “Heavy Rail” (type 1).
  makeRouteRequest() {
    let routeFilters = new Map();
    routeFilters.set('type', [0,1]);
    this.setRouteFilters(routeFilters);
    this.getRoutes()
    .then((data) => {
      console.log(data.values());
    });
  }

  // FOR PROBLEM 2; Filter the request for each of the aforementioned subway routes
  getStopInfo() {
    if (this.subwayRoutes.size == 0) {
      console.log("aaaaa");
      let routeFilters = new Map();
      routeFilters.set('type', [0,1]);
      this.setRouteFilters(routeFilters);
      return this.getRoutes()
        .then((data) => {
          this.findStopsForEachRoute(data)
        });
    }
    else {
      this.findStopsForEachRoute(this.subwayRoutes);
    }
    setTimeout((data) => { 
      console.log(this.maxStopRoute);
      console.log(this.minStopRoute);
      this.findRoutesForEachStop(this.subwayRoutes, this.routeToStopsDict);
      this.findStopsWithMultipleRoutes();
    }, 1000);
  }

  // FOR PROBLEM 3; TODO
  getRouteBetweenTwoStops() {
    // if (this.subwayRoutes.size == 0) {
    //   this.makeRouteRequest();
    // }
    if (this.routeToStopsDict.size == 0) {
      this.getStopInfo();
    }

    setTimeout((data) => {
      this.findRoutesBetweenTwoStops('Ashmont', 'Arlington');
    }, 2000);
  }

  private getRoutes() {
      return this.appService.getRoutes(this.routeFilters)
      .then((data) => {
        for (let route of data) {
          this.subwayRoutes.set(route.id, route.attributes.long_name);
        }
        return this.subwayRoutes;
      });
    }

  private getStops() {
    return this.appService.getStops(this.stopFilters)
    .then((data) => {
      let stops = new Map();
      for (let stop of data) {
        stops.set(stop.id, stop.attributes.name);
        this.stops.set(stop.id, stop.attributes.name);
      }
      return Array.from(stops.keys());
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
    this.stopToRoutesDict = stopToRoutesDict;
  }

  private findStopsWithMultipleRoutes() {
    let stopToRoutesDict = this.stopToRoutesDict,
        stopsWithMultipleRoutesDict = [];
    for (let stop of Array.from(stopToRoutesDict.keys())) {
      if (stopToRoutesDict.get(stop).length > 1) {
        stopsWithMultipleRoutesDict.push({
          stop: stop,
          routes: stopToRoutesDict.get(stop)
        });
      }
    }
    console.log(stopsWithMultipleRoutesDict); 
    return stopsWithMultipleRoutesDict;
  }

  private findRoutesBetweenTwoStops(stopA: string, stopB: string) {
    let stopToRoutesDict = this.stopToRoutesDict,
        stops = this.stops,
        stop_names = Array.from(stops.values()),
        routesBetweenAandB = [],
        indexOfA = stop_names.indexOf(stopA),
        indexOfB = stop_names.indexOf(stopB);

    if (indexOfA < 0 || indexOfB < 0) {
      console.log("not found");
      return routesBetweenAandB;
    }

    let stopAId = this.getStopIdByName(stops, stopA),
        stopBId = this.getStopIdByName(stops, stopB);

    for (let routeA of stopToRoutesDict.get(stopAId)) {
      for (let routeB of stopToRoutesDict.get(stopBId)) {
        if (routeA === routeB) {
          routesBetweenAandB.push(routeA);
        }
      }
    }
    console.log(routesBetweenAandB);
  }

  private getStopIdByName(stops: Map<string, string>, stop_name: string) {
    for (let stop_id of Array.from(stops.keys())) {
      if (stops.get(stop_id) === stop_name) return stop_id;
    }
  }

  private setRouteFilters(routeFilters: Map<any, any>) {
    this.routeFilters = routeFilters;
  }

  private setStopFilters(stopFilters: Map<any, any>) {
    this.stopFilters = stopFilters;
  }
}
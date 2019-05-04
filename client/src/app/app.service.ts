import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http : HttpClient) { }

  getRoutes(queryParameters: Map<any, any>) {
      return this.http.get<any>('https://api-v3.mbta.com/routes' + this.provideQueryParams(queryParameters))
      .toPromise()
      .then(function (data) {
        return data.data;
      });
  }

  getStops(queryParameters: Map<any, any>) {
    return this.http.get<any>('https://api-v3.mbta.com/stops'+ this.provideQueryParams(queryParameters))
      .toPromise()
      .then(function (data) {
      return data.data;
    });
  }

  private provideQueryParams(queryParameters: Map<any, any>) {
    if (queryParameters.size == 0) return '';
    
    let param_str: string = '?';
    for (let key of Array.from(queryParameters.keys())) {
      param_str += 'filter[' + key + ']=' + queryParameters.get(key) + '&';
    }
    return param_str.substring(0, param_str.length - 1);
  }     
}

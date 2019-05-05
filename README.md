# Boston_MBTA_App
Check out the [MBTA v3 API](https://api-v3.mbta.com/docs/swagger/index.html). This application makes calls to the /routes and /stops endpoints to achieve its functionality. 

## What you will need
* [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm) installed.
* [Angular CLI](https://angular.io/cli) installed. If you don’t have it installed, run: 
```
$ npm install -g @angular/cli@7.0.6
```
## Building and running the application
The project is configured with a simple web server for development. To start it, change directories into the client folder and run:
```
$ ng serve --open
```
Make sure port 4200 is not already in use — it’s the default port chosen by Angular CLI. If you want to run the application on another port, you can use the --port flag:
```
$ ng serve --port 4400
```



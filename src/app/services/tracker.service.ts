import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse, BackgroundGeolocationLocationCode, BackgroundGeolocationProvider, BackgroundGeolocationAccuracy } from '@ionic-native/background-geolocation/ngx';
import { Observable, of } from 'rxjs';

@Injectable()
export class TrackerService {
    tracking = false;
    locations: Object[] = [];
    locations$: Observable<any>;    

    config: BackgroundGeolocationConfig = {
        locationProvider: 0,
        desiredAccuracy: 0,
        stationaryRadius: 5,
        distanceFilter: 1,
        activitiesInterval: 2000,
        interval: 500,
        fastestInterval: 0,
        notificationTitle: 'Tracknerd',
        notificationText: 'App services are running.',
        debug: true,
        stopOnTerminate: false
    }
    constructor(public backgroundGeolocation: BackgroundGeolocation) { }

    public configBackgroundGeolocation() {

        this.backgroundGeolocation.configure(this.config).then(() => {
            this.locations$ =  this.backgroundGeolocation.on(BackgroundGeolocationEvents.location);
        })
    }

    startBackgroundTracking() {
        this.backgroundGeolocation.start();
    }

    stopBackgroundTracking() {
        this.backgroundGeolocation.stop();
    }

}
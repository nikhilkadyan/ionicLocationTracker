import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Observable, of } from 'rxjs';

@Injectable()
export class TrackerService {
    locations: Object[] = [];
    config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 10,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 5000,
        activitiesInterval: 5000,
        notificationTitle: 'Employee tracker',
        notificationText: 'App running...',
        debug: true,
        stopOnTerminate: false
    }
    constructor(private backgroundGeolocation: BackgroundGeolocation) { }

    public configBackgroundGeolocation() {

        this.backgroundGeolocation.configure(this.config).then(() => {
            this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
                this.locations.push(location);
                localStorage.setItem("locations",JSON.stringify(this.locations))
                console.log("Locations Array", this.locations);
            })
        })
    }

    startBackgroundTracking() {
        console.log("Tracking Started")
        this.backgroundGeolocation.start();
    }

    stopBackgroundTracking() {
        console.log("Tracking Stopped")
        this.backgroundGeolocation.stop();
    }

    getLocations(){
        return this.locations    
    }

    clearLocations() {
        this.locations = [];
        localStorage.removeItem("locations")
    }

}
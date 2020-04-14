import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { TrackerService } from '../../services/tracker.service';
import { Content } from '@angular/compiler/src/render3/r3_ast';

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tracking: boolean = false;
  map: any;

  recordedLocation = [];
  currMapTrack = null;
  trackedRoute = [];

  constructor(
    public userService: UserService,
    public trackerService: TrackerService,
    private plt: Platform,
    private toastController: ToastController
  ) { }

  // Platform Ready Tasks
  ngAfterViewInit() {
    this.plt.ready().then(() => {
      this.tracking = false;

      // Define GMaps Options

      let mapOptions = {
        zoom: 15,
        mapId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullScreenControl: false
      }

      // Set Map To VIew
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Current Location Marker
      this.trackerService.backgroundGeolocation.getCurrentLocation().then((loc) => {
        let marker = new google.maps.Marker({
          map: this.map,
          position: { lat: loc.latitude, lng: loc.longitude },
        })

        this.map.setCenter({ lat: loc.latitude, lng: loc.longitude })

        this.addInfoWindow(marker, 'Location Found!')

      })


    })
  }

  // Start Tracking
  start() {
    this.presentToast('Tracking Started')
    this.tracking = true;

    // Debug
    this.recordedLocation = []

    // Tracking Started Marker
    this.trackerService.backgroundGeolocation.getCurrentLocation().then((loc) => {
      let marker = new google.maps.Marker({
        map: this.map,
        position: { lat: loc.latitude, lng: loc.longitude },
      })

      this.addInfoWindow(marker, 'Tracking Started!')

    })

    // Subs To Location Updates
    this.trackerService.startBackgroundTracking()
    this.trackerService.locations$.subscribe((loc) => {

      // Draw Marker For Last Update
      let newMarker = new google.maps.Marker({
        map: this.map,
        position: { lat: loc.latitude, lng: loc.longitude },
        icon: "https://i.imgur.com/qURTnVO.png"
      })

      // Convert UNIX to timestamp
      let date = new Date(loc.time);
      // Assign Data
      this.recordedLocation.push({
        provider: loc.provider,
        locationProvider: loc.locationProvider,
        latitude: loc.latitude,
        longitude: loc.longitude,
        accuracy: loc.accuracy,
        speed: loc.speed,
        altitude: loc.altitude,
        bearing: loc.bearing,
        time: date
      })
      // For Debugging
      console.log(this.recordedLocation)


      // // For Map Poly line
      this.trackedRoute.push({ lat: loc.latitude, lng: loc.longitude });
      // // Draw Poly
      this.drawPath(this.trackedRoute)


    })

  }

  // Stop Tracking
  stop() {
    this.presentToast('Tracking Stopped')
    this.tracking = false;
    this.trackerService.stopBackgroundTracking()

    // Tracking Ended Marker
    this.trackerService.backgroundGeolocation.getCurrentLocation().then((loc) => {
      let marker = new google.maps.Marker({
        map: this.map,
        position: { lat: loc.latitude, lng: loc.longitude },
      })

      this.addInfoWindow(marker, 'Tracking Stopped!')

    })

  }

  // Make Marker With Context
  addInfoWindow(marker, content) {

    let infoWin = new google.maps.InfoWindow({
      content: content
    })

    google.maps.event.addListener(marker, 'click', () => {
      infoWin.open(this.map, marker)
    })
  }

  // Toast Alert
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  // Draw Poly Path
  drawPath(path) {
    if (this.currMapTrack) {
      this.currMapTrack.setMap(null)
    }

    if (path.length > 1) {
      this.currMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#2196F3',
        strokeOpacity: 1.0,
        strokeWeight: 4
      })

      this.currMapTrack.setMap(this.map)
    }
  }
}

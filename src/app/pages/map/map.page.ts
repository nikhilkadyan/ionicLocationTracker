import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TrackerService } from '../../services/tracker.service';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  locations: Object[] = [];
  startDate = null;
  currMapTrack = null;

  map: any;
  trackedRoute = [];

  tracking: boolean = false;
  history = [];

  constructor(public trackerService: TrackerService, private plt: Platform) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.plt.ready().then(() => {
      this.tracking = false;

      let mapOptions = {
        zoom: 15,
        mapId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullScreenControl: false
      }

      // this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      this.trackerService.backgroundGeolocation.getCurrentLocation().then((loc) => {
        let latLng = new google.maps.LatLng(loc.latitude, loc.longitude);
        this.map.setCenter(latLng)
        
        // Start Marker
        let marker = new google.maps.Marker({
          map: this.map,
          position: {lat: loc.latitude, lng: loc.longitude},
        })

      })

    })
  }

  start() {
    this.tracking = true;
    this.startDate = new Date();
    this.trackerService.startBackgroundTracking()
    this.trackerService.locations$.subscribe((loc) => {
     
      console.log(loc)
      // Draw Markers
      let newMarker = new google.maps.Marker({
        map: this.map,
        position: {lat: loc.latitude, lng: loc.longitude},
        icon: "https://i.imgur.com/qURTnVO.png"
      })

       // For Server
       this.locations.push(loc)
       // For Map Poly line
      //  this.trackedRoute.push({ lat: loc.latitude, lng: loc.longitude });
       // Draw Poly
       // this.redrawPath(this.trackedRoute)
 

    })
  }

  stop() {
    this.tracking = false;
    this.trackerService.stopBackgroundTracking()
    this.saveHistory();

    // End Marker
    this.trackerService.backgroundGeolocation.getCurrentLocation().then((loc) => {
      let marker = new google.maps.Marker({
        map: this.map,
        position: {lat: loc.latitude, lng: loc.longitude}     
      })
    })
  }

  redrawPath(path) {
    if (this.currMapTrack) {
      this.currMapTrack.setMap(null)
    }

    if (path.length > 1) {
      this.currMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      })

      this.currMapTrack.setMap(this.map)
    }
  }

  clear() {
    // this.currMapTrack.setMap(null)
    console.log(this.locations)
    console.log(this.trackerService.backgroundGeolocation.getLocations())
  }

  saveHistory() {
    if (localStorage.getItem("history")) {
      this.history = JSON.parse(localStorage.getItem("history"));
    }
    this.history.push({
      start: this.startDate,
      end: new Date(),
      routes: this.locations
    })
    localStorage.setItem("history", JSON.stringify(this.history));
  }

}

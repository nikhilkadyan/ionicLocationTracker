import { Component, OnInit } from '@angular/core';
import { TrackerService } from '../../services/tracker.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  tracking: boolean = false;
  locations: Object[];
  constructor(public trackerService: TrackerService) {  }

  ngOnInit() {  }

  ngOnDestory(){
    this.reset();
  }

  getLocations(){
    this.locations = JSON.parse(localStorage.getItem("locations"));
  }

  start() {
    this.tracking = true;
    this.trackerService.startBackgroundTracking()
  }

  stop() {
    this.tracking = false;
    this.trackerService.stopBackgroundTracking()
  }

  reset() {
    this.stop();
    this.trackerService.clearLocations();
  }

}

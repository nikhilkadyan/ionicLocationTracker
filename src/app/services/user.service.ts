import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { Platform } from '@ionic/angular';

@Injectable()
export class UserService {
    serial: string = "XXXXXXXXX";
    constructor(private platform: Platform, private device: Device) {
        this.platform.ready().then(() => {
            this.serial = this.device.uuid
        })
    }
}
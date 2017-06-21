import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';


@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  
  subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dm: DeviceMotion) {
    
    dm.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) => console.log(acceleration),
        (error: any) => console.log(error)
        );

      // Watch device acceleration
     this.subscription = dm.watchAcceleration().subscribe((acceleration: DeviceMotionAccelerationData) => {
        console.log(acceleration);
        });

  }

  


  ionViewDidLeave {
       // Stop watch
      this.subscription.unsubscribe();
  }

}

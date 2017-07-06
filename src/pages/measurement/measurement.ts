import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { VideoPage } from '../video/video';
import { TimeModalComponent } from '../../components/time-modal/time-modal';


@IonicPage()
@Component({
  selector: 'page-measurement',
  templateUrl: 'measurement.html',
})
export class MeasurementPage {
  userKey;
  user;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ln: LocalNotifications, private modalCtrl: ModalController) {
    this.user = navParams.get('user');
    this.userKey = navParams.get('userKey')
  }

  startMeasure(){
      this.navCtrl.push(VideoPage, {
        userKey: this.userKey,
        user: this.user
      })
  }

   remindLater() {
    let modal = this.modalCtrl.create(TimeModalComponent);
    modal.onDidDismiss(data => {
       let time = Number(data)
       this.ln.schedule({
          text: 'Time to take your measurement!',
          at: new Date(new Date().getTime() + (time * 216000)),
          data: { message : 'Remember you are just 30 seconds away from living your style ' }
          });
    });

    modal.present();
  }

}

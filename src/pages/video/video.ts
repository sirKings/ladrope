import { ViewChild, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { VideoCapturePlus, VideoCapturePlusOptions } from '@ionic-native/video-capture-plus';
import { VideoReviewPage } from '../video-review/video-review';


@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {

  @ViewChild('pointer') pointerRef
  
  options: VideoCapturePlusOptions = {
      limit: 1,
      duration: 15,
      frontcamera: true
   }

  subscription;
  userKey;
  user;
  z;
  videoTaken = false;
  video;



  constructor(public navCtrl: NavController, public navParams: NavParams, private dm: DeviceMotion, private videoCapturePlus: VideoCapturePlus) {
    this.userKey = navParams.get('userKey');
    this.user = navParams.get('user');
    
    dm.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) => {
            console.log(acceleration);
        },
        (error: any) => console.log(error)
        );
  } 

  amplify(q){
      q = q * 15;
      return Math.round(q);
  }

  ngAfterViewInit() {
    let pointer = this.pointerRef.nativeElement;

    this.subscription = this.dm.watchAcceleration({frequency: 50})
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
 
          this.z = this.amplify(acceleration.z);
          if(this.z < 31){
              pointer.style.color = '#468a01';
              pointer.style.paddingTop = this.z + 'px';
          }else {
              pointer.style.color = '#c30d09';
              pointer.style.paddingTop = this.z + 'px';
             
          }
          
      })
  }

  startVideo(){
      this.videoCapturePlus.captureVideo(this.options)
      .then(res => {
        this.videoTaken = true;
        this.video = res;
        console.log(res)
      }, error => {
        console.log('Something aint right')      
      })
  }

  reviewVideo(){
      this.navCtrl.push(VideoReviewPage, {
          video: this.video[0],
          userKey: this.userKey,
          user: this.user
      })
  }

  ionViewDidLeave() {
       // Stop watch
    this.subscription.unsubscribe();
  }

}


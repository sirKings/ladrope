import { ViewChild, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { MediaCapture, MediaFile, CaptureVideoOptions } from '@ionic-native/media-capture';
import { VideoReviewPage } from '../video-review/video-review';



@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {

  @ViewChild('pointer') pointerRef
  
  

  subscription;
  user;
  uid;
  z;
  videoTaken = false;
  video;



  constructor(public navCtrl: NavController, public navParams: NavParams, private dm: DeviceMotion, private media: MediaCapture) {
    this.user = navParams.get('user');
    this.uid = navParams.get('uid')
    
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
    let options: CaptureVideoOptions = {
      duration: 15,
      limit: 1
    }
      this.media.captureVideo(options)
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
          user: this.user,
          uid: this.uid
      })
  }

  ionViewDidLeave() {
       // Stop watch
    this.subscription.unsubscribe();
  }

}


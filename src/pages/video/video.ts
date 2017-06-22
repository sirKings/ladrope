import { ViewChild, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';


@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {

  @ViewChild('space') canvasRef;
  
  

  subscription;
  user;
  image = 'assets/images/pointer.png'



  constructor(public navCtrl: NavController, public navParams: NavParams, private dm: DeviceMotion) {
    this.user = null;
    
    dm.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) => {
            console.log(acceleration);
        },
        (error: any) => console.log(error)
        );

      
     

  } 

  amplify(q){
      q = q * 15;
      return q;
  }

  ngAfterViewInit() {
        
        let source = new Image()
        let canvas = this.canvasRef.nativeElement;
        let ctx = canvas.getContext('2d');
        canvas.height = '700';
        canvas.width = '300';

        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.rect(130, 45, 30, 600);  
        ctx.fill();
        ctx.save();

        // Watch device acceleration
        this.subscription = this.dm.watchAcceleration({frequency: 500})
          .subscribe((acceleration: DeviceMotionAccelerationData) => {
            ctx.restore();
            let y = this.amplify(acceleration.y)
            source.src = this.image;
            ctx.drawImage(source, 100, y);
            console.log(acceleration)
          });
       
  }

  


  ionViewDidLeave() {
       // Stop watch
    this.subscription.unsubscribe();
  }

}


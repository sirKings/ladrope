﻿import { ViewChild, Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';
import { AngularFireDatabase } from 'angularfire2/database';

import { HomePage } from '../home/home'

@IonicPage()
@Component({
  selector: 'page-video-review',
  templateUrl: 'video-review.html',
})
export class VideoReviewPage implements OnInit {
  @ViewChild('progressbar') progressRef;
  @ViewChild('progress') progress;
  @ViewChild('player') playerRef;

  video;
  submitted = false;
  bodyCheck = 2;
  public videoRef:firebase.storage.Reference;
  progressbar = 0;
  
  form;
  user;
  uid
  videoLink;
  videoPath;
  filePath;
  uploadComplete = false;
  

  constructor(public navCtrl: NavController, private http: HTTP, private toastCtrl: ToastController, public db: AngularFireDatabase, public navParams: NavParams, private file: File) {
     this.video = navParams.get('video');
     this.user = navParams.get('user');
     this.uid = navParams.get('uid');
     this.videoRef = firebase.storage().ref().child('/videos');
     this.filePath = this.getPath(this.video.fullPath, this.video.name);

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoReviewPage');
  }

  submitVideo(){
      this.submitted = true;
      let progress = this.progressRef.nativeElement;
      let info = this.progress.nativeElement;

      this.file.readAsArrayBuffer(this.filePath, this.video.name)
        .then((sucess) => {
          
          let  blob = new Blob([sucess], {type: "video/mp4"});
          console.log(blob);
          // Upload file and metadata to the object 'images/mountains.jpg'
          var uploadTask = this.videoRef.child('/' + this.uid).put(blob);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
             (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              let progresbar = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(progresbar);
              progresbar = Math.floor(progresbar);
              progress.style.width = progresbar + '%';
              info.innerHTML = 'Please wait, Uploading Video';

            }, (error) => {
                console.log('there was an error uploading file');
                info.innerHTML = 'Upload failed, please try agiain';
            }, () => {
              //    Upload completed successfully, now we can get the download URL
                  var downloadURL = uploadTask.snapshot.downloadURL;
                  this.videoLink = downloadURL;
                  info.innerHTML = 'Upload Completed!! <br> Go to home tab and place your order';
                  this.uploadComplete = true;
                  this.bodyCheck = 2;  
          });

        }), function (error) {
                        // error
                        console.log("Failed to read video file from directory, error.code");

            }
    
  }

  yes(){
    this.bodyCheck = 1;
  }

  no(){
    this.bodyCheck = 2;
  }

  retakeVideo(){
      this.navCtrl.pop();
  }

  bodyChecked(){
      if(this.bodyCheck == 2){
          return false;
      }else {
          return true;
      }
  }

  getPath(fullpath, name){
    let x = name.length + 1
    let path = fullpath.slice(0, -x);
    return path;
  }

  ionViewDidLeave() {
       // Stop watch
    this.file.removeFile(this.filePath, this.video.name)
          .then((res) => {
              console.log('removed file')
          })
          .catch((err) => {
              console.log('failed to remove')
          })
    this.db.object('/users/'+this.uid)
      .update({size: this.videoLink})

    if(this.user.savedOrder){
      for(var prop in this.user.savedOrder){
        this.submitOrder(this.user.savedOrder[prop])
      }
      this.db.object('users/'+this.uid).update({savedOrder: null})
      let toast = this.toastCtrl.create({
          message: 'Your saved Orders have been submitted',
          duration: 3000,
      })
      toast.present()
    }
  }

  ngOnInit(){
     let player = this.playerRef.nativeElement;
     this.videoPath = this.file.readAsDataURL(this.filePath, this.video.name)
         .then((res) => {
            player.src = res;
            player.load();
         }).catch((err) => {
           console.log(err)
         })
  }

  addDays = function(days) {
    let date = new Date();
    let str = date.toISOString();
    let  myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    console.log(myDate)
    return myDate.toString();

  }

  submitOrder (order) {

      let deliveryDate = this.addDays(order.time + 2);
      let tailorDate = this.addDays(order.time)

      let date1 = new Date();
      let newOrder = {
      clothId: order.clothId,
      options: order.options,
      user: order.user,
      label: order.label,
      name: order.name,
      labelId: order.labelId,
      labelPhone: order.labelPhone,
      cost: order.cost,
      price: order.price,
      image1: order.image1,
      startDate: date1.toISOString(),
      date: deliveryDate,
      tailorDate: tailorDate,
      status: 'pending',
      size: this.user.size
    }
    let ordersKey = this.db.list('/orders')
      .push(newOrder).key;
    let userOrderKey = this.db.list('/users/'+ this.uid +'/orders')
      .push(newOrder).key;
   let tailorOrderKey = this.db.list('/tailors/' + order.labelId +'/orders')
      .push(newOrder).key;

     this.db.object('/orders/'+ ordersKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/users/'+this.uid+'/orders/'+userOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/tailors/' + order.labelId +'/orders/' + tailorOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.callTailor(order)
  }

  home(){
    this.navCtrl.setRoot(HomePage)
  }

  callTailor(cloth){
    let baseUrl = 'http://smsplus4.routesms.com:8080/bulksms/bulksms?username=ladrope&password=rB6V4KDt&type=0&dlr=1&destination='+cloth.labelPhone+'&source=LadRope&message=Hello%20you%20just%20got%20an%20order%20on%20Ladrope.com.%20Endeavour%20to%20complete%20and%20deliver%20on%20schedule'
    this.http.post(baseUrl, {}, {})
  }
}

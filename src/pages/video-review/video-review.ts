import { ViewChild, Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';
//import { HTTP } from '@ionic-native/http';
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
  //cloudinaryUrl = 'https://api.cloudinary.com/v1_1/ladrope/upload';
  //cloudinaryPreset = 'kfmwfbua';
  form;
  userKey;
  user;
  uid
  videoLink;
  videoPath;
  filePath;
  deliveryDate;
  uploadComplete = false;
  //headers = {
    //'Content-Type': 'application/x-www-form-urlencoded'
  //};


  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public db: AngularFireDatabase, public navParams: NavParams, private file: File) {
     this.video = navParams.get('video');
     this.userKey = navParams.get('userKey');
     this.user = navParams.get('user');
     this.uid = navParams.get('uid');
     //this.form = new FormData();
     this.videoRef = firebase.storage().ref().child('/videos');
     this.filePath = this.getPath(this.video.fullPath, this.video.name);

     this.deliveryDate = this.addDays(14);

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoReviewPage');
  }

  submitVideo(){
      this.submitted = true;
      let progress = this.progressRef.nativeElement;
      let info = this.progress.nativeElement;


      
      // Create the file metadata
      var metadata = {
              contentType: 'video/mp4'
      };

      this.file.readAsDataURL(this.filePath, this.video.name)
        .then((sucess) => {
            //console.log(sucess);

            /*this.form.append('file', sucess);
            this.form.append('upload_preset', this.cloudinaryPreset);

            this.http.post(this.cloudinaryUrl, this.form, this.headers)
              .then((res) => {
                console.log(res)
              })
              .catch((err) => {
                console.log(err)
              })*/
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
          });

        }), function (error) {
                        // error
                        console.log("Failed to read video file from directory, error.code");

            }
    
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
    this.db.object('/users/'+this.uid+ '/'+ this.userKey)
      .update({size: this.videoLink})

    if(this.user.savedOrder){
      for(var prop in this.user.savedOrder){
        this.submitOrder(this.user.savedOrder[prop])
      }
      this.db.object('users/'+this.uid+ '/'+ this.userKey).update({savedOrder: null})
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

      let date1 = new Date();
      let newOrder = {
      clothId: order.clothId,
      options: order.options,
      user: order.user,
      label: order.label,
      name: order.name,
      price: order.price,
      image1: order.image1,
      startDate: date1.toISOString(),
      date: this.deliveryDate,
      status: 'pending',
      userKey: order.userKey,
      size: this.user.size
    }
    let ordersKey = this.db.list('/orders')
      .push(newOrder).key;
    let userOrderKey = this.db.list('/users/'+ this.uid +'/'+ this.userKey+ '/orders')
      .push(newOrder).key;
   let tailorOrderKey = this.db.list('/tailors/' + order.label +'/orders')
      .push(newOrder).key;

     this.db.object('/orders/'+ ordersKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/users/'+this.uid+'/'+this.userKey+'/orders/'+userOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/tailors/' + order.label +'/orders/' + tailorOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
    
  }

  home(){
    this.navCtrl.setRoot(HomePage)
  }

}

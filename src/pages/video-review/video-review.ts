import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-video-review',
  templateUrl: 'video-review.html',
})
export class VideoReviewPage {
  video;
  bodyCheck = 2;
  public videoRef:firebase.storage.Reference;
  progressbar = 0;


  constructor(public navCtrl: NavController, public navParams: NavParams, private file: File, public alertCtrl: AlertController) {
     this.video = navParams.get('video');
     console.log(this.video)

     this.videoRef = firebase.storage().ref().child('/videos');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoReviewPage');
  }

  submitVideo(){

      let filePath = this.getPath(this.video.fullPath, this.video.name);
      // Create the file metadata
      var metadata = {
              contentType: 'video/mp4'
      };

      this.file.readAsArrayBuffer(filePath, this.video.name)
        .then((sucess) => {
            console.log(sucess);

          let  blob = new Blob([sucess], {type: "video/mp4"});
          console.log(blob);
          // Upload file and metadata to the object 'images/mountains.jpg'
          var uploadTask = this.videoRef.child('/' + this.video.name).put(blob);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(progress);
              this.progressbar = Math.floor(progress);
              console.log(this.progressbar)
            }, function(error) {
                console.log('there was an error uploading file');
                let alert = this.alertCtrl.create({
                    title: 'Weldone',
                    subTitle: 'Your Video has been uploaded, you can go ahead and place an order!',
                    buttons: ['OK']
                    });
                    alert.present();
                
            }, function() {
              //    Upload completed successfully, now we can get the download URL
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    console.log(downloadURL)
                    let alert = this.alertCtrl.create({
                        title: 'Ooop!',
                        subTitle: 'Something went wrong, try again plsss!',
                        buttons: ['OK']
                        });
                    alert.present();
                    
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

}

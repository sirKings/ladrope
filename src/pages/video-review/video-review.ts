import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-video-review',
  templateUrl: 'video-review.html',
})
export class VideoReviewPage {
  video;
  bodyCheck = 2;
  public videoRef:firebase.storage.Reference;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
     this.video = navParams.get('video');
     console.log(this.video)

     this.videoRef = firebase.storage().ref().child('videos');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoReviewPage');
  }

  submitVideo(){
       // File or Blob named mountains.jpg
      var file = this.video

      // Create the file metadata
      var metadata = {
              contentType: 'video/mp4'
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = this.videoRef.child('/' + file.name).put(file, metadata);

          // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
          /*switch (error) {
            case 'storage/unauthorized':
          // User doesn't have permission to access the object
            break;

            case 'storage/canceled':
          // User canceled the upload
            break;

            case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
            break;
          }*/
        },      function() {
        //    Upload completed successfully, now we can get the download URL
        var downloadURL = uploadTask.snapshot.downloadURL;
        
    });
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

}

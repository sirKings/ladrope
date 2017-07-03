import { ViewChild, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

@IonicPage()
@Component({
  selector: 'page-video-review',
  templateUrl: 'video-review.html',
})
export class VideoReviewPage {
  @ViewChild('progressbar') progressRef;
  @ViewChild('progress') progress;
  video;
  bodyCheck = 2;
  public videoRef:firebase.storage.Reference;
  progressbar = 0;
  cloudinaryUrl = 'https://api.cloudinary.com/v1_1/ladrope/upload';
  cloudinaryPreset = 'kfmwfbua';
  form;
  user;
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };


  constructor(public navCtrl: NavController, public navParams: NavParams, private file: File, public alertCtrl: AlertController, private http: HTTP) {
     this.video = navParams.get('video');
     this.user = navParams.get('user');
     console.log(this.video);
     //this.form = new FormData();
     this.videoRef = firebase.storage().ref().child('/videos');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoReviewPage');
  }

  submitVideo(){
      let progress = this.progressRef.nativeElement;
      let info = this.progress.nativeElement;

      let filePath = this.getPath(this.video.fullPath, this.video.name);
      // Create the file metadata
      var metadata = {
              contentType: 'video/mp4'
      };

      this.file.readAsDataURL(filePath, this.video.name)
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
          var uploadTask = this.videoRef.child('/' + this.user).put(blob);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              let progresbar = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(progresbar);
              progresbar = Math.floor(progresbar);
              progress.style.width = progresbar + '%';
              info.innerHTML = 'Please wait, Uploading Video';

            }, function(error) {
                console.log('there was an error uploading file');
                info.innerHTML = 'Upload failed, please try agiain'
                this.file.removeFile(this.filePath, this.video.name)
                  .then((res) => {
                    console.log('removed file')
                  })
                  .catch((err) => {
                    console.log('failed to remove')
                  })
            }, function() {
              //    Upload completed successfully, now we can get the download URL
                  var downloadURL = uploadTask.snapshot.downloadURL;
                  console.log(downloadURL)
                  info.innerHTML = 'Upload Completed!! <br> Go to home tab and place your order'
                  this.file.removeFile(this.filePath, this.video.name)
                      .then((res) => {
                        console.log('removed file')
                      })
                      .catch((err) => {
                        console.log('failed to remove')
                      })
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

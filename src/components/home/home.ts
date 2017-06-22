import { Component } from '@angular/core';
import { ModalController, NavController, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { FilterComponent } from '../filter/filter';
import { CommentsPage } from '../../pages/comments/comments';



@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeComponent {
  uid;
  options;
  cloths: FirebaseListObservable<any[]>;
  message = 'LadRope... Bespoke designs made just for you!';
  url = 'www.ladrope.com';
  image;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private modalCtrl: ModalController, private navCtrl: NavController, private socialSharing: SocialSharing, private alertCtrl: AlertController) {

    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.uid = user.uid;
        console.log(this.uid)
        db.object('/users/' + this.uid)
          .subscribe( snapshot => {
                        let userDetails = snapshot;
                        console.log(userDetails);
                        for (var property in userDetails) {
                          if (userDetails.hasOwnProperty(property)) {
                          userDetails = userDetails[property];
                          this.options = userDetails.gender
                          console.log(this.options)
                          this.initialise(this.options)
                          }
                        }
           });
        authObserver.unsubscribe();
      } 
      });
    }

  initialise(options){
     this.cloths = this.db.list('/cloths');
     console.log(this.cloths)
     console.log(options)
  }

  filter() {
    let modal = this.modalCtrl.create(FilterComponent);
    modal.onDidDismiss(data => {
       if(data !== null){
        this.initialise(data)
       } else {}
       
    });

    modal.present();
  }

  like (cloth, uid) {
      this.db.object('/cloths/'+cloth.$key+'/likes').$ref
      .ref.transaction(likes => {
           cloth.likes++;
           
      })

    console.log(uid)
  }

  shareViaTwitter(cloth){
    this.image = cloth.image1;
    this.socialSharing.shareViaTwitter(this.message, this.image, this.url).then(() => {
            let alert = this.alertCtrl.create({
            title: 'Thanks for sharing',
            buttons: ['ok']
            });
          alert.present();
    }).catch(() => {
            let alert = this.alertCtrl.create({
            title: 'Couldnt share',
            subTitle: 'Are you sure Twitter is installed',
            buttons: ['Dismiss']
            });
          alert.present();
    })
    
  }

  shareViaFacebook(cloth){
    this.image = cloth.image1;
    this.socialSharing.shareViaFacebook(this.message, this.image, this.url).then(() => {
            let alert = this.alertCtrl.create({
            title: 'Thanks for sharing',
            buttons: ['ok']
            });
          alert.present();
    }).catch(() => {
            let alert = this.alertCtrl.create({
            title: 'Couldnt share',
            subTitle: 'Are you sure Facebook is installed',
            buttons: ['Dismiss']
            });
          alert.present();
    })
  }

  shareViaWhatsApp(cloth){
    this.image = cloth.image1;
    this.socialSharing.shareViaWhatsApp(this.message, this.image, this.url).then(() => {
            let alert = this.alertCtrl.create({
            title: 'Thanks for sharing',
            buttons: ['ok']
            });
          alert.present();
    }).catch(() => {
            let alert = this.alertCtrl.create({
            title: 'Couldnt share',
            subTitle: 'Are you sure Whatsapp is installed',
            buttons: ['Dismiss']
            });
          alert.present();
    })
  }

  comment(cloth) {
    this.navCtrl.parent.parent.push(CommentsPage, {
        cloth: cloth
    })
  }

  addToCart(cloth) {}

  
}

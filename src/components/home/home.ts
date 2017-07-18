import { Component } from '@angular/core';
import { ModalController, NavController, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';


import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { FilterComponent } from '../filter/filter';
import { CommentsPage } from '../../pages/comments/comments';
import { OptionsPage } from '../../pages/options/options';
import { ClothPage } from '../../pages/cloth/cloth';



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
  user;
  

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private modalCtrl: ModalController, private navCtrl: NavController, private socialSharing: SocialSharing, private alertCtrl: AlertController) {
   

    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.uid = user.uid;
        db.object('/users/' + this.uid)
          .subscribe( snapshot => {
                        this.user = snapshot;
           });
        authObserver.unsubscribe();
        this.initialise()
      } 
    });
   
    //}
  }

  initialise(){
     this.cloths = this.db.list('/cloths');
     //console.log(this.cloths)
  }

  filter() {
    let modal = this.modalCtrl.create(FilterComponent);
    modal.onDidDismiss(data => {
       if(data !== null){
        this.initialise()
       } else {}
       
    });

    modal.present();
  }

  like (cloth, uid) {
      //console.log(cloth.likers)
      let num = cloth.likes
      if(cloth.likers[uid] == true){
        num++;
        this.db.object('/cloths/'+cloth.$key).update({likes: num});
        cloth.likers[uid] = null;
      } else {
       num-- 
      this.db.object('/cloths/'+cloth.$key).update({likes: num});
       cloth.likers[uid] = true;
      }
     this.db.object('/cloths/'+cloth.$key).update({likers: cloth.likers})
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
    let clothkey = cloth.$key;
    this.navCtrl.parent.parent.push(CommentsPage, {
        cloth: cloth,
        key: clothkey
    })
  }

  addToCart(cloth) {
    this.navCtrl.parent.parent.push(OptionsPage, {
        cloth: cloth,
        key: cloth.$key,
        uid: this.uid,
        user: this.user

    })
    
  }

  goToCloth(cloth, uid){
      this.navCtrl.parent.parent.push(ClothPage, {
       
          cloth: cloth,
          uid: uid,
          key: cloth.$key,
          user: this.user
      })
  }
  
}

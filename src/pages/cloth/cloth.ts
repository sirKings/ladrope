import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFireDatabase } from 'angularfire2/database';

import { CommentsPage } from '../../pages/comments/comments';
import { OptionsPage } from '../../pages/options/options';


@IonicPage()
@Component({
  selector: 'page-cloth',
  templateUrl: 'cloth.html',
})
export class ClothPage {
  cloth;
  uid;
  message = 'LadRope... Bespoke designs made just for you!';
  url = 'www.ladrope.com';
  image;
  key;


  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private socialSharing: SocialSharing, private alertCtrl: AlertController) {
    this.cloth = navParams.get('cloth');
    this.uid = navParams.get('uid');
    this.key = navParams.get('key');
  }

  like(cloth, uid) {
      console.log(cloth.likers)
      if(cloth.likers[uid] == true){
        this.db.object('/cloths/'+cloth.$key+'/likes').$ref
      .ref.transaction(likes => {
           cloth.likes--;
        })
        cloth.likers[uid] = null;
      } else {   
      this.db.object('/cloths/'+cloth.$key+'/likes').$ref
      .ref.transaction(likes => {
           cloth.likes++;
           })
       cloth.likers[uid] = true;
      }
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
    this.navCtrl.push(CommentsPage, {
        cloth: cloth,
        key: this.key
    })
  }

  addToCart(cloth) {

    this.navCtrl.push(OptionsPage, {
        cloth: cloth
    })
    
  }
}

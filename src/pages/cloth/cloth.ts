import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

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
  user;
  message = 'LadRope... Bespoke designs made just for you!';
  url = 'https://ladrope.com/cloth/';
  image;
  key;


  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth, public navParams: NavParams, private db: AngularFireDatabase, private socialSharing: SocialSharing, private alertCtrl: AlertController) {
    this.key = navParams.get('key');
  
      const authObserver = afAuth.authState.subscribe( user => {
        if (user) {
          this.uid = user.uid;
          db.object('/users/' + this.uid)
            .subscribe( snapshot => {
                          this.user = snapshot;
                          this.db.object('/cloths/'+'/'+this.user.gender+'/'+this.key).subscribe((res)=>{
                            this.cloth = res;
                          })
              });
               authObserver.unsubscribe();
             } 
           });

    
  }

  like (cloth, uid) {
      //console.log(cloth.likers)
      let num = cloth.likes
      if(cloth.likers[uid] == true){
        num--;
        this.db.object('/cloths/'+'/'+this.user.gender+'/'+this.key).update({likes: num});
        cloth.likers[uid] = null;
      } else {
       num++ 
      this.db.object('/cloths/'+'/'+this.user.gender+'/'+this.key).update({likes: num});
       cloth.likers[uid] = true;
      }
     this.db.object('/cloths/'+'/'+this.user.gender+'/'+this.key).update({likers: cloth.likers})
  }

  share(cloth){
    this.socialSharing.share('Bespoke Designs made for you', 'LadRope', cloth.image1, this.url+this.key).then(() => {
              let alert = this.alertCtrl.create({
              title: 'Thanks for sharing',
              buttons: ['ok']
              });
            alert.present();
      }).catch(() => {
              let alert = this.alertCtrl.create({
              title: 'Couldnt share',
              subTitle: 'Try again later',
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
        cloth: cloth,
        key: this.key,
        uid: this.uid,
        user: this.user
    })
    
  }
}

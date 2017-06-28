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
  /*token;
  graphUrl = 'https://graph.facebook.com/';
  idPath = 'me'+`?access_token=${this.token}`;
  genderPath = `?access_token=${this.token}&fields=gender`;
  gender;*/

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private modalCtrl: ModalController, private navCtrl: NavController, private socialSharing: SocialSharing, private alertCtrl: AlertController) {
    
    /*let res = navParams.get('res');
    console.log(res)

    if(res){
      this.token = res.credential.accessToken;

      let id = this.getId();

      this.gender = this.getGender(id)
      this.initialise(this.gender)
      console.log(this.gender)
    }else {*/

    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        console.log(user)
        this.uid = user.uid;
        console.log(this.uid)
        db.object('/users/' + this.uid)
          .subscribe( snapshot => {
                        let userDetails = snapshot;
                        console.log(userDetails);
                        for (var property in userDetails) {
                          if (userDetails.hasOwnProperty(property)) {
                          this.user = userDetails[property];
                          //this.gender = this.user.gender
                          this.initialise()
                          }
                        }
           });
        authObserver.unsubscribe();
      } 
    });
    //}
  }

  initialise(){
     this.cloths = this.db.list('/cloths');
     console.log(this.cloths)
     console.log()
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
    let clothkey = cloth.$key;
    this.navCtrl.parent.parent.push(CommentsPage, {
        cloth: cloth,
        key: clothkey
    })
  }

  addToCart(cloth) {

    this.navCtrl.parent.parent.push(OptionsPage, {
        cloth: cloth
    })
    
  }

  goToCloth(cloth, uid){
      this.navCtrl.parent.parent.push(ClothPage, {
       
          cloth: cloth,
          uid: uid,
          key: cloth.$key
      })
  }

  /*getId(){
    let url = this.graphUrl + this.idPath;

    return this.http
        .get(url)
        .map(response => response.json()).subscribe(data => {
       data.data.id
     });
  }

  getGender(id) {
      let url = this.graphUrl + this.genderPath;

      return this.http
          .get(url)
          .map(response => response.json()).subscribe(data => {
       data.data.gender
    });
  }*/

  
}

import { Component } from '@angular/core';
import { ModalController, NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { AngularFireDatabase } from 'angularfire2/database';
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
  cloths;
  message = 'LadRope... Bespoke designs made just for you!';
  url = 'https://ladrope.com/cloth/';
  image;
  user;
  limit:BehaviorSubject<number> = new BehaviorSubject<number>(2);
  lastKey: string;
  queryable: boolean = true;
  clothList: Subscription;
  loading: Loading;

  

  constructor(private db: AngularFireDatabase, private loadingCtrl: LoadingController, private afAuth: AngularFireAuth, private modalCtrl: ModalController, private navCtrl: NavController, private socialSharing: SocialSharing, private alertCtrl: AlertController) {
   
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();

    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.uid = user.uid;
        db.object('/users/' + this.uid)
          .subscribe( snapshot => {
                        this.user = snapshot;
                        this.initialise({orderByChild: 'name', limitToFirst: this.limit})
                        this.startTracking();
           });
        if(user.emailVerified){
        
          }else{
            user.sendEmailVerification()
              .then(()=>{

              })
              .catch(()=>{

              })
            let alert = this.alertCtrl.create({
              title: 'Please verify your email address, an email verification link has been sent to your email address',
              buttons: ['ok']
              });
            alert.present();
          }
        
        authObserver.unsubscribe();
      } 
    });
   
  }

  initialise(obj){ 
      this.clothList = this.db.list('/cloths/' + this.user.gender, {
        query: obj
      }).subscribe((res)=>{
        this.loading.dismiss()
        this.cloths = res;
      });
       
  }

  filterWithPrice(obj){
    if(obj.class !== ''){
      this.db.list('/cloths/' + this.user.gender, {
        query: {
          orderByChild: 'tags', 
          equalTo: obj.class
        }
      }).subscribe((res) => {
        this.loading.dismiss()
        this.cloths = res.filter((cloth)=>{
          return cloth.price < obj.price;
        })
      })
    }else{
      this.db.list('/cloths/'+this.user.gender)
        .subscribe((res)=>{
          this.loading.dismiss()
          this.cloths = res.filter((cloth)=>{
            return cloth.price < obj.price;
          })
        })
    }
    
  }

  filter() {
    let modal = this.modalCtrl.create(FilterComponent);
    modal.onDidDismiss(data => {
       if(data !== null){
        if(data.price === ''){
          this.loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
          });
          this.loading.present();
          this.initialise({orderByChild: 'tags', equalTo: data.class})
        }else {
          this.clothList.unsubscribe()
          this.loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
          });
          this.loading.present();
          this.filterWithPrice(data)
        }
        
       } else {
         this.initialise({orderByChild: 'name', limitToFirst: this.limit})
       }
       
    });

    modal.present();
  }

  like (cloth, uid) {
      //console.log(cloth.likers)
      let num = cloth.likes
      if(cloth.likers[uid] === true){
        num--;
        cloth.likes--
        this.db.object('/cloths/'+'/'+this.user.gender+'/'+cloth.$key).update({likes: num});
        cloth.likers[uid] = null;
      } else {
       num++
       cloth.likes++
      this.db.object('/cloths/'+'/'+this.user.gender+'/'+cloth.$key).update({likes: num});
       cloth.likers[uid] = true;
      }
     this.db.object('/cloths/'+'/'+this.user.gender+'/'+cloth.$key).update({likers: cloth.likers})
  }

  shareViaTwitter(cloth){
    this.image = cloth.image1;
    this.socialSharing.shareViaTwitter(this.message, this.image, this.url+cloth.$key).then(() => {
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
    this.socialSharing.shareViaFacebook(this.message, this.image, this.url+cloth.$key).then(() => {
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
    this.socialSharing.shareViaWhatsApp(this.message, this.image, this.url+cloth.$key).then(() => {
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
          key: cloth.$key,
      })
  }

  startTracking(){
      this.db.list('/cloths/' + this.user.gender, {
        query: {
          orderByChild: 'name',
          limitToLast: 1
        }
      }).subscribe((res) => {
          if (res.length > 0) {
                  this.lastKey = res[0].$key;
              } else {
                  this.lastKey = '';
              }
        });

      this.db.list('/cloths/' +this.user.gender, {
        query: {
          orderByChild: 'name',
          limitToFirst: this.limit
        }
      }).subscribe( (data) => {
          if (data.length > 0) {
              // If the last key in the list equals the last key in the database
              if (data[data.length - 1].$key === this.lastKey) {
                  this.queryable = false;
              } else {
                  this.queryable = true;
              }
          }
      });


    }
    doInfinite(infiniteScroll) {
        console.log('Begin async operation');

        if (this.queryable) {
              this.limit.next( this.limit.getValue() + 10);
          }
          
          infiniteScroll.complete();
    }

    info(cloth){
    let info = cloth.description;
    return info + '. Production time is ' +cloth.time +' days';
  }
   
  
}

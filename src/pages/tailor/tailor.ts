import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { CommentsPage } from '../../pages/comments/comments';
import { OptionsPage } from '../../pages/options/options';
import { ClothPage } from '../../pages/cloth/cloth';


@IonicPage()
@Component({
  selector: 'page-tailor',
  templateUrl: 'tailor.html',
})
export class TailorPage {

tailorId;
uid;
user;
cloths;
loading;
tailorName;
message = 'LadRope... Bespoke designs made just for you!';
url = 'https://ladrope.com/cloth/';

@ViewChild('img') img: ElementRef;

  constructor(public navCtrl: NavController, private socialsharing: SocialSharing, private alertCtrl: AlertController, private loadCtrl: LoadingController, public navParams: NavParams, private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
  	
  	this.loading = this.loadCtrl.create({
  	  dismissOnPageChange: true,
  	});
  	this.loading.present();

  	this.tailorId = navParams.get('key');
 	
  	db.object('tailors/'+this.tailorId+ '/name')
  		.subscribe(snapshot =>{
  			this.tailorName = snapshot.$value
  		})
  	

  	  const authObserver = afAuth.authState.subscribe( user => {
  	    if (user) {
  	      this.uid = user.uid;
  	      db.object('/users/' + this.uid)
  	        .subscribe( snapshot => {
  	                      this.user = snapshot;
  	                      this.initialise()
  	          });
  	           authObserver.unsubscribe();
  	         } 
  	       });
  	  
  }

  initialise(){ 
      this.db.list('/cloths/' + this.user.gender, {
        query: {
        	orderByChild: 'labelId',
        	equalTo: this.tailorId
        }

      }).subscribe((res)=>{
        this.loading.dismissAll()
        this.cloths = res;
      });
       
  }

  info(cloth){
    let info = cloth.description;
    return info + '. Production time is ' +cloth.time +' days';
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

  
  share(cloth){
    this.socialsharing.share('Bespoke Designs made for you', 'LadRope', cloth.image1, this.url+cloth.$key).then(() => {
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
    let clothkey = cloth.$key;
    this.navCtrl.push(CommentsPage, {
        cloth: cloth,
        key: clothkey
    })
  }

  addToCart(cloth) {
    this.navCtrl.push(OptionsPage, {
        cloth: cloth,
        key: cloth.$key,
        uid: this.uid,
        user: this.user

    })
    
  }

  goToCloth(cloth, uid){
      this.navCtrl.push(ClothPage, {
          key: cloth.$key,
      })
  } 
  
}

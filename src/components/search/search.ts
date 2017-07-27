import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';


import { ClothPage } from '../../pages/cloth/cloth';


@Component({
  selector: 'search',
  templateUrl: 'search.html'
})
export class SearchComponent {

  public clothList:Array<any>;
  public loadedClothList:Array<any>;
  public clothRef:firebase.database.Reference;
  cloth;
  uid;
  user

  constructor( private afAuth: AngularFireAuth, private navCtrl: NavController, private db: AngularFireDatabase) {
    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        console.log(user)
        this.uid = user.uid;
        db.object( '/users/' + this.uid )
            .subscribe( snapshot => {
                        this.user = snapshot;
                          console.log(this.user)
                          this.clothRef = firebase.database().ref('/cloths/'+this.user.gender);
                          this.clothRef.on('value', clothList => {
                            let cloths = [];
                            clothList.forEach( cloth => {
                              cloths.push(cloth);
                              return false;
                            });

                            this.clothList = cloths;
                            this.loadedClothList = cloths;
                          });
                        })
         authObserver.unsubscribe();
      } 
    });
  }

  initializeCloths(): void {
    this.clothList = this.loadedClothList;
  }

  

  getCloths(ev: any) {
    // Reset items back to all of the items
    this.initializeCloths();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.clothList = this.clothList.filter((item) => {
        return (item.val().name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goToCloth(cloth, uid){
      let clothKey = cloth.key;
      let clothval = cloth.val();
      this.navCtrl.parent.parent.push(ClothPage, {
          cloth: clothval,
          uid: uid,
          key: clothKey
      })
      console.log(cloth)
  }

}

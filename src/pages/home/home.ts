import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

displayName;
photoURL;

constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;
        this.photoURL = null
        return;
      }
      this.displayName = user.displayName;  
      this.photoURL = user.photoURL;
    });
  }

  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => console.log(res));
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

}

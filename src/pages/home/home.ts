import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';

import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

displayName;
photoURL;

constructor(public navCtrl: NavController, private authData: AuthProvider, private afAuth: AngularFireAuth) {

     afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;        
        return;
      }
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
    });
  }

  signOut() {
    this.authData.logoutUser();
    this.navCtrl.push(SignupPage);
  }
}

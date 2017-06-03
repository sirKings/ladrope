import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';

import { SignupPage } from '../../pages/signup/signup';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent {

  
  displayName;
  photoURL;

  constructor(private authData: AuthProvider, private afAuth: AngularFireAuth, public navCtrl: NavController) {
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
    this.navCtrl.parent.parent.setRoot(SignupPage);
  }


}

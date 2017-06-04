import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';

import { SignupPage } from '../../pages/signup/signup';
import { EditUserPage } from '../../pages/edit-user/edit-user';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent {

  
  displayName;
  photoURL;
  email;

  constructor(private authData: AuthProvider, private afAuth: AngularFireAuth, public navCtrl: NavController) {
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;        
        return;
      }
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
      this.email = user.email;
      console.log(user)
    });
  }

  signOut() {
    this.authData.logoutUser();
    this.navCtrl.parent.parent.setRoot(SignupPage);
  }

  editUser(){
      this.navCtrl.push(EditUserPage, {
            displayName: this.displayName,
            photoURL: this.photoURL,
            email: this.email
      });
  }


}

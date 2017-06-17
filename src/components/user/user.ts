import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { SignupPage } from '../../pages/signup/signup';
import { EditUserPage } from '../../pages/edit-user/edit-user';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent {
  userDetails: FirebaseObjectObservable<any>;
  uid;
  user;

  constructor(private authData: AuthProvider, public afAuth: AngularFireAuth, public navCtrl: NavController, private db: AngularFireDatabase) {
    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.uid = user.uid;
        console.log(this.uid)
        authObserver.unsubscribe();
      } 
      });

      this.userDetails = db.object(`users/${this.uid}`, { preserveSnapshot: true })
      this.userDetails.subscribe(d => {
        this.userDetails = d;
        console.log(this.userDetails);
      })
  }

  
  signOut() {
    this.authData.logoutUser();
    this.navCtrl.parent.parent.setRoot(SignupPage);
  }

  editUser(){
      this.navCtrl.push(EditUserPage, {
            displayName: this.user.displayName,
            photoURL: this.user.photoURL,
            email: this.user.email
      });
  }


}

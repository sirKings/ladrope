import { Component, OnInit } from '@angular/core';

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
export class UserComponent implements OnInit {
  
  userDetails: FirebaseObjectObservable<any>;
  uid;
  user;

  constructor(private authData: AuthProvider, public afAuth: AngularFireAuth, public navCtrl: NavController, private db: AngularFireDatabase) {
      const authObserver = this.afAuth.authState.subscribe( user => {
          if (user) {
            this.uid = user.uid;
              console.log(this.uid)
              authObserver.unsubscribe();
          } 
        });
  }

   ngOnInit() {
       
        
        this.db.object( '/users/' + this.uid )
            .subscribe( snapshot => {
                        this.userDetails = snapshot;
                        console.log(this.userDetails);
                        for (var property in this.userDetails) {
                          if (this.userDetails.hasOwnProperty(property)) {
                          this.userDetails = this.userDetails[property];
                          console.log(this.userDetails)
                        }
}
            });
    }
  
  signOut() {
    this.authData.logoutUser();
    this.navCtrl.parent.parent.setRoot(SignupPage);
  }

  editUser(){
     //this.userDetails.uid = this.uid
     this.navCtrl.push(EditUserPage, {
          user: this.userDetails
      });
  }


}

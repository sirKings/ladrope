import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { SignupPage } from '../../pages/signup/signup';
import { EditUserPage } from '../../pages/edit-user/edit-user';
import { MeasurementPage } from '../../pages/measurement/measurement';
import { HeightPage } from '../../pages/height/height';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent implements OnInit {
  
  userDetails: FirebaseObjectObservable<any>;
  uid;
  userKey;

  constructor(private authData: AuthProvider, public afAuth: AngularFireAuth, public navCtrl: NavController, private db: AngularFireDatabase) {
      
  }

  ngOnInit() {
      const authObserver = this.afAuth.authState.subscribe( user => {
          if (user) {
            this.uid = user.uid;
              console.log(this.uid)
         
           this.db.object( '/users/' + this.uid )
            .subscribe( snapshot => {
                        this.userDetails = snapshot;
                        console.log(this.userDetails);
                        for (var property in this.userDetails) {
                          if (this.userDetails.hasOwnProperty(property)) {
                          this.userKey = property;
                          this.userDetails = this.userDetails[property];
                          console.log(this.userDetails)
                        }
                  }
            });
              authObserver.unsubscribe();
          } 
        });
    }
  
  signOut() {
    this.authData.logoutUser();
    this.navCtrl.parent.parent.setRoot(SignupPage);
  }

  editUser(){
     this.navCtrl.push(EditUserPage, {
          user: this.userDetails,
          userKey: this.userKey,
          uid: this.uid
      });
  }

  measure(){
      this.navCtrl.parent.parent.push(MeasurementPage, {
        user: this.userDetails,
        userKey: this.userKey
      })
  }

  height(){
      this.navCtrl.parent.parent.push(HeightPage, {
        user: this.userDetails,
        userKey: this.userKey,
        uid: this.uid
      })
  }


}

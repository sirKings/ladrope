import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthProvider {
  
  userDb;

  constructor(public afAuth: AngularFireAuth, private platform: Platform, private db: AngularFireDatabase) {
      
  }

  loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  resetPassword(email: string): firebase.Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

  signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
  }
  
  signinGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

   writeUserData(uid, displayName, email, imageUrl, address, phone){
      const user = this.db.object(`users/${uid}` , { preserveSnapshot: true });
      user.subscribe(data => {
        if(data.val() === null) {
           console.log('User does not exist');
           this.userDb = this.db.object('/users/'+ uid); 
              this.userDb.set({
              displayName: displayName,
              email: email,
              photoURL: imageUrl,
              address: address,
              phone: phone,
           })
            return;
        } else {
          console.log('User does exist');
        }
      });
   }

   

   updateHeight(height, uid){
   this.userDb = this.db.object('/users/'+ uid);
   this.userDb.update({
              height: height
           })
   }

}
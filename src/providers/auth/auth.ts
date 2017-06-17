﻿import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthProvider {
  
  userDb;

  constructor(public afAuth: AngularFireAuth, private fb: Facebook, private platform: Platform, private twitter: TwitterConnect, private db: AngularFireDatabase) {
      
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
  
  signinFb() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    }
  }

  signinTwitter() {
    if (this.platform.is('cordova')) {
      return this.twitter.login().then(res => {
        console.log(res);
        const credential = firebase.auth.TwitterAuthProvider.credential(res.token, res.secret);
        return firebase.auth().signInWithCredential(credential);
      })
    }
    else {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
    }
  }

  signinGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

   writeUserData(uid, displayName, email, imageUrl, address, gender, phone){
      const user = this.db.object(`users/${uid}` , { preserveSnapshot: true });
      user.subscribe(data => {
        if(data.val() === null) {
           console.log('User does not exist');
           this.userDb = this.db.list('/users/'+uid); 
              this.userDb.push({
              displayName: displayName,
              email: email,
              photoURL: imageUrl,
              address: address,
              phone: phone,
              gender: gender
            })
            return;
        } else {
          console.log('User does exist');
        }
      });
      
  }
}
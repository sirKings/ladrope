import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HomePage } from '../home/home';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';

import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  uid;
  email;
  name;
  photoURL;
  userDetailsForm:FormGroup;

  constructor(public navCtrl: NavController, afAuth: AngularFireAuth, public navParams: NavParams, public formBuilder: FormBuilder, public alertCtrl: AlertController, private authData: AuthProvider) {
    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.uid = user.uid
        this.email = user.email;
        this.name = user.displayName;
        this.photoURL = user.photoURL;
        authObserver.unsubscribe();
        }
      });

    this.userDetailsForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, 
        EmailValidator.isValid])],
      name: ['', Validators.compose([Validators.minLength(2), Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])]
    });
  }



  writeUser(){
      if (this.email){
          this.userDetailsForm.value.email = this.email;
      }

      if (!this.photoURL){
          this.photoURL = 'assets/images/Male-Placeholder.jpg'
      }

      if (this.name) {
          this.userDetailsForm.value.name = this.name;
      }

      this.authData.writeUserData(this.uid, this.userDetailsForm.value.name, this.userDetailsForm.value.email, this.photoURL, this.userDetailsForm.value.address, this.userDetailsForm.value.phone);
      this.navCtrl.setRoot(HomePage);
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

}

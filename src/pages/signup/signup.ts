import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  LoadingController, 
  Loading, 
  AlertController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;
  user;
  photoURL = 'assets/images/Male-Placeholder.jpg';
  

  constructor(public navCtrl: NavController, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      gender: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      passwordRetyped: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser(){
    if(this.signupForm.value.password !== this.signupForm.value.passwordRetyped) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Your password and your re-entered password does not match each other.',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
        let alert = this.alertCtrl.create({
              message: 'Enter Signup details',
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
    } else {
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(res => {
       this.authData.createUser(res.uid, this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.gender, this.photoURL);
       this.navCtrl.setRoot(HomePage)
       console.log(res)
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  signInWithFacebook() {
    this.authData.signinFb()
      .then(res => {
        this.authData.createUser(res.user.uid, res.user.displayName, res.user.email, res.gender, res.user.photoURL);
        this.navCtrl.setRoot(HomePage);
      console.log(res)
      }, error => {
        var errorMessage: string = error.message;
        let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
        alert.present();
      });
  }

  signInWithGoogle() {
    this.authData.signinGoogle()
     .then(res => {
      this.authData.createUser(res.user.uid, res.user.displayName, res.user.email, res.gender, res.user.photoURL);
      this.navCtrl.setRoot(HomePage);
      console.log(res)
      }, error => {
        var errorMessage: string = error.message;
        let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
        alert.present();
      });
  }

  signInWithTwitter() {
    this.authData.signinTwitter()
      .then(res => {
      this.authData.createUser(res.user.uid, res.user.displayName, res.user.email, res.gender, res.user.photoURL);
      this.navCtrl.setRoot(HomePage);
      console.log(res)
      }, error => {
        var errorMessage: string = error.message;
        let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
        alert.present();
      });
  }


  login() {
      this.navCtrl.push(LoginPage)
  }

}
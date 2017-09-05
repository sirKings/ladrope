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

import { AngularFireDatabase } from 'angularfire2/database';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;
  user;
  photoURL
  


  constructor(public navCtrl: NavController, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, private iab: InAppBrowser, private db: AngularFireDatabase) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      gender: ['', Validators.compose([Validators.required])],
      agree: [false],
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
        message: 'Your password and your re-entered password does not match.',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    if(!this.signupForm.value.agree){
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Please agree to the terms and condition.',
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

        if(this.signupForm.value.gender === 'male'){
          this.photoURL  = 'assets/images/Male-Placeholder.jpg';
        }else{
          this.photoURL = 'assets/images/Female-Placeholder1.jpg'
        }

       this.createUser(res.uid, this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.gender, this.photoURL);
       this.loading.dismissAll();
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

  

  signInWithGoogle() {
    this.authData.signinGoogle()
     .then(res => {
      this.createUser(res.user.uid, res.user.displayName, res.user.email, res.gender, res.user.photoURL);
      this.navCtrl.setRoot(HomePage);
      
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

  seeTerms(){
    this.iab.create('https://ladrope.com/privacy');
  }

  createUser(uid, name, email, gender, photoURL) {
     const user = this.db.object(`users/${uid}` , { preserveSnapshot: true });
     user.subscribe(data => {
       if(data.val() === null) {
          let userDb = this.db.object('/users/'+ uid);
          if(email=== null){
              email = 'Enter email'
          }

          if(gender){
             gender = gender;
             }else {
             gender = 'Edit'
          }

          userDb.set({
             displayName: name,
             email: email,
             gender: gender,
             photoURL: photoURL
          }).then(() =>{
            this.navCtrl.setRoot(HomePage)
          })
         
       }else {
       }
     })
  }
}
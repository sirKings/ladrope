import { Component } from '@angular/core';
import { IonicPage, 
         NavController,
         NavParams,
         LoadingController, 
         Loading, 
         AlertController } from 'ionic-angular';

import { FormBuilder, FormGroup } from '@angular/forms';

import { UserComponent } from '../../components/user/user'


@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {
  
  user;
  email;
  photoURL;
  displayName;
  userForm:FormGroup;
  loading:Loading;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.email = navParams.get('email');
    this.photoURL = navParams.get('photoURL');
    this.displayName = navParams.get('displayName');

    this.userForm = formBuilder.group({
        phone: "",
        address: "",
        height: "",
    })

  }

  saveUser(){
      console.log(this.userForm.value);
      this.navCtrl.push(UserComponent)
  }

  cancel(){
      this.navCtrl.push(UserComponent)
  }

}

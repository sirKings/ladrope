import { Component } from '@angular/core';
import { IonicPage, 
         NavController,
         NavParams,
         } from 'ionic-angular';

import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';

import { UserComponent } from '../../components/user/user';


@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {
  
  user;
  userForm:FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private authData: AuthProvider) {
    this.user = navParams.get('user');

    this.userForm = formBuilder.group({
        phone: "",
        address: "",
        height: "",
    })

  }

  saveUser(){
      this.authData.writeUserData(this.user.uid, this.userForm.value.name, this.userForm.value.email, this.user.photoURL, this.userForm.value.address,  this.user.gender, this.userForm.value.phone);
      this.navCtrl.push(UserComponent)
  }

  cancel(){
      this.navCtrl.push(UserComponent)
  }

}

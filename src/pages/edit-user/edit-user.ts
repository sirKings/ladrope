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
  uid;
  user;
  userKey;
  userForm:FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private authData: AuthProvider) {
    this.user = navParams.get('user');
    this.userKey = navParams.get('userKey');
    this.uid = navParams.get('uid');


    this.userForm = formBuilder.group({
        phone: "",
        address: "",
        height: "",
    })

  }

  saveUser(){
      
      this.authData.updateUser(this.uid, this.user.displayName, this.user.email, this.user.photoURL, this.userForm.value.address,  this.user.gender, this.userForm.value.phone, this.userKey);
      this.navCtrl.push(UserComponent)
  }

  cancel(){
      this.navCtrl.push(UserComponent)
  }

}

import { Component } from '@angular/core';
import { IonicPage, 
         NavController,
         NavParams,
         } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  userForm:FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private authData: AuthProvider) {
    this.user = navParams.get('user');
    this.uid = navParams.get('uid');


    this.userForm = formBuilder.group({
        phone: ['', Validators.compose([Validators.required])],
        address:['', Validators.compose([Validators.required])]
    })

    this.userForm.get("address").setValue(this.user.address);
    this.userForm.get("phone").setValue(this.user.phone);
  }

  saveUser(){
      if(!this.userForm.valid){
      
      }else {
        this.authData.updateUser(this.uid, this.user.displayName, this.user.email, this.user.photoURL, this.userForm.value.address, this.userForm.value.phone);
        this.navCtrl.push(UserComponent)
      }
      
  }

  cancel(){
      this.navCtrl.push(UserComponent)
  }

}

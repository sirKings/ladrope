import { Component } from '@angular/core';
import { IonicPage, 
         NavController,
         NavParams,
         AlertController,
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
  height;
  userForm:FormGroup;
  
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, public formBuilder: FormBuilder, private authData: AuthProvider) {
    this.user = navParams.get('user');
    this.uid = navParams.get('uid');


    this.userForm = formBuilder.group({
        phone: ['', Validators.compose([Validators.required])],
        address:['', Validators.compose([Validators.required])],
        height:  ['', Validators.compose([Validators.required])],
        unit: ['', Validators.compose([Validators.required])]
    })

    this.userForm.get("address").setValue(this.user.address);
    this.userForm.get("phone").setValue(this.user.phone);
    if(this.user.height){
      this.userForm.get("height").setValue(this.user.height.height);
      this.userForm.get('unit').setValue(this.user.height.height);
    }
    
  }

  saveUser(){
      if(!this.userForm.valid){
        let alert = this.alertCtrl.create({
                message: 'Enter all details',
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
            alert.present();
      }else {
        this.height = {
          height: this.userForm.value.height,
          unit: this.userForm.value.unit
        }
        
        this.authData.updateUser(this.uid, this.user.displayName, this.user.email, this.height, this.userForm.value.address, this.userForm.value.phone);
        this.navCtrl.push(UserComponent)
      }
      
  }

  cancel(){
      this.navCtrl.push(UserComponent)
  }

}

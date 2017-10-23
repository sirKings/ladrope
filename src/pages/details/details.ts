import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';



@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  

  constructor(private afAuth: AngularFireAuth) {
  	afAuth.auth.signOut()
          
  }



}

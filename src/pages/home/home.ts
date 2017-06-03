import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth';

import { SignupPage } from '../signup/signup';

import { UserComponent } from '../../components/user/user';
import { HomeComponent } from '../../components/home/home';
import { OrderComponent } from '../../components/order/order';
import { LabelsComponent } from '../../components/labels/labels';
import { SearchComponent } from '../../components/search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

displayName;
photoURL;

//tabs components variables
userTab;
homeTab;
order;
labels;
search;


constructor(public navCtrl: NavController, private authData: AuthProvider, private afAuth: AngularFireAuth) {

     afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;        
        return;
      }
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
    });

    this.userTab = UserComponent;
    this.homeTab = HomeComponent;
    this.order = OrderComponent;
    this.labels = LabelsComponent;
    this.search = SearchComponent;

  }

  signOut() {
    this.authData.logoutUser();
    this.navCtrl.push(SignupPage);
  }
}

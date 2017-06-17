import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';



@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeComponent {
  uid;

  cloths: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.cloths = db.list('/cloths');
    console.log(this.cloths);

    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.uid = user.uid;
        console.log(this.uid)
        authObserver.unsubscribe();
      } 
      });
    }

  like () {
    this.cloths.$ref
    .ref.transaction(function(cloth) {
        console.log(cloth.Foofoo)
        if (cloth.Foofoo.likes && cloth.Foofoo.likes[this.uid]) {
          cloth.Foofoo.likesCount--;
          cloth.Foofoo.likes[this.uid] = null;
        } else {
          cloth.Foofoo.likesCount++;
          if (!cloth.Foofoo.likes) {
            cloth.Foofoo.likes = {};
          }
          cloth.Foofoo.likes[this.uid] = true;
        }
    });
  }

  share () {
  
  }

  comment() {}

  addToCart() {}
}

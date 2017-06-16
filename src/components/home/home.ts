import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';



@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeComponent {
  

  cloths: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.cloths = db.list('/cloths');
    console.log(this.cloths)
  }

  like(){
  
  }

}

import { Component } from '@angular/core';


import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'order',
  templateUrl: 'order.html'
})
export class OrderComponent {

postList

  constructor( private db: AngularFireDatabase, private iab: InAppBrowser) {
    this.db.list('blog').subscribe((res)=>{
    	this.postList = res;
    })
  }


  more(post){
    this.iab.create(post.link);
  }

}

import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'completed',
  templateUrl: 'completed.html'
})
export class CompletedComponent {

rate = 0;
order;
oldRating;
newRate;

  constructor(private db: AngularFireDatabase, private viewCtrl: ViewController, public navParams: NavParams) {
    this.order = navParams.get('order');
    this.db.object('/cloths/'+ this.order.clothId)
  		.subscribe(res => {
  			this.oldRating = res.rating
  			console.log(this.oldRating)
  		})
  }

  onModelChange($event){
  	console.log(this.rate)
  	this.newRate = (this.oldRating + this.rate)/ 2;
  		console.log(this.newRate);
  }


  ionViewDidLeave() {
      this.db.object('cloths/'+this.order.clothId).update({rating: this.newRate});
      this.db.object('/orders/'+ this.order.ordersKey).update({status: 'completed'});
     this.db.object('/users/'+this.order.user+'/orders/'+ this.order.userOrderKey).update({status: 'completed'});
     this.db.object('/tailors/' + this.order.label +'/orders/' + this.order.tailorOrderKey).update({status: 'completed'});
  }

  close(){
  	this.viewCtrl.dismiss();
  }
}

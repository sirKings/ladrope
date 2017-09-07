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
oldnumSold;
numSold;
user;

  constructor(private db: AngularFireDatabase, private viewCtrl: ViewController, public navParams: NavParams) {
    this.user = navParams.get('user')
    this.order = navParams.get('order');
    this.db.object('/cloths/'+this.user.gender+'/'+ this.order.clothId)
  		.subscribe(res => {
  			this.oldRating = res.rating;
        this.oldnumSold = res.numSold;
        console.log(this.oldRating)
        console.log(this.oldnumSold)
  		})

      this.numSold = this.oldnumSold + 1;
  }

  onModelChange($event){
  	this.newRate = (this.oldRating + this.rate)/ 2;
    console.log(this.newRate)
    console.log(this.numSold)
  }




  runUpdate() {
      this.order.status = 'completed';
      this.db.object('/cloths/'+this.user.gender+'/'+this.order.clothId).update({numSold: this.numSold, rating: this.newRate})
      this.db.object('/orders/'+ this.order.ordersKey).set(null);
      this.db.list('/completedOrders').push(this.order)
     this.db.object('/users/'+this.order.user+'/orders/'+ this.order.userOrderKey).set(null);
     this.db.list('users/' +this.order.user+'/completedorders').push(this.order);
     this.db.object('/tailors/' + this.order.labelId +'/orders/' + this.order.tailorOrderKey).set(null);
     this.db.list('/tailors/' + this.order.labelId + '/completedOrders').push(this.order);
  }

  close(){
  	this.viewCtrl.dismiss();
    this.runUpdate()
  }
}

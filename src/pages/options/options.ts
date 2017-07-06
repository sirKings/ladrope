import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {
  
  cloth;
  uid;
  key;
  user;
  userKey;
  deliveryDate;
  options;
  showOptions = false;
  clothOptions;
  selectedOptions = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private toastCtrl: ToastController) {
    this.cloth = navParams.get('cloth');
    this.uid = navParams.get('uid');
    this.key = navParams.get('key');
    this.userKey = navParams.get('userKey');
    this.user = navParams.get('user')
    console.log(this.userKey);

    this.deliveryDate = this.addDays(14);
    console.log(this.deliveryDate)

    if(this.cloth.options){
      this.showOptions = true;
      
      this.clothOptions = this.getOptions(this.cloth.options)
      console.log(this.clothOptions)
    }

   
    
  }

  getOptions(obj){
      let result = Object.keys(obj).map(function(e) {
	  let r = Object.keys(obj[e]).map(function(k){
		  return obj[e][k]
	  })
       return r
      });
      return result;
  }

  select(subOption){
     
      let i = this.selectedOptions.indexOf(subOption)
      console.log(i)
      if (i === -1) {
        
        this.selectedOptions.push(subOption)   
      } else {
      
      this.selectedOptions.splice(i, 1)
      }
      console.log(this.selectedOptions)
  }

  checkOptions(subOption){
      let i = this.selectedOptions.indexOf(subOption)
      if(i === -1){
          return true
      } else {
          return false
      }
  }

  pay(){
    this.createOrder(this.cloth, this.selectedOptions);
    console.log(this.userKey)
     /* let options = {
        customer_email: "se@r.c",
        txref: "s23qw3e5rqeasg",
        amount: this.cloth.price,
        callback: function(d){
          this.createOrder(this.cloth, this.selectedOptions)
        }
      }
      window.initRavePay(options)*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsPage');
  }

  createOrder(cloth, options){
    if(this.user.size && this.user.height){
      let date1 = new Date();
      let order = {
      clothId: this.key,
      options: options,
      user: this.uid,
      label: cloth.label,
      name: cloth.name,
      price: cloth.price,
      image1: cloth.image1,
      startDate: date1.toISOString(),
      date: this.deliveryDate,
      status: 'pending',
      userKey: this.userKey,
      size: this.user.size
    }
    let ordersKey = this.db.list('/orders')
      .push(order).key;
    let userOrderKey = this.db.list('/users/'+ this.uid +'/'+ this.userKey+ '/orders')
      .push(order).key;
   let tailorOrderKey = this.db.list('/tailors/' + cloth.label +'/orders')
      .push(order).key;

     this.db.object('/orders/'+ ordersKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/users/'+this.uid+'/'+this.userKey+'/orders/'+userOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/tailors/' + cloth.label +'/orders/' + tailorOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.navCtrl.pop();
    } else {
     let date1 = new Date();
     
    let order = {
      clothId: this.key,
      options: options,
      user: this.uid,
      label: cloth.label,
      name: cloth.name,
      price: cloth.price,
      image1: cloth.image1,
      startDate: date1.toISOString(),
      date: this.deliveryDate,
      status: 'Not Submitted',
      userKey: this.userKey
    }
    
    let userOrderKey = this.db.list('/users/'+ this.uid +'/'+ this.userKey+ '/savedOrders')
      .push(order).key;

    
     this.db.object('/users/'+this.uid+'/'+this.userKey+'/savedOrders/'+userOrderKey).update({userOrderKey: userOrderKey});
       let toast = this.toastCtrl.create({
          message: 'Your orders have been saved, it will be submitted after you take your measurement',
          duration: 5000,
      })
      toast.present()
     this.navCtrl.pop()
    }
  }


  addDays = function(days) {
    let date = new Date();
    let str = date.toISOString();
    let  myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    console.log(myDate)
    return myDate.toString();

  }

}

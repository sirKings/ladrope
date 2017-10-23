import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import {PaycardComponent } from '../../components/paycard/paycard';

@IonicPage()
@Component({
  selector: 'page-height',
  templateUrl: 'height.html',
})
export class HeightPage implements OnInit {
  
cart;
uid;
total;
user;

  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, private http: HTTP, private db: AngularFireDatabase, private navParams: NavParams) {
    
  }

  ngOnInit(){
    this.cart = this.navParams.get('data');
    this.uid = this.navParams.get('uid');
    this.user = this.navParams.get('user');
    this.getTotalPrice(this.cart);
    

  }

  remove(order, i){
    this.cart.splice(i, 1);
    this.getTotalPrice(this.cart);
    this.db.object('users/'+this.uid+'/cart/'+order.cartKey)
      .set(null)
  }

  getTotalPrice(cart){
    this.total = 0;
    cart.forEach(item => {
      this.total += item.price; 
    })
    
  }

  pay() {
    
      let modal = this.modalCtrl.create(PaycardComponent, {amount: this.total, user: this.user});
      modal.onDidDismiss(data => {

         if(data){
           this.cart.forEach((cloth) =>{
             this.createOrder(cloth, data)
           })
           
         }else{

         }
         
      });

      modal.present();
  }


  createOrder(cloth, transRef){
    if(this.user.size && this.user.height){
      let date1 = new Date();
      let order = {
      clothId: cloth.clothId,
      options: cloth.options,
      user: this.uid,
      label: cloth.label,
      orderId: transRef,
      name: cloth.name,
      price: cloth.price,
      image1: cloth.image1,
      displayName: this.user.displayName,
      clientAddress: this.user.address,
      email: this.user.email,
      labelEmail: cloth.labelEmail,
      cost: cloth.cost,
      labelId: cloth.labelId,
      labelPhone: cloth.labelPhone,
      startDate: date1.toISOString(),
      date: this.addDays(cloth.time + 2),
      tailorDate: this.addDays(cloth.time),
      status: 'pending',
      size: this.user.size
    }
    let ordersKey = this.db.list('/orders')
      .push(order).key;
    let userOrderKey = this.db.list('/users/'+ this.uid +'/orders')
      .push(order).key;
   let tailorOrderKey = this.db.list('/tailors/'+cloth.labelId+'/orders')
      .push(order).key;

     this.db.object('/orders/'+ ordersKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/users/'+this.uid+'/'+'/orders/'+userOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/tailors/'+cloth.labelId+'/orders/' + tailorOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.callTailor(cloth)
     let alert = this.alertCtrl.create({
       message: "Congratulations! Your order has been placed and processing started",
       buttons: [
         {
           text: "Ok",
           role: 'cancel',
         }
       ]
     });
     alert.present();
    } else {
     let date1 = new Date();
     
    let order = {
      clothId: cloth.clothId,
      options: cloth.options,
      user: this.uid,
      label: cloth.label,
      labelId: cloth.labelId,
      labelEmail: cloth.labelEmail,
      name: cloth.name,
      price: cloth.price,
      cost: cloth.cost,
      labelPhone: cloth.labelPhone,
      orderId: transRef,
      image1: cloth.image1,
      time: cloth.time,
      startDate: date1.toISOString(),
      status: 'Not Submitted',
    }
    
    let userOrderKey = this.db.list('/users/'+ this.uid +'/savedOrders')
      .push(order).key;

    
     this.db.object('/users/'+this.uid+'/savedOrders/'+userOrderKey).update({userOrderKey: userOrderKey});
     let alert = this.alertCtrl.create({
       message: "Your order have been saved, however you need to provide all required information in the user tab for it to be submitted",
       buttons: [
         {
           text: "Ok",
           role: 'cancel',
         }
       ]
     });
     alert.present();
    }
    this.clearCart()
    this.navCtrl.pop()
  }

  addDays = function(days) {
    let date = new Date();
    let str = date.toISOString();
    let  myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    
    return myDate.toString();

  }

  callTailor(cloth){
    let num = cloth.labelPhone;
    if(num.length === 11){
      num = num.slice(1)
      num = '+234' + num
    }
    let baseUrl = 'http://smsplus4.routesms.com:8080/bulksms/bulksms?username=ladrope&password=rB6V4KDt&type=0&dlr=1&destination='+num+'&source=LadRope&message=Hello%20you%20just%20got%20an%20order%20on%20Ladrope.com.%20Endeavour%20to%20complete%20and%20deliver%20on%20schedule'
    this.http.post(baseUrl, {}, {})
  }

  clearCart(){
    this.db.object('users/'+this.uid+'/cart/')
      .set(null)
  }
}

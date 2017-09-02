import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
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

  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private toastCtrl: ToastController, private http: HTTP, private db: AngularFireDatabase, private navParams: NavParams) {
    
  }

  ngOnInit(){
    this.cart = this.navParams.get('data');
    this.uid = this.navParams.get('uid');
    this.user = this.navParams.get('user');
    this.getTotalPrice(this.cart);
    console.log(this.cart)

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

  // pay(){
  //   let transRef = this.getTransactionRef();
  //   let options = {
  //     customer_email: this.user.email,
  //      txref: transRef,
  //      amount: this.total,
  //      callback: (d)=>{
  //          if(d.tx.chargeResponseCode === '00' || d.tx.chargeResponseCode === '0'){
  //            if(d.success === true && d.tx.amount === this.total){
  //               this.cart.forEach((cloth)=>{
  //                 this.createOrder(cloth, transRef);
  //               })
  //               this.db.object('users/'+this.uid).update({cart: null})
  //            }else{
  //            }
  //          }else{
  //          }
  //      }
  //    }
  //   window.initRavePay(options)
  // }

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
     //this.navCtrl.pop();
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
      displayName: this.user.displayName,
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
       let toast = this.toastCtrl.create({
          message: 'Your orders have been saved, it will be submitted after you take your measurement',
          duration: 5000,
      })
      toast.present()
     //this.navCtrl.pop()
    }
    this.clearCart()
    this.navCtrl.pop()
  }

  addDays = function(days) {
    let date = new Date();
    let str = date.toISOString();
    let  myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    console.log(myDate)
    return myDate.toString();

  }

  callTailor(cloth){
    let baseUrl = 'http://smsplus4.routesms.com:8080/bulksms/bulksms?username=Ladrope.com&password=rB6V4KDt&type=0&dlr=1&destination='+cloth.labelPhone+'&source=LadRope&message=Hello%20you%20just%20got%20an%20order%20on%20Ladrope.com.%20Endeavour%20to%20complete%20and%20deliver%20on%20schedule'
    this.http.post(baseUrl, {}, {})
  }

  clearCart(){
    this.db.object('users/'+this.uid+'/cart/')
      .set(null)
  }
}

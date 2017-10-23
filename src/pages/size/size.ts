import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { HTTP } from '@ionic-native/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-size',
  templateUrl: 'size.html',
})
export class SizePage {

user;
uid;

sizeForm;
order;

  constructor(public navCtrl: NavController, private http: HTTP, private alert: AlertController, private db: AngularFireDatabase, private form: FormBuilder, public navParams: NavParams) {
  	this.user = navParams.get('user');
  	this.uid = navParams.get('uid');

  	this.sizeForm = form.group({
  		head: ['', Validators.required],
  		bicep: ['', Validators.required],
  		sleeve: ['', Validators.required],
  		neck: ['', Validators.required],
  		chest: ['', Validators.required],
  		waist: ['', Validators.required],
  		hips: ['', Validators.required],
  		ankle: ['', Validators.required],
  		thigh: ['', Validators.required],
  		belly: ['', Validators.required],
  		shoulder: ['', Validators.required],
  		fullback: ['', Validators.required],
  		trouserLength: ['', Validators.required],
  		wrist: ['', Validators.required],
  		unit: ['', Validators.required],
      author: this.user.email
  	})
  }

  save(){
  	if(this.sizeForm.valid){
  		this.db.object('users/'+this.uid)
  			.update({size: this.sizeForm.value}).then(() =>{
           let alert = this.alert.create({
                    message: 'Your size has been saved',
                    buttons: [
                      {
                        text: "Ok",
                        role: 'cancel'
                      }
                    ]
                  });
                alert.present();
          if(this.user.savedOrders){
              let savedOrders = this.user.savedOrders
              for(var prop in savedOrders){
                this.submitOrder(savedOrders[prop])
              }
              if(this.user.height){
                let alert = this.alert.create({
                         message: 'Congratulations your orders have been submitted and proccessing started.',
                         buttons: [
                           {
                             text: "Ok",
                             role: 'cancel'
                           }
                         ]
                       });
                     alert.present();
              }
          }
        }).catch(() =>{
          let alert = this.alert.create({
                   message: 'An error occured, Please try again',
                   buttons: [
                     {
                       text: "Ok",
                       role: 'cancel'
                     }
                   ]
                 });
               alert.present();
        })
         
        
  	}else{
  		let alert = this.alert.create({
              message: 'Enter All details',
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
  	}
  }


  submitOrder (order) {

      if(this.user.height){
           let deliveryDate = this.addDays(order.time + 2);
           let tailorDate = this.addDays(order.time)

           let date1 = new Date();
           let newOrder = {
           clothId: order.clothId,
           options: order.options,
           orderId: order.orderId,
           clientAddress: this.user.address,
           email: this.user.email,
           labelEmail: order.labelEmail,
           user: order.user,
           label: order.label,
           name: order.name,
           labelId: order.labelId,
           labelPhone: order.labelPhone,
           displayName: this.user.displayName,
           cost: order.cost,
           price: order.price,
           image1: order.image1,
           startDate: date1.toISOString(),
           date: deliveryDate,
           tailorDate: tailorDate,
           status: 'pending',
           size: this.sizeForm.value
         }
         let ordersKey = this.db.list('/orders')
           .push(newOrder).key;
         let userOrderKey = this.db.list('/users/'+ this.uid +'/orders')
           .push(newOrder).key;
        let tailorOrderKey = this.db.list('/tailors/' + order.labelId +'/orders')
           .push(newOrder).key;

          this.db.object('/orders/'+ ordersKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
          this.db.object('/users/'+this.uid+'/orders/'+userOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
          this.db.object('/tailors/' + order.labelId +'/orders/' + tailorOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey})
          .then(()=>{
            this.db.object('users/'+this.uid).update({savedOrders: null})
          });
          this.callTailor(order)
        }else{
          let alert = this.alert.create({
            message: "Congratulations! Your measurement has been saved submitted. Please provide the remaining information for your order to be submitted ",
            buttons: [
              {
                text: "Ok",
                role: 'cancel',
              }
            ]
          });
          alert.present();
        }
      
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

}

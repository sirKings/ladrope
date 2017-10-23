import { Component } from '@angular/core';
import { IonicPage, 
         NavController,
         NavParams,
         AlertController,
         } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import { AngularFireDatabase } from 'angularfire2/database'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';

import { UserComponent } from '../../components/user/user';


@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {
  uid;
  user;
  height;
  userForm:FormGroup;
  
  constructor(public navCtrl: NavController, private http:HTTP, private db: AngularFireDatabase, private alertCtrl: AlertController, public navParams: NavParams, public formBuilder: FormBuilder, private authData: AuthProvider) {
    this.user = navParams.get('user');
    this.uid = navParams.get('uid');


    this.userForm = formBuilder.group({
        phone: ['', Validators.compose([Validators.required])],
        address:['', Validators.compose([Validators.required])],
        height:  ['', Validators.compose([Validators.required])],
        unit: ['', Validators.compose([Validators.required])]
    })

    this.userForm.get("address").setValue(this.user.address);
    this.userForm.get("phone").setValue(this.user.phone);
    if(this.user.height){
      this.userForm.get("height").setValue(this.user.height.height);
      this.userForm.get('unit').setValue(this.user.height.height);
    }
    
  }

  saveUser(){
      if(!this.userForm.valid){
        let alert = this.alertCtrl.create({
                message: 'Enter all details',
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
            alert.present();
      }else {
        this.height = {
          height: this.userForm.value.height,
          unit: this.userForm.value.unit
        }
        
        this.updateUser(this.uid, this.user.displayName, this.user.email, this.height, this.userForm.value.address, this.userForm.value.phone);

        
        this.navCtrl.push(UserComponent)
      
      }
  }

  submitOrder (order) {
    if(this.user.size){
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
         size: this.user.size
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
        let alert = this.alertCtrl.create({
            message: "Congratulations! Your information has been submitted. Please take your measurement for your order to be submitted",
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

  cancel(){
      this.navCtrl.push(UserComponent)
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

  updateUser(uid, displayName, email, height, address, phone){
      this.db.object('/users/'+ uid).update({
             displayName: displayName,
             email: email,
             height: height,
             address: address,
             phone: phone,
          }).then(()=>{
              if(this.user.savedOrders){
                let savedOrders = this.user.savedOrders;
                for(var prop in savedOrders){
                  this.submitOrder(savedOrders[prop])
                }
                if(this.user.size){
                  let alert = this.alertCtrl.create({
                          message: 'Congratulations! Your order has been submitted and proccessing started',
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
          })
  }

}

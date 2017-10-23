import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { HTTP } from '@ionic-native/http';
import { PaycardComponent } from '../../components/paycard/paycard';

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
  deliveryDate;
  options = {};
  showOptions = false;
  clothOptions;
  selectedOptions = [];
  transRef;
  tailorDate;
  ordered = false;
  

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, public navParams: NavParams, private http: HTTP, private db: AngularFireDatabase) {
    this.cloth = navParams.get('cloth');
    this.uid = navParams.get('uid');
    this.key = navParams.get('key');
    this.user = navParams.get('user')
    this.transRef = this.getTransactionRef();
    this.deliveryDate = this.addDays(this.cloth.time + 2);
    this.tailorDate = this.addDays(this.cloth.time);

    if(this.cloth.options){
      this.showOptions = true;
      
      this.clothOptions = this.getOptions(this.cloth.options)
    }

   
    //this.getTransactionRef()
  }

  getOptions(obj){
      let result = Object.keys(obj).map(function(e) {
	  //let r = Object.keys(obj[e]).map(function(k){
		  return obj[e]//[k]
	  })
      // return r
     // });
      return result;
  }

  select(subOption){
     
      let i = this.selectedOptions.indexOf(subOption)
      if (i === -1) {
        
        this.selectedOptions.push(subOption)   
      } else {
      
      this.selectedOptions.splice(i, 1)
      }
  }

  getOptionsObj(){
    if(this.selectedOptions.length != 0){
      this.selectedOptions.forEach((e, i)=>{
        this.options[i] = e; 
      })
    }else{
      this.options = 'No options'
    }
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

     let modal = this.modalCtrl.create(PaycardComponent, {amount: this.cloth.price, user: this.user});
     modal.onDidDismiss(data => {

        if(data){
            this.createOrder(this.cloth, data)
      
        }else{

        }
        
     });

     modal.present();
  }

  createOrder(cloth, transRef){
    this.getOptionsObj()
    if(this.user.size && this.user.height){
      let date1 = new Date();
      let order = {
      clothId: this.key,
      options: this.options,
      user: this.uid,
      displayName: this.user.displayName,
      label: cloth.label,
      orderId: transRef,
      labelEmail: cloth.labelEmail,
      name: cloth.name,
      price: cloth.price,
      image1: cloth.image1,
      email: this.user.email,
      clientAddress: this.user.address,
      cost: cloth.cost,
      labelId: cloth.labelId,
      labelPhone: cloth.labelPhone,
      startDate: date1.toISOString(),
      date: this.deliveryDate,
      tailorDate: this.tailorDate,
      status: 'pending',
      size: this.user.size
    }
    let ordersKey = this.db.list('/orders')
      .push(order).key;
    let userOrderKey = this.db.list('/users/'+ this.uid +'/orders')
      .push(order).key;
   let tailorOrderKey = this.db.list('/tailors/'+this.cloth.labelId+'/orders')
      .push(order).key;

     this.db.object('/orders/'+ ordersKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/users/'+this.uid+'/'+'/orders/'+userOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
     this.db.object('/tailors/'+this.cloth.labelId+'/orders/' + tailorOrderKey).update({ordersKey: ordersKey, userOrderKey: userOrderKey, tailorOrderKey: tailorOrderKey});
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
      clothId: this.key,
      options: this.options,
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
    this.navCtrl.pop()
  }


  addDays = function(days) {
    let date = new Date();
    let str = date.toISOString();
    let  myDate = new Date(str);
    myDate.setDate(myDate.getDate() + parseInt(days));
    return myDate.toString();

  }

 getTransactionRef(){
    let date = +new Date();
    let transRef = this.uid.substr(1, 4);
    return transRef+date;
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

  addToCart(){
    this.getOptionsObj()
    this.cloth.options = this.options
    let key = this.db.list('users/' +this.uid+ '/cart')
      .push(this.cloth).key
      this.db.object('users/' +this.uid+ '/cart/'+key).update({cartKey: key, clothId: this.key})
    this.navCtrl.pop()
  }

}
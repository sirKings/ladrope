import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { HTTP } from '@ionic-native/http';

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
  options;
  showOptions = false;
  clothOptions;
  selectedOptions = [];
  transRef;
  tailorDate;
  ordered = false;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HTTP, private db: AngularFireDatabase, private toastCtrl: ToastController) {
    this.cloth = navParams.get('cloth');
    this.uid = navParams.get('uid');
    this.key = navParams.get('key');
    this.user = navParams.get('user')
    this.transRef = this.getTransactionRef();
    this.deliveryDate = this.addDays(this.cloth.time + 2);
    console.log(this.deliveryDate)
    this.tailorDate = this.addDays(this.cloth.time);

    if(this.cloth.options){
      this.showOptions = true;
      
      this.clothOptions = this.getOptions(this.cloth.options)
      console.log(this.clothOptions)
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
      this.transRef = this.getTransactionRef;
      let options = {
        customer_email: this.user.email,
         txref: this.transRef,
         amount: this.cloth.price,
         callback: (d)=>{
          this.createOrder(this.cloth, this.selectedOptions);
          this.callTailor(this.cloth)
         }
       }
      window.initRavePay(options)
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
      orderId: this.transRef,
      name: cloth.name,
      price: cloth.price,
      image1: cloth.image1,
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
     //this.navCtrl.pop();
    } else {
     let date1 = new Date();
     
    let order = {
      clothId: this.key,
      options: options,
      user: this.uid,
      label: cloth.label,
      labelId: cloth.labelId,
      name: cloth.name,
      price: cloth.price,
      cost: cloth.cost,
      labelPhone: cloth.labelPhone,
      orderId: this.transRef,
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

 getTransactionRef(){
    let date = +new Date();
    let transRef = this.uid.substr(1, 4);
    return transRef+date;
  }

  callTailor(cloth){
    let baseUrl = 'http://smsplus4.routesms.com:8080/bulksms/bulksms?username=ladrope&password=rB6V4KDt&type=0&dlr=1&destination='+cloth.labelPhone+'&source=LadRope&message=Hello%20you%20just%20got%20an%20order%20on%20Ladrope.com.%20Endeavour%20to%20complete%20and%20deliver%20on%20schedule'
    this.http.post(baseUrl, {}, {})
  }

}

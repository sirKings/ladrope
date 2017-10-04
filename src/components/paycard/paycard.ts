import { Component } from '@angular/core';
import { HTTP } from '@ionic-native/http';

import { ViewController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'paycard',
  templateUrl: 'paycard.html'
})
export class PaycardComponent {

cardForm: FormGroup;
amount;
user;
paymentStatus;
lad;
validationError;
status;
transRef;
error;
loading:Loading;

  constructor(private viewCtrl: ViewController, private loadCtrl: LoadingController, private http: HTTP, private fb: FormBuilder, private navParams: NavParams) {
  	this.amount = navParams.get('amount');
  	this.user = navParams.get('user')


    this.cardForm = fb.group({
    	cardNumber: [null, Validators.required],
    	name: [null, Validators.required],
    	month: [null, Validators.required],
    	year: [null, Validators.required],
    	cvc: [null, Validators.required]
    })
  }


  dismiss() {
  	if(this.paymentStatus){
  		if(this.paymentStatus === true){
  		  		this.viewCtrl.dismiss(this.transRef)
  		  	}else{
  		  		this.viewCtrl.dismiss()
  		  	}
  	 }else{
  		this.viewCtrl.dismiss()
  	}
    
  }

  pay(){
  	let price = this.amount * 100;
  	let email = this.user.email

  	if(this.cardForm.valid){
  		this.validationError = false;
  		(<any>window).window.PaystackPlugin.chargeCard(
  		  (resp) => {
  		    // A valid one-timme-use token is obtained, do your thang!
  		    console.log('charge successful: ', resp);
  		    this.transRef = resp.reference;
  		    this.loading = this.loadCtrl.create({
  		    });
  		    this.loading.present();
  		    this.http.post('https://ladrope.com/verify', {'code': this.transRef, 'amount': price}, {})
  		    	.then((res)=>{
  		    		console.log(res)
  		    		if(res.status === 200 && res.data === 'OK'){

  		    			this.paymentStatus = true;
  		    		}else{
  		    			this.paymentStatus = false;
  		    			this.error = 'Cant verify payment';
  		    		}
  		    		this.loading.dismiss()
  		    	})
  		    	.catch((err)=>{
  		    		console.log(err)
  		    		this.error = 'Cant verify payment';
  		    		this.loading.dismiss()
  		    	})
  		  },
  		  (resp) => {
  		    // Something went wrong, oops - perhaps an invalid card.
  		    this.paymentStatus = false;
  		    console.log('charge failed: ', resp);
  		    this.error = resp.error
  		  },
  		  {
  		    cardNumber: this.cardForm.value.cardNumber+'', 
  		    expiryMonth: this.cardForm.value.month, 
  		    expiryYear: this.cardForm.value.year, 
  		    cvc: this.cardForm.value.cvc,
  		    email: email,
  		    amountInKobo: price
  		});
  	}else{
  		this.validationError = true;

  	}
  }

}

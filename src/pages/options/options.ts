import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {
  
  cloth;
  options;
  showOptions = false;
  clothOptions;
  selectedOptions = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.cloth = navParams.get('cloth');
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
      let options = {
        customer_email: "se@r.c",
        txref: "s23qw3e5rqeasg",
        amount: 1500
      }
      window.initRavePay(options)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsPage');
  }

}

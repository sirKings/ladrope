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
  clothOptions

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.cloth = navParams.get('cloth');
    if(this.cloth.options){
      this.showOptions = true;
      this.options = Object.keys(this.cloth.options)

      console.log(this.options)
       this.clothOptions = this.getOptions(this.cloth.options, this.options)
       console.log(this.clothOptions)
    }

   
    
  }

  getOptions(data, options){
      let optionArray = [];
      for(var opt in options){
        let subOptions = Object.keys(data[options[opt]])
        let subArray = [];
        for( var i in subOptions ){
         subArray.push(data[options[opt[i]]])
         console.log (data[options[opt[i]]])
          }
       optionArray.push(subArray)
      }
      
      return optionArray
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionsPage');
  }

}

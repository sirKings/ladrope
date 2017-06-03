import { Component } from '@angular/core';
import firebase from 'firebase';


@Component({
  selector: 'search',
  templateUrl: 'search.html'
})
export class SearchComponent {

  public clothList:Array<any>;
  public loadedClothList:Array<any>;
  public clothRef:firebase.database.Reference;

  constructor() {
    this.clothRef = firebase.database().ref('/cloths');

    this.clothRef.on('value', clothList => {
      let cloths = [];
      clothList.forEach( cloth => {
        cloths.push(cloth.val());
        return false;
      });

      this.clothList = cloths;
      this.loadedClothList = cloths;
    });
  }

  initializeCloths(): void {
    this.clothList = this.loadedClothList;
  }

  

  getCloths(ev: any) {
    // Reset items back to all of the items
    this.initializeCloths();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.clothList = this.clothList.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}

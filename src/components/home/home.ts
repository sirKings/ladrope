import { Component } from '@angular/core';



@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeComponent {

  text: string;

  constructor() {
    console.log('Hello UserComponent Component');
    this.text = 'Hello World';
  }

}

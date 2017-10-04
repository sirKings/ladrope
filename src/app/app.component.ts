import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';

import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { ClothPage } from '../pages/cloth/cloth';
import { TailorPage } from '../pages/tailor/tailor';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  @ViewChild(Nav) navChild:Nav;

  constructor(platform: Platform, statusBar: StatusBar, private deeplinks: Deeplinks, afAuth: AngularFireAuth, splashScreen: SplashScreen) {
    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        this.rootPage = HomePage;
        authObserver.unsubscribe();
      } else {
        this.rootPage = LandingPage;
        authObserver.unsubscribe();
      }
      });
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      deeplinks.routeWithNavController(this.navChild, {
              '/cloth/:key': ClothPage,
              '/tailor/:key': TailorPage,
              '**': HomePage,
            }).subscribe((match) => {
            }, (nomatch) => {

            });
    });
  }
}


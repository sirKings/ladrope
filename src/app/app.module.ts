import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DeviceMotion } from '@ionic-native/device-motion';
import { VideoCapturePlus} from '@ionic-native/video-capture-plus';
import { File } from '@ionic-native/file';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Ionic2RatingModule } from 'ionic2-rating';
import { HTTP } from '@ionic-native/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';
import { UserComponent } from '../components/user/user';
import { SearchComponent } from '../components/search/search';
import { HomeComponent } from '../components/home/home';
import { OrderComponent } from '../components/order/order';
import { LabelsComponent } from '../components/labels/labels';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { DetailsPage } from '../pages/details/details';
import { FilterComponent } from '../components/filter/filter';
import { CommentsPage } from '../pages/comments/comments';
import { MeasurementPage } from '../pages/measurement/measurement';
import { HeightPage } from '../pages/height/height';
import { TimeModalComponent } from '../components/time-modal/time-modal';
import { VideoPage } from '../pages/video/video';
import { OptionsPage } from '../pages/options/options';
import { VideoReviewPage } from '../pages/video-review/video-review';
import { ClothPage } from '../pages/cloth/cloth';
import { OrderPage } from '../pages/order/order'
import { CompletedComponent } from '../components/completed/completed';

export const firebaseConfig = {

    apiKey: "AIzaSyDlN-RFjSBq4jBipkkyDYtF2AMuu8Kz1TY",
    authDomain: "ladrope-9e888.firebaseapp.com",
    databaseURL: "https://ladrope-9e888.firebaseio.com",
    projectId: "ladrope-9e888",
    storageBucket: "ladrope-9e888.appspot.com",
    messagingSenderId: "205152875857"

}

@NgModule({
  declarations: [
    MyApp,
    HomePage/*,
    SignupPage,
    LoginPage,
    ResetPasswordPage,
    UserComponent,
    SearchComponent,
    HomeComponent,
    OrderComponent,
    LabelsComponent,
    EditUserPage,
    LandingPage,
    DetailsPage,
    FilterComponent,
    CommentsPage,
    MeasurementPage,
    HeightPage,
    TimeModalComponent,
    VideoPage,
    OptionsPage,
    VideoReviewPage,
    ClothPage,
    OrderPage,
    CompletedComponent*/
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    Ionic2RatingModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    LoginPage,
    ResetPasswordPage,
    UserComponent,
    SearchComponent,
    HomeComponent,
    OrderComponent,
    LabelsComponent,
    EditUserPage,
    LandingPage,
    DetailsPage,
    FilterComponent,
    CommentsPage,
    MeasurementPage,
    HeightPage,
    TimeModalComponent,
    VideoPage,
    OptionsPage,
    VideoReviewPage,
    ClothPage,
    OrderPage,
    CompletedComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Facebook,
    TwitterConnect,
    SocialSharing,
    LocalNotifications,
    DeviceMotion,
    File,
    VideoCapturePlus,
    HTTP,
    InAppBrowser
  ]
})
export class AppModule {}

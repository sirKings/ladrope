import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

 cloth
 comments: FirebaseListObservable<any[]>;
 comment: FormGroup;
 title;

  constructor(private navParam: NavParams, private navCtrl: NavController, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private formBuilder: FormBuilder) {

    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        let uid = user.uid
        db.object('/users/'+uid)
          .subscribe(snapshot => {
              this.title = snapshot;
                        for (var property in this.title) {
                          if (this.title.hasOwnProperty(property)) {
                          this.title = this.title[property].displayName;
                           }
                         }
            authObserver.unsubscribe();
          })
      }
    })

    this.cloth = navParam.get('cloth');
    this.comments = db.list('/cloths/'+this.cloth.$key+'/comment');
    this.comment = formBuilder.group({
      message: ['', Validators.compose([Validators.required])]
    })
  }

  sendComment(){
      if (!this.comment.valid){
      
      } else {
         this.comments.push({
         title: this.title,
         message: this.comment.value.message
          })
         this.comment.reset()
      }
     
  }

}


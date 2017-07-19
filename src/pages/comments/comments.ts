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

 cloth;
 numComment;
 comments: FirebaseListObservable<any[]>;
 comment: FormGroup;
 user;
 key;
 authObserver

  constructor(private navParam: NavParams, private navCtrl: NavController, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private formBuilder: FormBuilder) {

    this.authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        let uid = user.uid
        db.object('/users/'+uid)
          .subscribe(snapshot => {
              this.user = snapshot;
              console.log(this.user)
          })
      }
    })

    this.cloth = navParam.get('cloth');
    this.key = navParam.get('key');
    this.comments = db.list('/cloths/'+this.key +'/comment', {
        query: {
            orderByKey: true,
            }
    });
    
    this.comment = formBuilder.group({
      message: ['', Validators.compose([Validators.required])]
    })



  }


  sendComment(cloth){
       
      if (!this.comment.valid){
      
      } else {
         this.comments.push({
         title: this.user.displayName,
         message: this.comment.value.message
          })
          this.cloth.numComment++;
          this.comment.reset()
      }
     
  }

  ionViewDidLeave() {
      let num = this.cloth.numComment;
      this.db.object('cloths/'+this.key).update({numComment: num});
      this.authObserver.unsubscribe();
  }
}


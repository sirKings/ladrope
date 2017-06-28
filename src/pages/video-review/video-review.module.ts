import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideoReviewPage } from './video-review';

@NgModule({
  declarations: [
    VideoReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(VideoReviewPage),
  ],
  exports: [
    VideoReviewPage
  ]
})
export class VideoReviewPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ScheduledTransfersPage } from './scheduled-transfers.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduledTransfersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ScheduledTransfersPage
  ]
})
export class ScheduledTransfersPageModule { }
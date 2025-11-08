import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailPage } from './account-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AccountDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    AccountDetailPage
  ]
})
export class AccountDetailPageModule { }
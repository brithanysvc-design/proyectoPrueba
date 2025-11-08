import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { AccountsListPage } from './accounts-list.page';

const routes: Routes = [
  {
    path: '',
    component: AccountsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    AccountsListPage
  ]
})
export class AccountsListPageModule { }
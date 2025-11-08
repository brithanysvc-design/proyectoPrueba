import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { BeneficiariesListPage } from './beneficiaries-list.page';

const routes: Routes = [
  {
    path: '',
    component: BeneficiariesListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    BeneficiariesListPage
  ]
})
export class BeneficiariesListPageModule { }
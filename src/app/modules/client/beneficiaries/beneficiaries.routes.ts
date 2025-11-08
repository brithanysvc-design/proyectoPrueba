import { Routes } from '@angular/router';

export const BENEFICIARIES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./beneficiaries-list/beneficiaries-list.page')
          .then(m => m.BeneficiariesListPage)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./new-beneficiary/new-beneficiary.page').then(m => m.NewBeneficiaryPage)
      },
      {
        path: 'form',
        loadComponent: () => import('./beneficiary-form/beneficiary-form.page')
          .then(m => m.BeneficiaryFormPage)
      },
      {
        path: 'form/:id',
        loadComponent: () => import('./beneficiary-form/beneficiary-form.page')
          .then(m => m.BeneficiaryFormPage)
      }
    ]
  }
];
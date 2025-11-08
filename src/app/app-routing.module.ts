import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

// Rutas base
const AUTH_PATH = 'auth';
const CLIENT_PATH = 'client';
const MANAGER_PATH = 'manager';
const ADMIN_PATH = 'admin';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadChildren: () => import('./modules/auth/login/login.module').then(m => m.LoginPageModule),
        canActivate: [AuthGuard],
        data: { authPage: true }
      },
      {
        path: 'register',
        loadChildren: () => import('./modules/auth/register/register.module').then(m => m.RegisterPageModule),
        canActivate: [AuthGuard],
        data: { authPage: true }
      }
    ]
  },
  {
    path: 'client',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.Client] },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/client/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'accounts',
        children: [
          {
            path: '',
            loadChildren: () => import('./modules/client/accounts/accounts-list/accounts-list.module').then(m => m.AccountsListPageModule)
          },
          {
            path: ':id',
            loadChildren: () => import('./modules/client/accounts/account-detail/account-detail.module').then(m => m.AccountDetailPageModule)
          }
        ]
      },
      {
        path: 'transfers',
        children: [
          {
            path: 'new',
            loadChildren: () => import('./modules/client/transfers/new-transfer/new-transfer.module').then(m => m.NewTransferPageModule)
          },
          {
            path: 'scheduled',
            loadChildren: () => import('./modules/client/transfers/scheduled-transfers/scheduled-transfers.module').then(m => m.ScheduledTransfersPageModule)
          }
        ]
      },
      {
        path: 'beneficiaries',
        children: [
          {
            path: '',
            loadChildren: () => import('./modules/client/beneficiaries/beneficiaries-list/beneficiaries-list.module').then(m => m.BeneficiariesListPageModule)
          }
        ]
      }
      // Note: payments, history, manager and admin routes are omitted because their modules are not present in the workspace.
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      paramsInheritanceStrategy: 'always'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static getAuthPath() { return AUTH_PATH; }
  static getClientPath() { return CLIENT_PATH; }
  static getManagerPath() { return MANAGER_PATH; }
  static getAdminPath() { return ADMIN_PATH; }
}


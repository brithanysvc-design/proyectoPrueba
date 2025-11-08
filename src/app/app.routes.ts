import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
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
                loadChildren: () => import('./modules/auth/login/login.module').then(m => m.LoginPageModule)
            },
            {
                path: 'register',
                loadChildren: () => import('./modules/auth/register/register.module').then(m => m.RegisterPageModule)
            },
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
                    },
                    {
                        path: 'new',
                        loadComponent: () => import('./modules/client/beneficiaries/new-beneficiary/new-beneficiary.page').then(m => m.NewBeneficiaryPage)
                    },
                    {
                        path: 'form',
                        loadComponent: () => import('./modules/client/beneficiaries/beneficiary-form/beneficiary-form.page').then(m => m.BeneficiaryFormPage)
                    },
                    {
                        path: 'form/:id',
                        loadComponent: () => import('./modules/client/beneficiaries/beneficiary-form/beneficiary-form.page').then(m => m.BeneficiaryFormPage)
                    }
                ]
            },
            {
                path: 'payments',
                children: [
                    {
                        path: 'new-payment',
                        loadComponent: () =>
                            import('./modules/client/payments/new-payment/new-payment.page').then(m => m.NewPaymentPage)
                    },
                    /*  
                      {
                            path: 'scheduled',
                            loadChildren: () => import('./modules/client/payments/scheduled-payments/scheduled-payments.module').then(m => m.ScheduledPaymentsPageModule)
                        }  
                    
                     */
                ]
            },
            {
                path: 'transaction-history',
                loadComponent: () =>
                    import('./modules/client/history/transaction-history/transaction-history.page').then(m => m.TransactionHistoryPage)
            }
        ]
    },

    /*
    {
        path: 'manager',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [UserRole.Manager] },
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/manager/dashboard/dashboard.module').then(m => m.ManagerDashboardPageModule)
            },
            {
                path: 'clients',
                loadChildren: () => import('./modules/manager/clients/clients-list/clients-list.module').then(m => m.ClientsListPageModule)
            },
            {
                path: 'accounts',
                loadChildren: () => import('./modules/manager/accounts/manage-accounts/manage-accounts.module').then(m => m.ManageAccountsPageModule)
            },
            {
                path: 'approvals',
                loadChildren: () => import('./modules/manager/approvals/pending-approvals/pending-approvals.module').then(m => m.PendingApprovalsPageModule)
            }
        ]
    },

    */
    {
        path: 'admin',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: [UserRole.Admin] },
        children: [
            {
                path: 'reports',
                loadComponent: () =>
                    import('./modules/admin/reports/reports-dashboard/reports-dashboard.page').then(m => m.ReportsDashboardPage)
            }         /*   
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/admin/dashboard/dashboard.module').then(m => m.AdminDashboardPageModule)
            },
            {
                path: 'users',
                loadChildren: () => import('./modules/admin/users/users-list/users-list.module').then(m => m.UsersListPageModule)
            },
            {
                path: 'clients',
                loadChildren: () => import('./modules/admin/clients/clients-management/clients-management.module').then(m => m.ClientsManagementPageModule)
            },
            {
                path: 'accounts',
                loadChildren: () => import('./modules/admin/accounts/accounts-management/accounts-management.module').then(m => m.AccountsManagementPageModule)
            },
            {
                path: 'service-providers',
                loadChildren: () => import('./modules/admin/service-providers/providers-list/providers-list.module').then(m => m.ProvidersListPageModule)
            },
            
            {
                path: 'audit',
                loadChildren: () => import('./modules/admin/audit/audit-log/audit-log.module').then(m => m.AuditLogPageModule)
            }

        */
        ]
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }



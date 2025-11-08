import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AccountService } from '@core/services/account.service';
import { TransactionService } from '@core/services/transaction.service';
import { Account, Currency } from '@core/models/account.model';
import { Transaction } from '@core/models/transaction.model';
import { User } from '@core/models/user.model';
import { IonicModule, LoadingController, AlertController, RefresherCustomEvent } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonGrid,
    IonRow,
    IonCol
  ],
})
export class DashboardPage implements OnInit {
  Currency = Currency;
  currentUser: User | null = null;
  accounts: Account[] = [];
  recentTransactions: Transaction[] = [];
  totalBalanceCRC = 0;
  totalBalanceUSD = 0;
  isLoading = true;
  
  // Para el carrusel de cuentas
  selectedAccountIndex = 0;

  quickActions = [
    { 
      icon: 'swap-horizontal', 
      label: 'Transferir', 
      route: '/client/transfers/new',
      color: 'primary' 
    },
    { 
      icon: 'card', 
      label: 'Pagar', 
      route: '/client/payments/new',
      color: 'success' 
    },
    { 
      icon: 'people', 
      label: 'Beneficiarios', 
      route: '/client/beneficiaries',
      color: 'tertiary' 
    },
    { 
      icon: 'time', 
      label: 'Historial', 
      route: '/client/history',
      color: 'warning' 
    }
  ];

  private authService = inject(AuthService);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private router = inject(Router);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  async loadDashboardData() {
    const loading = await this.loadingController.create({
      message: 'Cargando información...',
      spinner: 'crescent'
    });

    await loading.present();

    try {
      // Cargar cuentas
      await this.loadAccounts();
      
      // Cargar transacciones recientes
      await this.loadRecentTransactions();

      this.isLoading = false;
      await loading.dismiss();
    } catch (error: any) {
      this.isLoading = false;
      await loading.dismiss();
      this.showError('Error al cargar la información del dashboard');
    }
  }

  async loadAccounts() {
    return new Promise((resolve, reject) => {
      this.accountService.getAccounts().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.accounts = response.data;
            this.calculateTotalBalances();
            resolve(true);
          } else {
            reject(new Error('Error al cargar cuentas'));
          }
        },
        error: (error) => reject(error)
      });
    });
  }

  async loadRecentTransactions() {
    return new Promise((resolve, reject) => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Últimos 30 días

      this.transactionService.getTransactionHistory({
        startDate,
        endDate
      }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            // Tomar solo las últimas 5 transacciones
            this.recentTransactions = response.data.slice(0, 5);
            resolve(true);
          } else {
            reject(new Error('Error al cargar transacciones'));
          }
        },
        error: (error) => reject(error)
      });
    });
  }

  calculateTotalBalances() {
    this.totalBalanceCRC = this.accounts
      .filter(acc => acc.currency === Currency.CRC)
      .reduce((sum, acc) => sum + acc.balance, 0);

    this.totalBalanceUSD = this.accounts
      .filter(acc => acc.currency === Currency.USD)
      .reduce((sum, acc) => sum + acc.balance, 0);
  }

  async handleRefresh(event: any) {
    await this.loadDashboardData();
    (event as RefresherCustomEvent).target.complete();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewAccountDetail(account: Account) {
    this.router.navigate(['/client/accounts', account.id]);
  }

  viewAllAccounts() {
    this.router.navigate(['/client/accounts']);
  }

  viewAllTransactions() {
    this.router.navigate(['/client/history']);
  }

  onAccountSlideChange(event: any) {
    event.target.getActiveIndex().then((index: number) => {
      this.selectedAccountIndex = index;
    });
  }

  getAccountTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Ahorros': 'wallet',
      'Corriente': 'card',
      'Inversión': 'trending-up',
      'Plazo fijo': 'lock-closed'
    };
    return icons[type] || 'cash';
  }

  getTransactionIcon(type: string): string {
    return type === 'Transferencia' ? 'swap-horizontal' : 'card';
  }

  getTransactionColor(type: string): string {
    return type === 'Transferencia' ? 'primary' : 'success';
  }

  formatCurrency(amount: number, currency: Currency): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: currency === Currency.CRC ? 'CRC' : 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Está seguro que desea cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });

    await alert.present();
  }
}

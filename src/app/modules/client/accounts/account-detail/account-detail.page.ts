import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Account } from '@core/models/account.model';
import { Transaction } from '@core/models/transaction.model';
import { AccountService } from '@core/services/account.service';
import { TransactionService } from '@core/services/transaction.service';
import { IonicModule } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonLoading
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.page.html',
  styleUrls: ['./account-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonLoading
  ]
})
export class AccountDetailPage implements OnInit {
  account: Account | null = null;
  transactions: Transaction[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.loadAccountDetails(accountId);
      this.loadAccountTransactions(accountId);
    }
  }

  loadAccountDetails(accountId: string) {
    this.accountService.getAccountById(accountId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.account = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading account details:', error);
        this.isLoading = false;
      }
    });
  }

  loadAccountTransactions(accountId: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // últimos 30 días

    this.transactionService.getTransactionHistory({
      accountId,
      startDate,
      endDate
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.transactions = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
      }
    });
  }
}
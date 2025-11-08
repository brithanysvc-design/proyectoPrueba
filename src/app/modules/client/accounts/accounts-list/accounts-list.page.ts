import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Account } from '@core/models/account.model';
import { AccountService } from '@core/services/account.service';
import { IonicModule } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonLoading
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.page.html',
  styleUrls: ['./accounts-list.page.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonLoading
  ]
})
export class AccountsListPage implements OnInit {
  accounts: Account[] = [];
  isLoading = true;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.accounts = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.isLoading = false;
      }
    });
  }
}
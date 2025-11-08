import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonAlert,
  IonLoading
} from '@ionic/angular/standalone';
import { Transaction } from '@core/models/transaction.model';
import { TransactionService } from '@core/services/transaction.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-scheduled-transfers',
  templateUrl: './scheduled-transfers.page.html',
  styleUrls: ['./scheduled-transfers.page.scss'],
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
  IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonLoading
  ]
})
export class ScheduledTransfersPage implements OnInit {
  scheduledTransfers: Transaction[] = [];
  isLoading = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadScheduledTransfers();
  }

  async loadScheduledTransfers() {
    try {
      const response = await firstValueFrom(
        this.transactionService.getTransactionHistory({
          startDate: new Date(),
          type: 'Scheduled'
        })
      );

      if (response && response.success && response.data) {
        this.scheduledTransfers = response.data;
      }
    } catch (error) {
      console.error('Error loading scheduled transfers:', error);
    } finally {
      this.isLoading = false;
    }
  }

  handleRefresh(event: any) {
    this.loadScheduledTransfers().then(() => {
      event.target.complete();
    });
  }

  async cancelTransfer(transferId: string) {
    try {
      const response = await firstValueFrom(this.transactionService.cancelScheduledTransaction(transferId));

      if (response && response.success) {
        // Remover la transferencia de la lista
        this.scheduledTransfers = this.scheduledTransfers.filter(t => t.id !== transferId);
      }
    } catch (error) {
      console.error('Error canceling transfer:', error);
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    try {
      return new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch (e) {
      return d.toLocaleDateString('es-CR');
    }
  }

  formatTime(date: Date): string {
    const d = new Date(date);
    try {
      return new Intl.DateTimeFormat('es-CR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
    } catch (e) {
      return d.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
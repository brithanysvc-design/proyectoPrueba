import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Account } from '../../../core/models/account.model';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss'],
})
export class AccountCardComponent {
  @Input() account!: Account;
  @Output() accountClick = new EventEmitter<Account>();

  onCardClick() {
    this.accountClick.emit(this.account);
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: currency === 'CRC' ? 'CRC' : 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Activa': 'success',
      'Bloqueada': 'warning',
      'Cerrada': 'danger'
    };
    return colors[status] || 'medium';
  }
}
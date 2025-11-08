import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { BeneficiaryService } from '../../../../core/services/beneficiary.service';
import { Beneficiary, BeneficiaryStatus } from '../../../../core/models/beneficiary.model';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-beneficiaries-list',
  templateUrl: './beneficiaries-list.page.html',
  styleUrls: ['./beneficiaries-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink]
})
export class BeneficiariesListPage implements OnInit, OnDestroy {
  beneficiaries: Beneficiary[] = [];
  filteredBeneficiaries: Beneficiary[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  private beneficiariesSubscription?: Subscription;

  constructor(
    private beneficiaryService: BeneficiaryService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadBeneficiaries();
  }

  ngOnDestroy() {
    if (this.beneficiariesSubscription) {
      this.beneficiariesSubscription.unsubscribe();
    }
  }

  async loadBeneficiaries() {
    this.isLoading = true;
    try {
      this.beneficiariesSubscription = this.beneficiaryService.getBeneficiaries()
        .subscribe(
          (beneficiaries) => {
            this.beneficiaries = beneficiaries;
            this.applyFilter();
            this.isLoading = false;
          },
          (error) => {
            console.error('Error loading beneficiaries:', error);
            this.showErrorToast('No se pudieron cargar los beneficiarios');
            this.isLoading = false;
          }
        );
    } catch (error) {
      console.error('Error in loadBeneficiaries:', error);
      this.showErrorToast('No se pudieron cargar los beneficiarios');
      this.isLoading = false;
    }
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredBeneficiaries = [...this.beneficiaries];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredBeneficiaries = this.beneficiaries.filter(beneficiary =>
      beneficiary.name.toLowerCase().includes(searchTermLower) ||
      (beneficiary.alias?.toLowerCase().includes(searchTermLower) ?? false) ||
      beneficiary.bankName.toLowerCase().includes(searchTermLower) ||
      beneficiary.accountNumber.includes(this.searchTerm)
    );
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilter();
  }

  async handleRefresh(event: any) {
    await this.loadBeneficiaries();
    event.target.complete();
  }

  getBadgeColor(status: BeneficiaryStatus): string {
    switch (status) {
      case BeneficiaryStatus.ACTIVE:
        return 'success';
      case BeneficiaryStatus.PENDING:
        return 'warning';
      case BeneficiaryStatus.INACTIVE:
        return 'danger';
      default:
        return 'medium';
    }
  }

  formatAccountNumber(accountNumber: string): string {
    // Formato: **** **** **** 1234
    const lastFourDigits = accountNumber.slice(-4);
    return `**** **** **** ${lastFourDigits}`;
  }

  async deleteBeneficiary(beneficiary: Beneficiary) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar a ${beneficiary.name} de tus beneficiarios?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmDeleteBeneficiary(beneficiary);
          }
        }
      ]
    });

    await alert.present();
  }

  private async confirmDeleteBeneficiary(beneficiary: Beneficiary) {
    const loading = await this.loadingController.create({
      message: 'Eliminando beneficiario...'
    });
    await loading.present();

    try {
      await this.beneficiaryService.deleteBeneficiary(beneficiary.id).toPromise();
      this.beneficiaries = this.beneficiaries.filter(b => b.id !== beneficiary.id);
      this.applyFilter();
      this.showSuccessToast('Beneficiario eliminado correctamente');
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      this.showErrorToast('No se pudo eliminar el beneficiario');
    } finally {
      await loading.dismiss();
    }
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}
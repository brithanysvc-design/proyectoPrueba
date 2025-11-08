import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController } from '@ionic/angular';

import { ReportService } from '../../../../core/services/report.service';

@Component({
  selector: 'app-reports-dashboard',
  templateUrl: './reports-dashboard.page.html',
  styleUrls: ['./reports-dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ReportsDashboardPage implements OnInit {

  // ✅ PROPIEDADES QUE FALTABAN
  transactionVolumeData: any;
  topClientsData: any;
  dailyTransactionsData: any;

  // Datos estadísticos
  stats = {
    totalTransactions: 0,
    totalAmount: 0,
    totalClients: 0,
    activeAccounts: 0
  };

  isLoading = true;
  selectedPeriod = 'month'; // 'week', 'month', 'year'

  constructor(
    private reportService: ReportService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  async loadReports() {
    const loading = await this.loadingController.create({
      message: 'Cargando reportes...',
      spinner: 'crescent'
    });

    await loading.present();

    try {
      // Cargar datos de reportes
      await Promise.all([
        this.loadTransactionVolume(),
        this.loadTopClients(),
        this.loadDailyTransactions(),
        this.loadStats()
      ]);

      this.isLoading = false;
      await loading.dismiss();
    } catch (error) {
      this.isLoading = false;
      await loading.dismiss();
      console.error('Error loading reports:', error);
    }
  }

  async loadTransactionVolume() {
    this.transactionVolumeData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Transferencias',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        },
        {
          label: 'Pagos',
          data: [28, 48, 40, 19, 86, 27],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        }
      ]
    };
  }

  async loadTopClients() {
    this.topClientsData = {
      labels: ['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D', 'Cliente E'],
      datasets: [{
        label: 'Volumen de Transacciones',
        data: [300, 250, 200, 150, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }]
    };
  }

  async loadDailyTransactions() {
    this.dailyTransactionsData = {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Transacciones Diarias',
        data: [120, 150, 180, 90, 200, 80, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true
      }]
    };
  }

  async loadStats() {
    this.stats = {
      totalTransactions: 15234,
      totalAmount: 45678900,
      totalClients: 1234,
      activeAccounts: 3456
    };
  }

  onPeriodChange(event: any) {
    this.selectedPeriod = event.target.value;
    this.loadReports();
  }

  async downloadReport(format: 'pdf' | 'excel') {
    const loading = await this.loadingController.create({
      message: `Generando reporte en ${format.toUpperCase()}...`,
      spinner: 'crescent'
    });

    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
    }, 2000);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount);
  }
}

import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { User, UserRole } from './core/models/user.model';
import { MenuController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  menuItems: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Dev helper: si estamos en localhost y no hay sesión, inyectar un usuario y token de prueba
    // Esto facilita ver las páginas protegidas durante el desarrollo. Será sólo activo en localhost
    // y se recarga la app para que AuthService lea el storage en su constructor.
    try {
      if ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') && !localStorage.getItem('token')) {
        const devUser = {
          id: 'local-1',
          email: 'test@example.com',
          fullName: 'Usuario Local',
          role: 'Client'
        };
        const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // +1 hora
        const fakeToken = 'header.' + btoa(JSON.stringify(payload)) + '.signature';
        localStorage.setItem('user', JSON.stringify(devUser));
        localStorage.setItem('token', fakeToken);
        // Recargar para que AuthService cargue el usuario desde localStorage
        setTimeout(() => location.reload(), 50);
      }
    } catch (e) {
      // no bloquear si btoa o localStorage falla
      console.warn('Dev session helper: no se pudo crear sesión automática', e);
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.updateMenu();
    });
  }

  updateMenu() {
    if (!this.currentUser) {
      this.menuItems = [];
      return;
    }

    switch (this.currentUser.role) {
      case UserRole.Client:
        this.menuItems = [
          { title: 'Inicio', url: '/client/dashboard', icon: 'home' },
          { title: 'Mis Cuentas', url: '/client/accounts', icon: 'wallet' },
          { title: 'Transferencias', url: '/client/transfers/new', icon: 'swap-horizontal' },
          { title: 'Pagos', url: '/client/payments/new', icon: 'card' },
          { title: 'Beneficiarios', url: '/client/beneficiaries', icon: 'people' },
          { title: 'Historial', url: '/client/history', icon: 'time' }
        ];
        break;

      case UserRole.Manager:
        this.menuItems = [
          { title: 'Inicio', url: '/manager/dashboard', icon: 'home' },
          { title: 'Clientes', url: '/manager/clients', icon: 'people' },
          { title: 'Cuentas', url: '/manager/accounts', icon: 'wallet' },
          { title: 'Aprobaciones', url: '/manager/approvals', icon: 'checkmark-circle' }
        ];
        break;

      case UserRole.Admin:
        this.menuItems = [
          { title: 'Inicio', url: '/admin/dashboard', icon: 'home' },
          { title: 'Usuarios', url: '/admin/users', icon: 'person' },
          { title: 'Clientes', url: '/admin/clients', icon: 'people' },
          { title: 'Cuentas', url: '/admin/accounts', icon: 'wallet' },
          { title: 'Proveedores', url: '/admin/service-providers', icon: 'business' },
          { title: 'Reportes', url: '/admin/reports', icon: 'stats-chart' },
          { title: 'Auditoría', url: '/admin/audit', icon: 'shield-checkmark' }
        ];
        break;
    }
  }

  logout() {
    this.authService.logout();
    this.menuController.close();
  }
}
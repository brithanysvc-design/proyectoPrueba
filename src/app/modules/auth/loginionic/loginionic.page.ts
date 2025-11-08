import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Bienvenido</h1>
      <p>Esta es la página de login</p>
      <ion-button expand="block" (click)="goToRegister()">
        Ir a Registro
      </ion-button>
    </ion-content>
  `,
})
export class LoginPage {
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-[NOMBRE]',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './[NOMBRE].page.html',
  styleUrls: ['./[NOMBRE].page.scss'],
})
export class [NOMBRE_CLASE]Page implements OnInit {
  title = '[TITULO]';
  items: any[] = [];
  isLoading = false;

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    // Aquí irá la lógica para cargar datos
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  refresh(event: any) {
    this.loadData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
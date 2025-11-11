import { Component } from '@angular/core';
import { PropiedadService } from '../../services/propiedad-service';
import { Propiedad } from '../../models/propiedad';
import { HomeService } from '../../services/home-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {

  propiedades: Propiedad[];
  menuDesplegado: boolean = true;
  vistaActual: string;
  filtroActual: string = "Precio";

  constructor(private propiedadService: PropiedadService, private homeService: HomeService, private router: Router){
    this.propiedades = propiedadService.getPropiedades();
    this.vistaActual = homeService.getVista();
  }

  desplegarMenu(){
    this.menuDesplegado = !this.menuDesplegado
  }

  cambiarVista(vista: string){
    this.vistaActual = vista;
  }

  cambiarFiltro(filtro: string){
    if(filtro == this.filtroActual){
      this.filtroActual = "";
    }else{
      this.filtroActual = filtro
    }
  }

  crearPlan(vivienda_id: number){
    this.router.navigate(['/crear/' + vivienda_id]);
  }
}

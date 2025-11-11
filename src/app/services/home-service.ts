import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  vistaActual: string = "Viviendas";

  cambiarVista(vista: string){
    this.vistaActual = vista;
  }

  getVista(){
    return this.vistaActual;
  }
}

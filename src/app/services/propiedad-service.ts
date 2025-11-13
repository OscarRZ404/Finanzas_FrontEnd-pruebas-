import { Injectable } from '@angular/core';
import { Propiedad } from '../models/propiedad';

@Injectable({
  providedIn: 'root',
})
export class PropiedadService {
  propiedades: Propiedad[] = [
    {
      propiedad_id: 1,
      nombre: "Villa Sol",
      distrito: "Vellavista",
      direccion: "nolose",
      valor_vivienda: 163000,
      moneda_id: 1,

      bbp: true,
      periodo_gracia: true
    },
    {
      propiedad_id: 2,
      nombre: "Los Sauces",
      distrito: "Vellavista",
      direccion: "nolose",
      valor_vivienda: 583900,
      moneda_id: 1,

      bbp: true,
      periodo_gracia: true
    },
    {
      propiedad_id: 3,
      nombre: "Campo Claro",
      distrito: "Vellavista",
      direccion: "nolose",
      valor_vivienda: 280000,
      moneda_id: 1,

      bbp: true,
      periodo_gracia: false
    },
    {
      propiedad_id: 4,
      nombre: "Los Abedules",
      distrito: "Vellavista",
      direccion: "nolose",
      valor_vivienda: 280000,
      moneda_id: 1,

      bbp: false,
      periodo_gracia: true
    }
  ]

  getPropiedades(){
    return this.propiedades;
  }

  getPropiedadById(id: number){
    return this.propiedades.find(p => p.propiedad_id == id);
  }
}

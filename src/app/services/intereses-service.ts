import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InteresesService {
  tipoTasas: Array<string> = [
    "Nominal",
    "Efectiva"
  ]

  bancos: Array<string> = [
    "BCP",
  ]

  periodos: Array<string> = [
    "Anual",
    "Semestral",
    "Trimestral",
    "Mensual"
  ]

  capitalizaciones: Array<string> = [
    "Anual",
    "Trimestral",
    "Semanal",
    "Mensual",
    "Diaria"
  ]

  getTipoTasas(){
    return this.tipoTasas;
  }

  getBancos(){
    return this.bancos;
  }

  getPeriodos(){
    return this.periodos;
  }

  getCapitalizaciones(){
    return this.capitalizaciones;
  }
}

import { Injectable } from '@angular/core';
import { Plan } from '../models/plan-pago';
import { Cuota } from '../models/cuota';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  planes: Plan[] = [
    {
      plan_id: 1,
      usuario_id: 1,
      propiedad_id: 1,

      banco: "BCP",
      tipoTasa: "Efectiva",
      plazoTasa: "Anual",
      capitalizacion: "Anual",
      tasaInteres: 0.11,
      precioPropiedad: 350000,
      cuotaInicial: 20,

      graciaTotal: 2,
      graciaParcial: 2,

      plazoPrestamo: 4,

      costoNotarial: 150,
      costoRegistal: 200,
      tasacion: 120,
      comisionDeEstudio: 100,
      comisionPorActivacion: 0,

      comisionPeriodica: 3,
      portes: 3.50,
      gastosAdministracion: 10,
      seguroDesgravamen: 0.0004500,
      seguroRiesgo: 0.004,

      cok: 0.27
    }
  ]

  convertirTasa(tasa: number, tipo: string, plazo: string, capitalizacion: string){
    let tasaEfectiva = 0;
    //Extraer Datos
    let diasCapitalizacion = 0;
    let diasPlazoCuota = 0;
    switch(plazo){
      case "Anual":
        diasPlazoCuota = 360;
      break;
      case "Semestral":
        diasPlazoCuota = 180;
      break;
      case "Trimestral":
        diasPlazoCuota = 90;
      break;
      case "Mensual":
        diasPlazoCuota = 30;
      break;
    }
    switch(capitalizacion){
      case "Anual":
        diasCapitalizacion = 360;
      break;
      case "Semestral":
        diasCapitalizacion = 180;
      break;
      case "Trimestral":
        diasCapitalizacion = 90;
      break;
      case "Mensual":
        diasCapitalizacion = 30;
      break;
      case "Diaria":
        diasCapitalizacion = 1;
      break;
    }
    //Si es tasa nominal, se convierte a efectiva
    if(tipo == "Nominal"){
      tasaEfectiva = ((1 + (tasa/(diasPlazoCuota/diasCapitalizacion)))**(diasPlazoCuota/diasCapitalizacion)) - 1;
    }else{
      tasaEfectiva = tasa;
    }
    //Pasar Tasa Efectiva de cualquier periodo a TEM
    tasaEfectiva = ((1 + tasaEfectiva)**(30/diasPlazoCuota)) - 1;

    return tasaEfectiva;
  }

  crearCuotas(plan: Plan){
    let listaCuotas = [];

    let nCuotas = plan.plazoPrestamo * 12;

    let npropiedad_id = plan.propiedad_id;
    let nusuario_id = plan.usuario_id;
    let ntem = this.convertirTasa(plan.tasaInteres, plan.tipoTasa, plan.plazoTasa, plan.capitalizacion)
    let nDesgravamen = plan.seguroDesgravamen;
    let nseguroRiesgo = plan.seguroRiesgo;
    let ncomisionPeriodica = plan.comisionPeriodica;
    let nportes = plan.portes;
    let ngastosAdministracion = plan.gastosAdministracion;
    let nsaldoInicial = (plan.precioPropiedad - (plan.cuotaInicial * plan.precioPropiedad / 100)) + (plan.costoNotarial + plan.costoRegistal + plan.tasacion + plan.comisionDeEstudio + plan.comisionPorActivacion);

    for(let i = 0; i < nCuotas; i++){
      let ncuota_id = i + 1;
      let nnCuota = i + 1;
      let ntasaInteres = plan.tasaInteres;
      let ninteres = nsaldoInicial * ntem;

      let ncuota = 0;
      let namortizacion = 0;
      let nsaldoFinal = 0;
      if(i < plan.graciaTotal){
        ncuota = 0;
        namortizacion = 0;
        nsaldoFinal = nsaldoInicial + ninteres;
      }else if(i < plan.graciaParcial + plan.graciaTotal){
        ncuota = ninteres;
        namortizacion = 0;
        nsaldoFinal = nsaldoInicial - namortizacion;
      }else{
        ncuota = nsaldoInicial * (ntem + nDesgravamen) / (1 - (1 + ntem + nDesgravamen)**-(nCuotas - i));
        namortizacion = ncuota - ninteres - (nDesgravamen * nsaldoInicial);

        nsaldoFinal = nsaldoInicial - namortizacion;
      }
      let nflujo = ncuota + (nseguroRiesgo * plan.precioPropiedad / (nCuotas)) + ncomisionPeriodica + nportes + ngastosAdministracion;

      let nuevaCuota: Cuota = {
        cuota_id: ncuota_id,
        propiedad_id: nnCuota,
        usuario_id: 1,

        nCuota: i + 1,

        tasaInteres: ntasaInteres,
        tem: ntem,
        saldoInicial: Number(nsaldoInicial.toFixed(2)),
        interes: Number(ninteres.toFixed(2)),
        cuota: Number(ncuota.toFixed(2)),
        amortizacion: Number(namortizacion.toFixed(2)),
        seguroDesgravamen: (nDesgravamen * nsaldoInicial),
        seguroRiesgo: (nseguroRiesgo * plan.precioPropiedad / (nCuotas)),
        comision: ncomisionPeriodica,
        portes: nportes,
        gastosAdministrativos: ngastosAdministracion,
        saldoFinal: Number(nsaldoFinal.toFixed(2)),
        flujo: nflujo,
      }
      listaCuotas.push(nuevaCuota);

      //Actualizar el saldo inicial
      nsaldoInicial = nsaldoFinal;
    }
    console.warn("hola");
    
    return listaCuotas;
  }

  getPlanes(){
    return this.planes;
  }
  getPlanById(id: number){
    return this.planes.find(p => p.plan_id == id);
  }
}

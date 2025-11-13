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
      tasaInteres: 0.11,
      precioPropiedad: 350000,
      cuotaInicial: 70000,

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

  crearCuotas(plan: Plan){
    let listaCuotas = [];

    let nCuotas = plan.plazoPrestamo * 12;

    let npropiedad_id = plan.propiedad_id;
    let nusuario_id = plan.usuario_id;
    let ntem = ((1 + plan.tasaInteres)**(30/360)) - 1;
    let nDesgravamen = plan.seguroDesgravamen;
    let nseguroRiesgo = plan.seguroRiesgo;
    let ncomisionPeriodica = plan.comisionPeriodica;
    let nportes = plan.portes;
    let ngastosAdministracion = plan.gastosAdministracion;
    let nsaldoInicial = (plan.precioPropiedad - plan.cuotaInicial) + (plan.costoNotarial + plan.costoRegistal + plan.tasacion + plan.comisionDeEstudio + plan.comisionPorActivacion);
    for(let i = 0; i < nCuotas; i++){
      let ncuota_id = i + 1;
      let nnCuota = i + 1;
      let ntasaInteres = plan.tasaInteres;
      let ninteres = nsaldoInicial * ntem;
      let ncuota = nsaldoInicial * (ntem + nDesgravamen) / (1 - (1 + ntem + nDesgravamen)**-(nCuotas - i));
      let namortizacion = ncuota - ninteres - (nDesgravamen * nsaldoInicial);
      nseguroRiesgo = nseguroRiesgo * plan.precioPropiedad / (nCuotas);
      let nflujo = ncuota + nseguroRiesgo + ncomisionPeriodica + nportes + ngastosAdministracion;
      let nsaldoFinal = nsaldoInicial - namortizacion;

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
        seguroDesgravamen: nDesgravamen,
        seguroRiesgo: nseguroRiesgo,
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

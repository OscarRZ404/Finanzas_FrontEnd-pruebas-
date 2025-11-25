import { Injectable } from '@angular/core';
import { Plan } from '../models/plan-pago';
import { Cuota } from '../models/cuota';
import { PropiedadService } from './propiedad-service';
import { UsuarioService } from './usuario-service';
import { HttpClient } from '@angular/common/http';
import { Propiedad } from '../models/propiedad';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(private propiedadService: PropiedadService, private usuarioService: UsuarioService, private http: HttpClient){
    
  }

  private baseUrl = 'http://localhost:8080/mivivienda/planes';

  getPlanById(planId: number){
    return this.http.get<Plan>(`${this.baseUrl}/mostrar/${planId}`);
  }

  getPlanesPorUsuario(usuarioId: number){
    return this.http.get<Plan[]>(`${this.baseUrl}/${usuarioId}`);
  }

  crearPlan(usuarioId: number, propiedadId: number, plan: Plan){
    return this.http.post<Plan>(`${this.baseUrl}/crear/${usuarioId}/${propiedadId}`, plan);
  }

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

  getRangoPrecio(precioPropiedad: number){
    let bbp = "";
    if(precioPropiedad >= 68800){
      if(precioPropiedad <= 98100){
        bbp = "R1"
      }else if(precioPropiedad <= 146900){
        bbp = "R2";
      }else if(precioPropiedad <= 244600){
        bbp = "R3";
      }else if(precioPropiedad <= 362100){
        bbp = "R4";
      }else if(precioPropiedad <= 488800){
        bbp = "R5"
      }
    }else{
        return "No Aplica";
    }
    return bbp;
  }

  calcularBBP(precioPropiedad: number, tipoVivienda: string, edad: number, salario: number, discapacidad: boolean, desplazo: boolean, migrante: boolean){
    let bbp = 0;
    if(precioPropiedad >= 68800 ){
      if(precioPropiedad <= 98100){
        bbp = 27400;
      }else if(precioPropiedad <= 146900){
        bbp = 22800;
      }else if(precioPropiedad <= 244600){
        bbp = 20900;
      }else if(precioPropiedad <= 362100){
        bbp = 7800;
      }else{
        return bbp;
      }
    }
    if(tipoVivienda == "Sostenible"){
      bbp = bbp + 6300;
    }
    if(edad >= 65 || salario <= 4746 || discapacidad == true || desplazo == true || migrante == true){
      bbp = bbp + 3600;
    }

    return bbp;
  }

crearCuotas(plan: Plan): Observable<Cuota[]> {
  const nCuotas = plan.plazoPrestamo * 12;

  return forkJoin({
    vivienda: this.propiedadService.getPropiedadById(plan.propiedad_id),
    usuario: this.usuarioService.getUsuarioById(plan.usuario_id)
  }).pipe(
    map(({ vivienda, usuario }) => {
      const listaCuotas: Cuota[] = [];

      const bbp = this.calcularBBP(
        plan.precioPropiedad,
        vivienda.tipo,
        usuario.edad,
        usuario.salario,
        usuario.discapacidad,
        usuario.desplazado,
        usuario.migrante
      );

      const ntem = this.convertirTasa(plan.tasaInteres, plan.tipoTasa, plan.plazoTasa, plan.capitalizacion);
      const nDesgravamen = plan.seguroDesgravamen;
      const nseguroRiesgo = plan.seguroRiesgo;
      const ncomisionPeriodica = plan.comisionPeriodica;
      const nportes = plan.portes;
      const ngastosAdministracion = plan.gastosAdministracion;

      let nsaldoInicial = (plan.precioPropiedad - (plan.cuotaInicial * plan.precioPropiedad / 100)) + (plan.costoNotarial + plan.costoRegistral + plan.tasacion + plan.comisionDeEstudio + plan.comisionPorActivacion - bbp);

      for (let i = 0; i < nCuotas; i++) {
        const ncuota_id = i + 1;
        const ntasaInteres = plan.tasaInteres;
        const ninteres = nsaldoInicial * ntem;

        let ncuota = 0;
        let namortizacion = 0;
        let nsaldoFinal = 0;

        if (i < plan.graciaTotal) {
          nsaldoFinal = nsaldoInicial + ninteres;
        } else if (i < plan.graciaParcial + plan.graciaTotal) {
          ncuota = ninteres;
          nsaldoFinal = nsaldoInicial;
        } else {
          ncuota = nsaldoInicial * (ntem + nDesgravamen) /
            (1 - Math.pow(1 + ntem + nDesgravamen, -(nCuotas - i)));
          namortizacion = ncuota - ninteres - (nDesgravamen * nsaldoInicial);
          nsaldoFinal = nsaldoInicial - namortizacion;
        }

        const nflujo = ncuota +
          (nseguroRiesgo * plan.precioPropiedad / nCuotas) +
          ncomisionPeriodica + nportes + ngastosAdministracion;

        const nuevaCuota: Cuota = {
          cuota_id: ncuota_id,
          propiedad_id: plan.propiedad_id,
          usuario_id: plan.usuario_id,

          nCuota: i + 1,
          tasaInteres: ntasaInteres,
          tem: ntem,
          saldoInicial: Number(nsaldoInicial.toFixed(2)),
          interes: Number(ninteres.toFixed(2)),
          cuota: Number(ncuota.toFixed(2)),
          amortizacion: Number(namortizacion.toFixed(2)),
          seguroDesgravamen: nDesgravamen * nsaldoInicial,
          seguroRiesgo: nseguroRiesgo * plan.precioPropiedad / nCuotas,
          comision: ncomisionPeriodica,
          portes: nportes,
          gastosAdministrativos: ngastosAdministracion,
          saldoFinal: Number(nsaldoFinal.toFixed(2)),
          flujo: nflujo
        };

        listaCuotas.push(nuevaCuota);
        nsaldoInicial = nsaldoFinal;
      }

      return listaCuotas;
    })
  );
}
}

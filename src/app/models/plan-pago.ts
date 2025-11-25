import { Propiedad } from "./propiedad";
import { Usuario } from "./usuario";

export interface Plan{
    //Info Plan
    id: number,
    usuario_id: number,
    propiedad_id: number,
    //Tasa de Interes
    banco: string,
    tipoTasa: string,
    plazoTasa: string,
    tasaInteres: number,
    capitalizacion: string,

    graciaTotal: number,
    graciaParcial: number,
    //Propiedad
    precioPropiedad: number,
    nombrePropiedad: string,
    cuotaInicial: number,

    bbp: boolean,

    plazoPrestamo: number,

    //Gastos Iniciales

    costoNotarial: number,
    costoRegistral: number,
    tasacion: number,
    comisionDeEstudio: number,
    comisionPorActivacion: number,

    //Gastos Periodicos

    comisionPeriodica: number,
    portes: number,
    gastosAdministracion: number,
    seguroDesgravamen: number,
    seguroRiesgo: number,
    //COK
    cok: number,

    activo: boolean,
    moneda: string
}
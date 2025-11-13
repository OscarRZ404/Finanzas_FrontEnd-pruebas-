export interface Plan{
    plan_id: number,
    usuario_id: number,
    propiedad_id: number,

    banco: string,
    tipoTasa: string,
    plazoTasa: string,
    tasaInteres: number,
    precioPropiedad: number,
    cuotaInicial: number,

    plazoPrestamo: number,

    costoNotarial: number,
    costoRegistal: number,
    tasacion: number,
    comisionDeEstudio: number,
    comisionPorActivacion: number,
    comisionPeriodica: number,
    portes: number,
    gastosAdministracion: number,
    seguroDesgravamen: number,
    seguroRiesgo: number,

    cok: number
}
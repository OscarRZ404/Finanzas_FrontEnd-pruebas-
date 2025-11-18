export interface Plan{
    //Info Plan
    plan_id: number,
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
    cuotaInicial: number,

    plazoPrestamo: number,

    //Gastos Iniciales

    costoNotarial: number,
    costoRegistal: number,
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
    cok: number
}
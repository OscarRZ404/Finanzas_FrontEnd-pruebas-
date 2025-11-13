export interface Cuota{
    cuota_id: number,
    propiedad_id: number,
    usuario_id: number,

    nCuota: number,

    tasaInteres: number,
    tem: number,
    saldoInicial: number,
    interes: number,
    cuota: number,
    amortizacion: number,
    seguroDesgravamen: number,
    seguroRiesgo: number,
    comision: number,
    portes: number,
    gastosAdministrativos: number,
    saldoFinal: number,
    flujo: number,
}
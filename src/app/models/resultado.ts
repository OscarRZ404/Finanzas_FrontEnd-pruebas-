export interface Resultado{
    resultado_id: number,
    plan_id: number,
    
    saldoFinanciado: number,
    montoPrestamo: number,
    cuotasAnuales: number,
    totalCuotas: number,
    seguroDesgravamenAnual: number,
    seguroRiesgoAnual: number,

    interesTotal: number,
    amortizacionTotal: number,
    seguroDesgravamenTotal: number,
    seguroRiesgoTotal: number,
    comisionesTotales: number,
    portesTotales: number,
    gastosAdministracionTotales: number,

    tasaDescuento: number,
    tir: number,
    tcea: number,
    van: number
}
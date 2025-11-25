import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadService } from '../../services/propiedad-service';
import { PlanService } from '../../services/plan-service';
import { Cuota } from '../../models/cuota';
import { HomeService } from '../../services/home-service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-mostrar-plan-component',
  standalone: false,
  templateUrl: './mostrar-plan-component.html',
  styleUrl: './mostrar-plan-component.css',
})
export class MostrarPlanComponent {
  planId: number = 0;
  cuotas: Cuota[] = [];

  dataSource = new MatTableDataSource<Cuota>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  displayedColumns: string[] = ['nCuota', 'TEM', 'saldoInicial', 'interes', 'cuota', 'amortizacion', 'riesgo', 'desgravamen', 'saldoFinal'];

  menuDesplegado: boolean = true;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private propiedadService: PropiedadService, private router: Router, private planService: PlanService, private homeService: HomeService){

  }

  ngOnInit(){
    this.cargarPlan();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarPlan() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.planId = parseInt(id, 10);

        this.planService.getPlanById(this.planId).subscribe({
          next: (plan) => {
            this.planService.crearCuotas(plan).subscribe({
              next: (cuotas) => {
                this.cuotas = cuotas;
                this.dataSource.data = cuotas;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error("Error al generar las cuotas", err);
              }
            });
          },
          error: (err) => {
            console.error("Error al encontrar el plan", err);
          }
        });
      }
    });
  }

  desplegarMenu(){
    this.menuDesplegado = !this.menuDesplegado
  }

  cambiarVista(vista: string){
    this.homeService.cambiarVista(vista);
    this.router.navigate(['/home']);
  }
}

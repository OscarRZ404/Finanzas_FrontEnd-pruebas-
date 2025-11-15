import { ChangeDetectorRef, Component } from '@angular/core';
import { Propiedad } from '../../models/propiedad';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadService } from '../../services/propiedad-service';
import { HomeService } from '../../services/home-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteresesService } from '../../services/intereses-service';

@Component({
  selector: 'app-crear-plan-component',
  standalone: false,
  templateUrl: './crear-plan-component.html',
  styleUrl: './crear-plan-component.css',
})
export class CrearPlanComponent {
  propiedadId: number = 0;
  propiedad: Propiedad | undefined;

  menuDesplegado: boolean = true;

  planForm!: FormGroup;
  errorMessage: boolean = false;

  tiposInteres: Array<string>;
  bancos: Array<string>;
  periodosInteres: Array<string>;
  capitalizaciones: Array<string>;

  tipoTasaElegida: string = "";

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private propiedadService: PropiedadService, private homeService: HomeService, private router: Router, private fb: FormBuilder, private interesesService: InteresesService){
    this.tiposInteres = interesesService.getTipoTasas();
    this.bancos = interesesService.getBancos();
    this.periodosInteres = interesesService.getPeriodos();
    this.capitalizaciones = interesesService.getCapitalizaciones();
  }

  ngOnInit(){
    this.crearForm();
    this.cargarPropiedad();
    this.cdr.detectChanges();
  }

  crearForm(){
    this.planForm = this.fb.group({
      tipoTasa: ['', Validators.required],
      porcentajeTasa: [0, Validators.required],
      plazoTasa: ['', Validators.required],
      capitalizacion: ['', Validators.required],
      plazo: [10, Validators.required],
      fechaInicio: ['', Validators.required],
      cuotaInicial: [20, Validators.required],
      banco: ['', Validators.required],

      notarial: [0, Validators.required],
      registral: [0, Validators.required],
      tasacion: [0, Validators.required],
      estudio: [0, Validators.required],
      activacion: [0, Validators.required],

      comisionPeriodica: [0, Validators.required],
      portes: [0, Validators.required],
      administracion: [0, Validators.required],
      desgravamen: [0, Validators.required],
      riesgo: [0, Validators.required],

      graciaParcial: [0, Validators.required],
      graciaTotal: [0, Validators.required]
    });
  }

  cargarPropiedad(){
    this.route.paramMap.subscribe(params =>{
      const id = params.get('id');
      if(id !== null){
        this.propiedadId = parseInt(id, 10);
        this.propiedad = this.propiedadService.getPropiedadById(this.propiedadId);
        this.cdr.detectChanges();
      }
    })
  }

  desplegarMenu(){
    this.menuDesplegado = !this.menuDesplegado
  }

  cambiarVista(vista: string){
    this.homeService.cambiarVista(vista);
    this.router.navigate(['/home']);
  }

  cambiarTipoTasa(tipo: string){
    this.tipoTasaElegida = tipo;
  }

  crearPlan(){

  }
}

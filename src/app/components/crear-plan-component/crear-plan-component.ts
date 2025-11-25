import { ChangeDetectorRef, Component } from '@angular/core';
import { Propiedad } from '../../models/propiedad';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadService } from '../../services/propiedad-service';
import { HomeService } from '../../services/home-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteresesService } from '../../services/intereses-service';
import { Plan } from '../../models/plan-pago';
import { UsuarioService } from '../../services/usuario-service';
import { PlanService } from '../../services/plan-service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-crear-plan-component',
  standalone: false,
  templateUrl: './crear-plan-component.html',
  styleUrl: './crear-plan-component.css',
})
export class CrearPlanComponent {
  propiedadId: number = 0;
  propiedad: Propiedad | undefined;

  usuario: Usuario | undefined;

  menuDesplegado: boolean = true;

  planForm!: FormGroup;
  errorMessage: boolean = false;

  tiposInteres: string[];
  bancos: string[];
  periodosInteres: string[];
  capitalizaciones: string[];

  tipoTasaElegida: string = "";

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private propiedadService: PropiedadService, private homeService: HomeService, private router: Router, private fb: FormBuilder, private interesesService: InteresesService, private usuarioService: UsuarioService, private planService: PlanService){
    this.tiposInteres = interesesService.getTipoTasas();
    this.bancos = interesesService.getBancos();
    this.periodosInteres = interesesService.getPeriodos();
    this.capitalizaciones = interesesService.getCapitalizaciones();
  }

  ngOnInit(): void {
    this.crearForm();
    this.cargarPropiedad();
    this.cargarUsuario();
  }

  crearForm(): void {
    this.planForm = this.fb.group({
      tipoTasa: ['Efectiva', Validators.required],
      porcentajeTasa: [4, [Validators.min(7.5), Validators.max(30)]],
      plazoTasa: ['Anual', Validators.required],
      capitalizacion: ['Diaria', Validators.required],
      plazo: [5, [Validators.min(5), Validators.min(25)]],
      fechaInicio: [Date, Validators.required],
      cuotaInicial: [7.5, [Validators.min(7.5), Validators.max(30)]],
      banco: ['BCP', Validators.required],

      notarial: [0, Validators.required],
      registral: [0, Validators.required],
      tasacion: [0, Validators.required],
      estudio: [0, Validators.required],
      activacion: [0, Validators.required],

      comisionPeriodica: [0, Validators.required],
      portes: [0, Validators.required],
      administracion: [0, Validators.required],
      desgravamen: [0.05, [Validators.min(0.05), Validators.max(0.15)]],
      riesgo: [0.02, [Validators.min(0.02), Validators.max(0.10)]],

      graciaParcial: [0, Validators.max(6)],
      graciaTotal: [0, Validators.max(6)]
    });
  }

  cargarPropiedad(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.propiedadId = parseInt(id, 10);
        this.propiedadService.getPropiedadById(this.propiedadId).subscribe({
          next: (propiedad) => {
            this.propiedad = propiedad;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error("Error pe", err);
          }
        });
      }
    });
  }

  cargarUsuario(): void{
    const usuarioId = this.usuarioService.getUsuarioId();
    if(usuarioId !== null){
      this.usuarioService.getUsuarioById(usuarioId).subscribe({
        next: (usuarioBD) => {
          this.usuario = usuarioBD;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error al al obtener el usuario gg", err)
        }
      })
    }
  }

  desplegarMenu(): void {
    this.menuDesplegado = !this.menuDesplegado;
  }

  cambiarVista(vista: string): void {
    this.homeService.cambiarVista(vista);
    this.router.navigate(['/home']);
  }

  cambiarTipoTasa(tipo: string): void {
    this.tipoTasaElegida = tipo;
  }

  crearPlan(){
    //if(this.planForm.invalid){
      //alert("Por favor, complete todos los campos requeridos");
      //return;
    //}
    alert(this.planForm.get('fechaInicio')?.valid);
    const formValues = this.planForm.value;
    const usuarioId = this.usuarioService.getUsuarioId();
    if(this.propiedad !== undefined && usuarioId !== null){
      const plan: Plan = {
        id: 0,
        propiedad_id: this.propiedad.propiedad_id,
        nombrePropiedad: this.propiedad.nombre,
        usuario_id: usuarioId,
        tipoTasa: formValues.tipoTasa,
        tasaInteres: formValues.porcentajeTasa,
        plazoTasa: formValues.plazoTasa,
        capitalizacion: formValues.capitalizacion,
        plazoPrestamo: formValues.plazo,
        cuotaInicial: formValues.cuotaInicial,
        banco: formValues.banco,

        costoNotarial: formValues.notarial,
        costoRegistral: formValues.registral,
        tasacion: formValues.tasacion,
        comisionDeEstudio: formValues.estudio,
        comisionPorActivacion: formValues.activacion,

        comisionPeriodica: formValues.comisionPeriodica,
        portes: formValues.portes,
        gastosAdministracion: formValues.administracion,
        seguroDesgravamen: formValues.desgravamen,
        seguroRiesgo: formValues.riesgo,

        graciaParcial: formValues.graciaParcial,
        graciaTotal: formValues.graciaTotal,

        precioPropiedad: this.propiedad.valor_vivienda, 
        cok: 0.27,
        activo: true,
        moneda: 'Soles',

        bbp: true
      };
      this.planService.crearPlan(usuarioId, this.propiedad.propiedad_id, plan).subscribe({
        next: (response) => {
          window.alert('Plan creado con éxito');
          this.router.navigate(['/planes']);
        },
        error: (err) => {
          console.error('Error al crear plan:', err);
        }
      });
    }
  }

  getRangoPrecio(precioPropiedad: number){
    return this.planService.getRangoPrecio(precioPropiedad)
  }

  getBBP(usuario: Usuario, propiedad: Propiedad){
    return this.planService.calcularBBP(propiedad.valor_vivienda, propiedad.tipo, usuario.edad, usuario.salario, usuario.discapacidad, usuario.desplazado, usuario.migrante);
  }
}

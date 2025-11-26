import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface RegisteredUser {
  nombre: string;
  correo: string;
  password: string;
}

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  correo = '';
  password = '';
  mensaje = '';
  mensajeTipo: 'info' | 'error' | '' = '';

  constructor(private router: Router) {}

  actualizarCorreo(event: Event) {
    this.correo = (event.target as HTMLInputElement).value;
  }

  actualizarPassword(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  intentarIngresar(event: Event) {
    event.preventDefault();
    this.mensaje = '';
    this.mensajeTipo = '';

    const raw = localStorage.getItem('registeredUser');
    if (!raw) {
      this.mensaje = 'No hay un usuario registrado. Regístrate para continuar.';
      this.mensajeTipo = 'error';
      return;
    }

    const usuario: RegisteredUser = JSON.parse(raw);
    const credencialesCorrectas =
      usuario.correo.trim().toLowerCase() === this.correo.trim().toLowerCase() &&
      usuario.password === this.password;

    if (!credencialesCorrectas) {
      this.mensaje = 'Correo o contraseña incorrectos.';
      this.mensajeTipo = 'error';
      return;
    }

    this.mensaje = 'Ingreso exitoso. Redirigiendo...';
    this.mensajeTipo = 'info';
    setTimeout(() => this.router.navigate(['/home']), 500);
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}

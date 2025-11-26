import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-component',
  standalone: false,
  templateUrl: './registro-component.html',
  styleUrls: ['./registro-component.css'],
})
export class RegistroComponent {
  nombre = '';
  correo = '';
  password = '';
  confirmarPassword = '';
  mensaje = '';
  mensajeTipo: 'info' | 'error' | '' = '';

  constructor(private router: Router) {}

  actualizarValor(prop: 'nombre' | 'correo' | 'password' | 'confirmarPassword', event: Event) {
    this[prop] = (event.target as HTMLInputElement).value;
  }

  registrar(event: Event) {
    event.preventDefault();
    this.mensaje = '';
    this.mensajeTipo = '';

    if (!this.nombre.trim() || !this.correo.trim() || !this.password.trim()) {
      this.mensaje = 'Completa todos los campos para continuar.';
      this.mensajeTipo = 'error';
      return;
    }

    if (this.password.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      this.mensajeTipo = 'error';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden.';
      this.mensajeTipo = 'error';
      return;
    }

    localStorage.setItem(
      'registeredUser',
      JSON.stringify({ nombre: this.nombre.trim(), correo: this.correo.trim(), password: this.password })
    );

    this.mensaje = 'usuario registrado';
    this.mensajeTipo = 'info';
    setTimeout(() => this.router.navigate(['/']), 900);
  }

  irALogin() {
    this.router.navigate(['/']);
  }
}

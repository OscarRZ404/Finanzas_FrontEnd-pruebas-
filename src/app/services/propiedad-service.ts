import { Injectable } from '@angular/core';
import { Propiedad } from '../models/propiedad';
import { HttpClient } from '@angular/common/http';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root',
})
export class PropiedadService {

  private baseUrl = 'http://localhost:8080/mivivienda/propiedades';

  constructor(private http: HttpClient){

  }

  getPropiedades(){
    return this.http.get<Propiedad[]>(`${this.baseUrl}/listar`);
  }

  getPropiedadById(propedadId: number){
    return this.http.get<Propiedad>(`${this.baseUrl}/mostrar/${propedadId}`);
  }
}

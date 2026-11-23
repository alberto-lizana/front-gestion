import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { TipoProductoResponse } from '../interfaces/tipo-producto-response';

@Injectable({ providedIn: 'root' })
export class TipoProductoService {
  private readonly http = inject(HttpClient);

  obtenerTodos() {
    return this.http.get<TipoProductoResponse[]>(
      `${environment.apiUrl}/tipo-producto/obtener-todos`
    );
  }
}
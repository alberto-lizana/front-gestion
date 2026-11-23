
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Pagina, PageSpring } from '../interfaces/pagina';
import { ProductoRequest } from '../interfaces/producto-request';
import { ProductoModificarRequest } from '../interfaces/producto-modificar-request';
import { ProductoResponse } from '../interfaces/producto-response';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/producto`;

  obtenerTodos(pagina: number, tamanio: number) {
    const params = new HttpParams()
      .set('page', pagina)
      .set('size', tamanio)
      .set('sort', 'id,asc');

    return this.http
      .get<PageSpring<ProductoResponse>>(`${this.url}/obtener-todos`, { params })
      .pipe(
        map((r): Pagina<ProductoResponse> => ({
          contenido: r.content,
          paginaActual: r.page?.number ?? r.number ?? 0,
          tamanio: r.page?.size ?? r.size ?? tamanio,
          totalElementos: r.page?.totalElements ?? r.totalElements ?? r.content.length,
          totalPaginas: r.page?.totalPages ?? r.totalPages ?? 1,
        }))
      );
  }

  obtenerPorId(id: number) {
    return this.http.get<ProductoResponse>(
      `${this.url}/obtener-${id}`
    );
  }

  crear(producto: ProductoRequest) {
    return this.http.post<ProductoResponse>(
      `${this.url}/crear`,
      producto
    );
  }

  modificar(producto: ProductoModificarRequest) {
    return this.http.put<ProductoResponse>(
      `${this.url}/modificar`,
      producto
    );
  }

  borrar(id: number) {
    return this.http.delete<void>(
      `${this.url}/borrar-${id}`
    );
  }
}

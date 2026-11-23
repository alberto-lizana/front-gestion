import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioRequest } from '../interfaces/usuario-request';
import { UsuarioResponse } from '../interfaces/usuario-response';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);

  crear(usuario: UsuarioRequest) {
    return this.http.post<UsuarioResponse>(`${environment.apiUrl}/usuario/crear`, usuario);
  }

    obtenerPerfil() {
    return this.http.get<UsuarioResponse>(
        `${environment.apiUrl}/usuario/perfil`
    );
    }
}

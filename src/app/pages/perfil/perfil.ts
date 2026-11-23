import { Component, OnInit, inject, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioResponse } from '../../interfaces/usuario-response';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.html'
})
export class Perfil implements OnInit {

  private readonly usuarioService = inject(UsuarioService);

  usuario = signal<UsuarioResponse | null>(null);

  ngOnInit(): void {
    this.usuarioService.obtenerPerfil().subscribe({
      next: (data) => {
        this.usuario.set(data);
      },
      error: (error) => {
        console.error('Error al obtener perfil:', error);
      }
    });
  }
}
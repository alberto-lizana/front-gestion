import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROLES } from '../../interfaces/roles';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout {
  readonly auth = inject(AuthService);
  readonly menuAbierto = signal(false);

  readonly puedeVerProductos = computed(() =>
    this.auth.hasAnyRole(ROLES.ADMIN, ROLES.GESTION_INVENTARIO, ROLES.USUARIO)
  );
}
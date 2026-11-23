import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard-guard';
import { ROLES } from './interfaces/roles';
import { Inicio } from './pages/inicio/inicio';
import { Login } from './pages/login/login';
import { Productos } from './pages/productos/productos';
import { Registro } from './pages/registro/registro';
import { Perfil } from './pages/perfil/perfil';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },

      { path: 'inicio', component: Inicio },

      {
        path: 'productos',
        component: Productos,
        canActivate: [roleGuard(
          ROLES.ADMIN,
          ROLES.GESTION_INVENTARIO,
          ROLES.USUARIO
        )],
      },

      { path: 'perfil', component: Perfil },
    ],
  },

  { path: '**', redirectTo: '' },
];
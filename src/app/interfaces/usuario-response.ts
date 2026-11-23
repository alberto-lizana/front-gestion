import { UsuarioRolResponse } from "./usuario-rol-response";

export interface UsuarioResponse {
  id: number;
  username: string;
  nombre: string;
  appat: string;
  email: string;
  isActive: boolean;
  asignacionesRoles: UsuarioRolResponse[];
}
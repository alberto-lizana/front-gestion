import { TipoProductoResponse } from "./tipo-producto-response";

export interface ProductoResponse {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  tipoProducto?: TipoProductoResponse;
  fechaCreacion: string;
  fechaActualizacion: string;
}
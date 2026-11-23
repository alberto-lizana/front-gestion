export interface Columna {
  campo: string; 
  titulo: string;
  tipo?: 'texto' | 'moneda' | 'fecha';
  alinear?: 'start' | 'end';
}
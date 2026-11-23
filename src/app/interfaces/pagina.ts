export interface Pagina<T> {
  contenido: T[];
  paginaActual: number; // empieza en 0
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
}

export interface PageSpring<T> {
  content: T[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  page?: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}
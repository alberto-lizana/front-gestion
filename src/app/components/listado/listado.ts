import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Accion } from '../../interfaces/accion';
import { Columna } from '../../interfaces/columna';

@Component({
  selector: 'app-listado',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './listado.html',
})
export class Listado<T extends object> {
  readonly columnas = input.required<Columna[]>();
  readonly datos = input.required<T[]>();
  readonly acciones = input<Accion[]>([]);
  readonly cargando = input(false);

  readonly paginaActual = input(0);
  readonly totalPaginas = input(1);
  readonly totalElementos = input(0);

  readonly cambiarPagina = output<number>();
  readonly ejecutarAccion = output<{ accionId: string; fila: T }>();

  valor(fila: T, columna: Columna): string | number | null {
    const resultado = columna.campo
      .split('.')
      .reduce<unknown>(
        (obj, clave) => (obj as Record<string, unknown> | null | undefined)?.[clave],
        fila
      );
    return (resultado ?? null) as string | number | null;
  }

  ejecutar(accionId: string, fila: T): void {
    this.ejecutarAccion.emit({ accionId, fila });
  }

  anterior(): void {
    this.cambiarPagina.emit(this.paginaActual() - 1);
  }

  siguiente(): void {
    this.cambiarPagina.emit(this.paginaActual() + 1);
  }
}
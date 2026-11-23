
import { Component, computed, inject, signal } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';

import { ROLES } from '../../interfaces/roles';
import { Columna } from '../../interfaces/columna';
import { Accion } from '../../interfaces/accion';
import { Pagina } from '../../interfaces/pagina';
import { ProductoResponse } from '../../interfaces/producto-response';

import { Listado } from '../../components/listado/listado';
import { ProductoModal } from '../../components/producto-modal/producto-modal';

@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.html',
  imports: [Listado, ProductoModal],
})
export class Productos {
  private readonly auth = inject(AuthService);
  private readonly productoService = inject(ProductoService);

  readonly puedeGestionar = computed(() =>
    this.auth.hasAnyRole(ROLES.ADMIN, ROLES.GESTION_INVENTARIO)
  );

  readonly mostrarListado = signal(false);
  readonly mostrarModal = signal(false);
  readonly productoSeleccionado = signal<ProductoResponse | null>(null);

  readonly tamaniosDisponibles = [5, 10, 20, 50];
  readonly tamanio = signal(10);

  readonly pagina = signal<Pagina<ProductoResponse> | null>(null);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly columnas: Columna[] = [
    { campo: 'id', titulo: 'ID' },
    { campo: 'nombre', titulo: 'Nombre' },
    { campo: 'precio', titulo: 'Precio', tipo: 'moneda', alinear: 'end' },
    { campo: 'stock', titulo: 'Stock', alinear: 'end' },
    { campo: 'tipoProducto.nombre', titulo: 'Tipo' },
    { campo: 'fechaCreacion', titulo: 'Fecha de creación', tipo: 'fecha' },
  ];

  readonly acciones: Accion[] = [
    {
      id: 'modificar',
      titulo: 'Editar producto',
      icono: 'bi bi-pencil',
      clase: 'btn-outline-primary',
    },
    {
      id: 'borrar',
      titulo: 'Eliminar producto',
      icono: 'bi bi-trash',
      clase: 'btn-outline-danger',
    },
  ];

  obtenerTodos(): void {
    this.mostrarListado.set(true);
    this.cargar(0);
  }

  ocultarListado(): void {
    this.mostrarListado.set(false);
    this.pagina.set(null);
  }

  cargar(numeroPagina: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.productoService.obtenerTodos(numeroPagina, this.tamanio()).subscribe({
      next: (respuesta) => {
        this.pagina.set(respuesta);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos.');
        this.cargando.set(false);
      },
    });
  }

  cambiarTamanio(valor: string): void {
    const nuevoTamanio = Number(valor);

    if (!this.tamaniosDisponibles.includes(nuevoTamanio)) return;

    this.tamanio.set(nuevoTamanio);
    this.cargar(0);
  }

  ejecutarAccion(evento: { accionId: string; fila: ProductoResponse }): void {
    if (evento.accionId === 'modificar') {
      this.productoSeleccionado.set(evento.fila);
      this.mostrarModal.set(true);
      return;
    }

    if (evento.accionId === 'borrar') {
      this.eliminarProducto(evento.fila);
    }
  }

  eliminarProducto(producto: ProductoResponse): void {
    const confirmar = confirm(
      `¿Estás seguro de que deseas eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) return;

    this.error.set(null);

    this.productoService.borrar(producto.id).subscribe({
      next: () => {
        const paginaActual = this.pagina()?.paginaActual ?? 0;
        const totalElementos = this.pagina()?.totalElementos ?? 0;

        const ultimaPagina = Math.max(
          0,
          Math.ceil((totalElementos - 1) / this.tamanio()) - 1
        );

        this.cargar(Math.min(paginaActual, ultimaPagina));
      },
      error: (e) => {
        this.error.set(
          e.status === 0
            ? 'No se pudo conectar con el servidor.'
            : e.status === 403
              ? 'No tienes permiso para eliminar productos.'
              : e.error?.mensaje ?? 'No se pudo eliminar el producto.'
        );
      },
    });
  }

  abrirCrear(): void {
    this.productoSeleccionado.set(null);
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.productoSeleccionado.set(null);
  }

  alGuardar(): void {
    this.cerrarModal();

    if (this.mostrarListado()) {
      this.cargar(this.pagina()?.paginaActual ?? 0);
    }
  }
}

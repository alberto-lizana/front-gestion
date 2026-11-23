
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TipoProductoResponse } from '../../interfaces/tipo-producto-response';
import { ProductoResponse } from '../../interfaces/producto-response';

import { ProductoService } from '../../services/producto.service';
import { TipoProductoService } from '../../services/tipo-producto.service.service';

@Component({
  selector: 'app-producto-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './producto-modal.html',
})
export class ProductoModal {

  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);
  private readonly tipoProductoService = inject(TipoProductoService);

  readonly producto = input<ProductoResponse | null>(null);

  readonly guardado = output<void>();
  readonly cancelado = output<void>();

  readonly tipos = signal<TipoProductoResponse[]>([]);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(125)
    ]],
    precio: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1)
    ]),
    stock: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(999)
    ]),
    nombreTipoProducto: ['', Validators.required]
  });

  constructor() {
    this.cargarTiposProducto();

    effect(() => {
      const producto = this.producto();

      if (producto) {
        this.form.patchValue({
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock,
          nombreTipoProducto: producto.tipoProducto?.nombre ?? ''
        });
      } else {
        this.form.reset({
          nombre: '',
          precio: null,
          stock: null,
          nombreTipoProducto: ''
        });
      }

      this.error.set(null);
    });
  }

  cargarTiposProducto(): void {
    this.tipoProductoService.obtenerTodos().subscribe({
      next: (tipos) => this.tipos.set(tipos),
      error: () => this.error.set('No se pudieron cargar los tipos de producto.')
    });
  }

  invalido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const valores = this.form.getRawValue();

    const datos = {
      nombre: valores.nombre!.trim(),
      precio: valores.precio!,
      stock: valores.stock!,
      nombreTipoProducto: valores.nombreTipoProducto!
    };

    const producto = this.producto();

    if (producto) {
      this.modificarProducto(producto.id, datos);
    } else {
      this.crearProducto(datos);
    }
  }

  private crearProducto(datos: {
    nombre: string;
    precio: number;
    stock: number;
    nombreTipoProducto: string;
  }): void {
    this.productoService.crear(datos).subscribe({
      next: () => this.finalizarGuardado(),
      error: (e: HttpErrorResponse) => this.manejarError(e)
    });
  }

  private modificarProducto(
    id: number,
    datos: {
      nombre: string;
      precio: number;
      stock: number;
      nombreTipoProducto: string;
    }
  ): void {
    this.productoService.modificar({
      id,
      ...datos
    }).subscribe({
      next: () => this.finalizarGuardado(),
      error: (e: HttpErrorResponse) => this.manejarError(e)
    });
  }

  private finalizarGuardado(): void {
    this.guardando.set(false);
    this.guardado.emit();
  }

  private manejarError(e: HttpErrorResponse): void {
    this.guardando.set(false);

    this.error.set(
      e.status === 0
        ? 'No se pudo conectar con el servidor.'
        : e.status === 403
          ? 'No tienes permiso para realizar esta operación.'
          : e.error?.errores?.join(' ')
            ?? e.error?.mensaje
            ?? 'No se pudo guardar el producto.'
    );
  }
}

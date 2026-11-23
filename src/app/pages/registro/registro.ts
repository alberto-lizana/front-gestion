import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

function passwordsIguales(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmar = control.get('confirmar')?.value;
  return password === confirmar ? null : { noCoinciden: true };
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly exito = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      appat: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(250)]],
      username: ['', [Validators.required, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required],
    },
    { validators: passwordsIguales }
  );

  invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set(null);

    const { confirmar, ...datos } = this.form.getRawValue();

    this.usuarioService.crear(datos).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exito.set(true);
      },
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          e.status === 0
            ? 'No se pudo conectar con el servidor.'
            : e.error?.errores?.join(' ') ?? e.error?.mensaje ?? 'No se pudo crear la cuenta.'
        );
      },
    });
  }
}
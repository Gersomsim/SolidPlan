import { Injectable } from '@angular/core';

export type ErrorMessageFn = (params: Record<string, unknown>) => string;
export type ErrorMessages = Record<string, string | ErrorMessageFn>;

const DEFAULT_MESSAGES: ErrorMessages = {
  required:  'Este campo es obligatorio',
  minlength: (p) => `Mínimo ${(p as { requiredLength: number }).requiredLength} caracteres`,
  maxlength: (p) => `Máximo ${(p as { requiredLength: number }).requiredLength} caracteres`,
  email:     'Correo electrónico inválido',
  min:       (p) => `Valor mínimo: ${(p as { min: number }).min}`,
  max:       (p) => `Valor máximo: ${(p as { max: number }).max}`,
  pattern:   'Formato inválido',
};

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {
  private messages: ErrorMessages = { ...DEFAULT_MESSAGES };

  configure(overrides: Partial<ErrorMessages>): void {
    this.messages = { ...this.messages, ...overrides };
  }

  getMessage(
    key: string,
    params: Record<string, unknown>,
    overrides?: Partial<ErrorMessages>,
  ): string | null {
    const merged = overrides ? { ...this.messages, ...overrides } : this.messages;
    const entry = merged[key];
    if (entry == null) return null;
    if (typeof entry === 'function') return entry(params);
    return entry;
  }
}

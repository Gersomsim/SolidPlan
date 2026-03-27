import { TestBed } from '@angular/core/testing';
import { ErrorMessageService } from './error-message.service';

describe('ErrorMessageService', () => {
  let service: ErrorMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ErrorMessageService] });
    service = TestBed.inject(ErrorMessageService);
  });

  it('returns default required message', () => {
    expect(service.getMessage('required', {})).toBe('Este campo es obligatorio');
  });

  it('returns minlength message with interpolated length', () => {
    expect(service.getMessage('minlength', { requiredLength: 5 }))
      .toBe('Mínimo 5 caracteres');
  });

  it('returns maxlength message with interpolated length', () => {
    expect(service.getMessage('maxlength', { requiredLength: 100 }))
      .toBe('Máximo 100 caracteres');
  });

  it('allows overriding a message at instance level', () => {
    service.configure({ required: 'Campo obligatorio' });
    expect(service.getMessage('required', {})).toBe('Campo obligatorio');
  });

  it('merges per-call overrides with global defaults', () => {
    const msg = service.getMessage('required', {}, { required: 'Selecciona un estado' });
    expect(msg).toBe('Selecciona un estado');
  });

  it('returns null for unknown error key', () => {
    expect(service.getMessage('customValidator', {})).toBeNull();
  });
});

import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: prefersDark && query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    mockMatchMedia(false);
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [ThemeService] });
    service = TestBed.inject(ThemeService);
  });

  it('defaults to light when no localStorage and no OS dark preference', () => {
    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('reads theme from localStorage on init', () => {
    localStorage.setItem('sp-theme', 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [ThemeService] });
    const s = TestBed.inject(ThemeService);
    expect(s.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles between light and dark', () => {
    service.toggle();
    expect(service.theme()).toBe('dark');
    service.toggle();
    expect(service.theme()).toBe('light');
  });

  it('setTheme("dark") adds dark class and persists to localStorage', () => {
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('sp-theme')).toBe('dark');
  });

  it('setTheme("system") removes localStorage entry', () => {
    localStorage.setItem('sp-theme', 'dark');
    service.setTheme('system');
    expect(localStorage.getItem('sp-theme')).toBeNull();
  });
});

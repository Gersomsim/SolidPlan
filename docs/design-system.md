# Design System — Solid Plan
**Construction Project Manager**

> Referencia completa del design system adaptado a Tailwind v4.
> El archivo CSS base con los tokens está en `docs/design-system.css`.

---

## Personalidad del producto

**Palabras clave:** Control • Precisión • Seguridad • Progreso • Estructura

El producto debe sentirse como: software empresarial, robusto, técnico, enfocado a planeación y trazabilidad. Usable en oficina y en obra.

---

## Colores

### Brand palette

| Uso | Nombre | Hex | Clase Tailwind |
|-----|--------|-----|----------------|
| Primary | Azul ingeniería | `#1E3A5F` | `bg-primary` / `text-primary` |
| Primary hover | — | `#2C5282` | `bg-primary-hover` |
| Secondary | Gris acero | `#4A5568` | `bg-secondary` / `text-secondary` |
| Secondary bg | — | `#EDF2F7` | `bg-secondary-bg` |
| Accent | Naranja obra | `#F59E0B` | `bg-accent` / `text-accent` |
| Accent hover | — | `#D97706` | `bg-accent-hover` |
| Success | Verde progreso | `#2F855A` | `bg-success` / `text-success` |
| Danger | Rojo alerta | `#C53030` | `bg-danger` / `text-danger` |

### Neutral palette

| Uso | Nombre | Hex | Clase Tailwind |
|-----|--------|-----|----------------|
| Background | Gris muy claro | `#F7FAFC` | `bg-background` |
| Surface | Blanco | `#FFFFFF` | `bg-surface` |
| Border | Gris suave | `#E2E8F0` | `border-border` |
| Hover fila | — | `#F1F5F9` | `bg-hover-row` |
| Text primary | Gris oscuro | `#1A202C` | `text-text-primary` |
| Text secondary | Gris medio | `#718096` | `text-text-secondary` |

### Dark mode

| Uso | Hex | Clase Tailwind |
|-----|-----|----------------|
| Background | `#1A202C` | `dark:bg-dark-background` |
| Surface | `#2D3748` | `dark:bg-dark-surface` |
| Texto | `#E2E8F0` | `dark:text-dark-text` |
| Primary | `#63B3ED` | `dark:text-primary-light` |

---

## Tipografía

**Fuente única:** `Inter` — nunca usar fuentes decorativas.

```html
<!-- En el HTML global -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Elemento | Tamaño | Peso | Clases Tailwind |
|----------|--------|------|-----------------|
| H1 | 32px | 700 | `text-h1 font-bold` |
| H2 | 24px | 600 | `text-h2 font-semibold` |
| H3 | 20px | 600 | `text-h3 font-semibold` |
| H4 | 18px | 600 | `text-h4 font-semibold` |
| Body | 16px | 400 | `text-body font-normal` |
| Small | 14px | 400 | `text-small font-normal` |
| Label | 12px | 500 | `text-label font-medium` |

---

## Border radius

| Uso | Valor | Clase Tailwind |
|-----|-------|----------------|
| Inputs y botones | `10px` | `rounded-input` |
| Global (default) | `12px` | `rounded-default` |
| Cards | `16px` | `rounded-card` |
| Badges / pills | `9999px` | `rounded-badge` |

> Nunca usar esquinas cuadradas duras (`rounded-none`).

---

## Sombras

| Uso | Valor | Clase Tailwind |
|-----|-------|----------------|
| Card en reposo | `0 2px 8px rgba(0,0,0,0.08)` | `shadow-card` |
| Card en hover | `0 6px 16px rgba(0,0,0,0.12)` | `shadow-hover` |

> Nunca usar sombras duras negras.

---

## Botones

### Primary button
```html
<button class="bg-primary hover:bg-primary-hover text-white font-semibold
               px-5 py-2.5 rounded-input shadow-card
               transition-colors duration-200">
  Crear proyecto
</button>
```
**Uso:** acciones principales — Crear proyecto, Guardar, Generar reporte.

### Secondary button
```html
<button class="bg-secondary-bg hover:bg-border text-text-primary font-medium
               px-5 py-2.5 rounded-input
               transition-colors duration-200">
  Cancelar
</button>
```
**Uso:** acciones neutras, cancelar, volver.

### Action button (obra — Naranja)
```html
<button class="bg-accent hover:bg-accent-hover text-white font-semibold
               px-5 py-2.5 rounded-input shadow-card
               transition-colors duration-200">
  Registrar avance
</button>
```
**Uso exclusivo:** Iniciar tarea, Marcar progreso, Registrar avance, Subir evidencia.

---

## Cards

El elemento dominante del UI. Toda entidad del sistema (proyecto, tarea, reporte, equipo) se representa como card.

```html
<div class="bg-surface border border-border rounded-card p-6 shadow-card
            hover:shadow-hover transition-shadow duration-200">
  <!-- contenido -->
</div>
```

| Propiedad | Valor |
|-----------|-------|
| Fondo | `bg-surface` (`#FFFFFF`) |
| Borde | `border border-border` |
| Radio | `rounded-card` (16px) |
| Padding | `p-6` (24px) |
| Sombra reposo | `shadow-card` |
| Sombra hover | `shadow-hover` |

---

## Tablas

El producto vive en tablas. Sensación: Excel moderno / ERP ligero.

```html
<table class="w-full">
  <thead>
    <tr class="bg-background border-b border-border">
      <th class="text-label font-semibold text-text-secondary uppercase
                 px-4 py-3 text-left">
        Proyecto
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-border hover:bg-hover-row
               transition-colors duration-150 min-h-[48px]">
      <td class="px-4 py-3 text-body text-text-primary">...</td>
    </tr>
  </tbody>
</table>
```

| Regla | Valor |
|-------|-------|
| Altura mínima de fila | `48px` — usar `min-h-[48px]` o `py-3` |
| Hover fila | `hover:bg-hover-row` |
| Header fondo | `bg-background` |
| Header texto | `text-label font-semibold text-text-secondary uppercase` |

---

## Badges de estado

Siempre en **MAYÚSCULAS**. Forma pill.

```html
<!-- Planificación -->
<span class="bg-status-planning/15 text-status-planning text-label font-medium
             uppercase px-3 py-1 rounded-badge">
  Planificación
</span>

<!-- En progreso -->
<span class="bg-accent/15 text-accent text-label font-medium
             uppercase px-3 py-1 rounded-badge">
  En Progreso
</span>

<!-- Completado -->
<span class="bg-success/15 text-success text-label font-medium
             uppercase px-3 py-1 rounded-badge">
  Completado
</span>

<!-- Retrasado -->
<span class="bg-danger/15 text-danger text-label font-medium
             uppercase px-3 py-1 rounded-badge">
  Retrasado
</span>

<!-- En revisión -->
<span class="bg-primary/15 text-primary text-label font-medium
             uppercase px-3 py-1 rounded-badge">
  En Revisión
</span>
```

| Estado | Color base | Clase texto |
|--------|-----------|-------------|
| Planificación | Gris | `text-status-planning` |
| En progreso | Naranja | `text-accent` |
| Completado | Verde | `text-success` |
| Retrasado | Rojo | `text-danger` |
| En revisión | Azul | `text-primary` |

---

## Iconografía

**Estilo:** outline, grosor medio — nunca filled pesado.

**Librerías (en orden de preferencia):**
1. Heroicons
2. Lucide
3. Material Symbols (outlined)

| Entidad | Icono |
|---------|-------|
| Proyectos | `folder` |
| Tareas | `clipboard` |
| Equipo | `users` |
| Cronograma | `calendar` |
| Evidencias | `camera` |
| Mantenimiento | `wrench` |
| Reportes | `bar-chart` |

---

## Layout

### Sidebar izquierda (fija)
```html
<aside class="bg-primary w-64 min-h-screen fixed left-0 top-0
              flex flex-col">
  <!-- nav items -->
</aside>
```

Nav items:
```html
<!-- Inactivo -->
<a class="flex items-center gap-3 px-4 py-3 text-white/80
          hover:bg-sidebar-hover rounded-default
          transition-colors duration-150">
  <!-- icono + label -->
</a>

<!-- Activo -->
<a class="flex items-center gap-3 px-4 py-3 text-white
          bg-sidebar-active rounded-default font-medium">
  <!-- icono + label -->
</a>
```

### Topbar blanca
```html
<header class="bg-surface border-b border-border h-16
               flex items-center justify-between px-6
               shadow-card sticky top-0 z-10">
  <!-- buscador global | notificaciones | perfil -->
</header>
```

### Contenido principal
```html
<main class="ml-64 pt-16 min-h-screen bg-background p-6">
  <!-- contenido -->
</main>
```

---

## Cómo usar el CSS base

El archivo `docs/design-system.css` contiene el bloque `@theme` con todos los tokens.
Importarlo en el CSS global del frontend:

```css
/* styles.css del proyecto Angular */
@import "../../docs/design-system.css";
/* o una vez instalado tailwind en el app: */
@import "tailwindcss";
@import "./design-system-tokens.css"; /* copia local de los tokens */
```

---

## Checklist de consistencia

Antes de entregar cualquier componente, verificar:

- [ ] Solo se usa la fuente **Inter**
- [ ] Colores vienen de los tokens (no valores hex hardcodeados)
- [ ] Border radius respeta la guía (nunca `rounded-none`)
- [ ] Sombras son `shadow-card` o `shadow-hover` (nunca sombra dura)
- [ ] Botones naranja solo para acciones de campo
- [ ] Badges siempre en pill shape y texto uppercase
- [ ] Filas de tabla mínimo 48px de altura
- [ ] Dark mode considera las variables `dark-*`

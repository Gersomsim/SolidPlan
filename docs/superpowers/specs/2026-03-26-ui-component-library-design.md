# UI Component Library — Design Spec
**Solid Plan · libs/ui**
Date: 2026-03-26

---

## Context

Angular 21.2.6 standalone component library (`@org/ui`). All components consume the Tailwind v4 design system defined in `docs/design-system.css` and `docs/design-system.md`. Components must support light and dark mode from day one.

---

## Global Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component prefix | `lib-` | Nx default, Angular convention |
| Form component API | Hybrid (inputs + optional slots) | Simple for 90% of cases, flexible for edge cases |
| Table API | Hybrid (column config array + `ng-template` per key) | Column types handled by config, custom cells via slots |
| Card API | Hybrid (title/subtitle inputs + optional named slots) | Clean defaults, fully overridable |
| Error messages | Global `ErrorMessageService` | Configure once, consistent across all forms |
| Dark mode | Both: OS preference + localStorage toggle | Respects user's OS, overridable via app toggle |
| Component style | Standalone, signals-compatible | Angular 21 best practice |
| CDK | `@angular/cdk/overlay` for dropdown positioning | No external dependencies for positioning |

---

## Architecture

```
libs/ui/src/
  lib/
    components/
      forms/
        input/          lib-input
        textarea/       lib-textarea
        button/         lib-button
        checkbox/       lib-checkbox
        radio-group/    lib-radio-group + lib-radio
        select/         lib-select
        file-upload/    lib-file-upload
      display/
        card/           lib-card
        table/          lib-table
        badge/          lib-badge
        dropdown/       lib-dropdown
        tabs/           lib-tabs + lib-tab
        link/           lib-link
      navigation/
        breadcrumbs/    lib-breadcrumbs
        stepper/        lib-stepper
        timeline/       lib-timeline
    services/
      error-message.service.ts
      theme.service.ts
    directives/
      (slot directives: libCardPrefix, libCell, libCardFooter, etc.)
    models/
      table-column.model.ts
      dropdown-item.model.ts
      select-option.model.ts
      step-item.model.ts
      timeline-item.model.ts
      breadcrumb-item.model.ts
  index.ts
```

All components, directives, services and models are exported from `src/index.ts`.

---

## Services

### ErrorMessageService

Provides default validation error messages. Configured once at app bootstrap, used by all form components automatically.

```typescript
interface ErrorMessages {
  required:   string;
  minlength:  string | ((params: { requiredLength: number }) => string);
  maxlength:  string | ((params: { requiredLength: number }) => string);
  email:      string;
  min:        string | ((params: { min: number }) => string);
  max:        string | ((params: { max: number }) => string);
  pattern:    string;
  [key: string]: string | Function; // extensible for custom validators
}
```

Default messages (Spanish):
- `required` → `'Este campo es obligatorio'`
- `minlength` → `'Mínimo {requiredLength} caracteres'`
- `maxlength` → `'Máximo {requiredLength} caracteres'`
- `email` → `'Correo electrónico inválido'`
- `min` → `'Valor mínimo: {min}'`
- `max` → `'Valor máximo: {max}'`
- `pattern` → `'Formato inválido'`

Per-component override: `[errors]="{ required: 'Selecciona un estado' }"` — merges with global defaults.

### ThemeService

Manages light/dark mode.

```typescript
class ThemeService {
  theme: Signal<'light' | 'dark'>;

  // On init: reads localStorage('sp-theme').
  // Falls back to window.matchMedia('prefers-color-scheme: dark').
  // Applies/removes 'dark' class on <html>.

  toggle(): void;
  setTheme(theme: 'light' | 'dark' | 'system'): void;
  // 'system' clears localStorage and re-reads OS preference
}
```

Tailwind v4 dark mode configured via `class` strategy (`.dark` on `<html>`).

---

## Form Components

All form components implement `ControlValueAccessor` and are compatible with both `FormControl` (reactive) and `ngModel` (template-driven). All display errors from `ErrorMessageService` unless overridden via `[errors]`.

Error display rule: errors show only when the control is `touched` OR the parent form has been submitted.

### lib-input

```typescript
// Inputs
label:       string
hint:        string
placeholder: string
type:        'text' | 'email' | 'password' | 'number' | 'tel' | 'url'  // default: 'text'
disabled:    boolean
readonly:    boolean
prefix:      string   // text/icon name shown inside input left side
suffix:      string   // text/icon name shown inside input right side
errors:      Record<string, string>   // per-component error overrides

// Slots
libPrefix    // ng-template — overrides prefix with arbitrary HTML
libSuffix    // ng-template — overrides suffix with arbitrary HTML
```

Visual states: default, focus (primary border), error (danger border + message), disabled (muted), readonly.

### lib-textarea

```typescript
// Inputs
label:       string
hint:        string
placeholder: string
rows:        number     // default: 4
disabled:    boolean
readonly:    boolean
autoResize:  boolean    // grows with content, default: false
maxRows:     number     // max rows when autoResize: true
errors:      Record<string, string>
```

### lib-button

Not a CVA — a styled button with design system variants.

```typescript
// Inputs
variant:   'primary' | 'secondary' | 'action' | 'ghost' | 'danger'  // default: 'primary'
size:      'sm' | 'md' | 'lg'    // default: 'md'
type:      'button' | 'submit' | 'reset'  // default: 'button'
loading:   boolean   // shows spinner, disables interaction
disabled:  boolean
iconLeft:  string    // icon name (Heroicons/Lucide)
iconRight: string

// Slot: default ng-content → button label
```

Variant mapping to design system:
- `primary` → `bg-primary hover:bg-primary-hover text-white`
- `secondary` → `bg-secondary-bg text-text-primary`
- `action` → `bg-accent hover:bg-accent-hover text-white` — field/obra actions only
- `ghost` → transparent, border on hover
- `danger` → `bg-danger text-white`

### lib-checkbox

```typescript
// CVA value: boolean
// Inputs
label:    string
hint:     string
disabled: boolean
errors:   Record<string, string>
```

### lib-radio-group + lib-radio

```typescript
// lib-radio-group (CVA value: any)
// Inputs
label:       string
hint:        string
orientation: 'horizontal' | 'vertical'  // default: 'vertical'
disabled:    boolean
errors:      Record<string, string>

// lib-radio (child, not CVA — inherits from group)
// Inputs
value:    any     // the value this radio represents
label:    string
disabled: boolean
```

### lib-select

```typescript
interface SelectOption {
  value:     any;
  label:     string;
  disabled?: boolean;
  group?:    string;  // option group label
}

// CVA value: any | any[] (when multiple)
// Inputs
label:       string
hint:        string
placeholder: string
options:     SelectOption[]
multiple:    boolean    // default: false
disabled:    boolean
errors:      Record<string, string>

// Slots
libOption    // ng-template let-option — custom render per option
```

### lib-file-upload

```typescript
// CVA value: File | File[]
// Inputs
label:      string
hint:       string
accept:     string    // e.g. 'image/*,.pdf'
multiple:   boolean   // default: false
maxSizeMB:  number    // auto-validates file size
disabled:   boolean
showPreview: boolean  // shows image thumbnail for image/* files
errors:     Record<string, string>

// Slots
libFilePreview  // ng-template let-file — custom file preview card

// Auto errors (beyond Angular validators):
// filetype   → 'Tipo de archivo no permitido'
// filesize   → 'El archivo excede {maxSizeMB}MB'
```

Drag-and-drop zone included. Clicking the zone opens the native file picker.

---

## Display Components

### lib-card

```typescript
// Inputs
title:    string
subtitle: string
loading:  boolean   // shows skeleton overlay
padding:  'none' | 'sm' | 'md' | 'lg'   // default: 'md' (24px)
bordered: boolean   // default: true
elevated: boolean   // default: true (shadow-card + hover:shadow-hover)

// Slots
libCardPrefix    // ng-template — icon/avatar before title
libCardActions   // ng-template — top-right action buttons
libCardFooter    // ng-template — bottom bar (border-top, bg-background)
libCardHeader    // ng-template — complete header override (replaces title/subtitle/prefix/actions)
(default)        // body content
```

### lib-table

```typescript
interface TableColumn {
  key:       string;
  label:     string;
  sortable?: boolean;
  align?:    'left' | 'center' | 'right';  // default: 'left'
  width?:    string;   // e.g. '120px', '20%'
}

// Inputs
columns:      TableColumn[]
data:         T[]
loading:      boolean   // shows skeleton rows
emptyMessage: string    // default: 'No hay registros'
selectable:   boolean   // adds checkbox column, default: false
striped:      boolean   // alternating row bg, default: false
stickyHeader: boolean   // default: false

// Outputs
sortChange:      EventEmitter<{ key: string; direction: 'asc' | 'desc' | null }>
rowClick:        EventEmitter<T>
selectionChange: EventEmitter<T[]>

// Slots
libCell="key"    // ng-template let-row — custom cell render for that column key
libEmptyState    // ng-template — override empty state
libLoading       // ng-template — override skeleton loader
```

Pagination is intentionally outside the component — the parent controls data slice and passes it in. This keeps the table stateless and reusable with any pagination strategy (API-driven, client-side, infinite scroll).

### lib-badge

```typescript
// Inputs
variant: 'planning' | 'in-progress' | 'completed' | 'delayed' | 'review' | 'custom'
label:   string
size:    'sm' | 'md'   // default: 'md'
color:   string        // only when variant='custom', hex color

// Variant → design system color mapping:
// planning    → text-status-planning  / bg-status-planning/15
// in-progress → text-accent           / bg-accent/15
// completed   → text-success          / bg-success/15
// delayed     → text-danger           / bg-danger/15
// review      → text-primary          / bg-primary/15
```

Text is always uppercase (CSS `text-transform: uppercase`), pill shape (`rounded-badge`).

### lib-dropdown

```typescript
interface DropdownItem {
  label:    string;
  icon?:    string;
  action?:  string;    // identifier emitted on itemClick
  disabled?: boolean;
  divider?: boolean;   // renders a separator line instead of item
}

// Inputs
items:     DropdownItem[]
placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'  // default: 'bottom-end'
trigger:   'click' | 'hover'  // default: 'click'
disabled:  boolean

// Outputs
itemClick: EventEmitter<DropdownItem>

// Slots
(default)        // trigger element (the button/element that opens the dropdown)
libDropdownItem  // ng-template let-item — custom item render
```

Uses `@angular/cdk/overlay` for floating positioning. Closes on outside click and Escape key.

### lib-tabs

```typescript
// lib-tabs
// Inputs
orientation: 'horizontal' | 'vertical'  // default: 'horizontal'
activeTab:   string   // two-way: [(activeTab)]

// Outputs
tabChange: EventEmitter<string>

// lib-tab (child)
// Inputs
key:      string
label:    string
icon?:    string
disabled: boolean   // default: false
badge?:   number    // notification count on tab

// Slot: default ng-content → tab panel content
```

### lib-link

```typescript
// Inputs
href:       string       // external URL
routerLink: string | any[]  // internal route
target:     '_blank' | '_self'  // default: '_self'
variant:    'default' | 'muted' | 'danger'  // default: 'default'
underline:  'always' | 'hover' | 'never'    // default: 'hover'

// Slot: default ng-content → link text/content

// Auto-detects: if routerLink is set, renders <a [routerLink]>.
// If href is set, renders <a [href]>.
```

---

## Navigation Components

### lib-breadcrumbs

```typescript
interface BreadcrumbItem {
  label:       string;
  routerLink?: string | any[];
  icon?:       string;
}

// Inputs
items:     BreadcrumbItem[]
separator: 'slash' | 'chevron'   // default: 'chevron'

// Slots
libSeparator  // ng-template — custom separator element

// Last item is always rendered as plain text (not clickable), automatically.
```

### lib-stepper

```typescript
interface StepItem {
  key:          string;
  label:        string;
  description?: string;
  status:       'pending' | 'active' | 'completed' | 'error';
}

// Inputs
steps:       StepItem[]
orientation: 'horizontal' | 'vertical'  // default: 'horizontal'
activeStep:  string   // two-way: [(activeStep)]
linear:      boolean  // if true, can't skip steps, default: false

// Outputs
stepChange: EventEmitter<string>

// Slots
libStepContent="key"  // ng-template — content panel for each step
libStepIcon="key"     // ng-template — custom icon for a step (overrides status icon)
```

The stepper is purely presentational — the parent controls navigation logic (next/prev/validation).

### lib-timeline

```typescript
interface TimelineItem {
  id:           string;
  label:        string;
  description?: string;
  date?:        Date | string;
  icon?:        string;
  status:       'pending' | 'active' | 'completed' | 'error';
  color?:       string;  // custom dot color (hex)
}

// Inputs
items:       TimelineItem[]
orientation: 'vertical' | 'horizontal'  // default: 'vertical'

// Slots
libTimelineItem="id"     // ng-template let-item — full item override (dot + content)
libTimelineContent="id"  // ng-template let-item — content only (keeps dot + line)

// Primary use cases in this system:
// - DailyLog history on a project
// - Project status change history
// - Stage progression log
```

---

## Dark Mode

Tailwind v4 configured with `class` dark mode strategy. `ThemeService` manages the `dark` class on `<html>`.

All components use Tailwind dark-mode variants (`dark:bg-dark-surface`, `dark:text-dark-text`, etc.) as defined in the design system tokens.

Bootstrap in `apps/frontend`:
```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    ThemeService,  // auto-initializes on construction
    ErrorMessageService,
  ]
});
```

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Component selector | `lib-{name}` | `lib-input`, `lib-card` |
| Slot directive | `lib{Component}{Slot}` | `libCardActions`, `libCell` |
| Service | `{Name}Service` | `ErrorMessageService` |
| Model/interface | `{Name}` in `models/` | `TableColumn`, `SelectOption` |
| File | `{name}.component.ts` | `input.component.ts` |

---

## Out of Scope (this iteration)

- Pagination component (table parent controls data)
- Modal/Dialog (next iteration)
- Toast/notification system (next iteration)
- Icon component (use Heroicons/Lucide directly in templates)
- Form group layout component (next iteration)
- Data visualization / charts

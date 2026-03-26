<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Estructura del monorepo

```
apps/
  api/        → NestJS API (backend)
  frontend/   → Angular (frontend)
libs/
  ui/         → Angular lib — componentes reutilizables (botones, cards, tablas, badges, etc.)
  util/       → TypeScript lib — modelos, interfaces, mappers y utilidades compartidas entre apps
```

# Reglas de componentes frontend (Angular)

Antes de crear cualquier componente nuevo en `apps/frontend`, seguir este flujo obligatorio:

1. **¿Existe en `libs/ui`?** → Usarlo directamente.
2. **¿Es reutilizable en otras páginas/contextos?** → Crearlo en `libs/ui`, exportarlo, luego importarlo en `apps/frontend`.
3. **¿Es único e irrepetible de esa página?** → Crearlo directamente en `apps/frontend` (no va a `libs/ui`).

> El objetivo es maximizar la reutilización. Ante la duda, priorizar `libs/ui`.

# Reglas de modelos y utilidades (lib/util)

- **Todos los modelos, interfaces, DTOs y mappers viven en `libs/util`.**
- Antes de implementar cualquier feature (frontend o backend), verificar si el modelo ya existe en `libs/util`.
- Si el modelo no existe, crearlo en `libs/util` antes de implementar la feature.
- Tanto `apps/api` como `apps/frontend` importan modelos desde `libs/util`.

# Multitenancy

Esta aplicación es **multitenant**. El tenant representa una **organización/empresa constructora**.

### Estrategia de aislamiento
- **MVP (actual):** row-level — una sola BD, todas las entidades tienen `tenantId` como FK.
- **Futuro (producción):** schema-based — un schema/BD por tenant. Diseñar desde ahora pensando en esta migración: no acoplar lógica que asuma una sola BD global.

### Reglas invariables
- Un **usuario pertenece a un solo tenant** (no hay usuarios multi-tenant).
- Un **tenant puede tener múltiples proyectos**; los proyectos pertenecen al tenant.
- **Toda entidad de negocio** debe tener `tenantId` (o relación hacia una entidad que lo tenga).
- En `apps/api`: **todos los queries y mutaciones filtran por `tenantId`** extraído del JWT/contexto del request. Nunca exponer datos cross-tenant.
- En `libs/util`: los modelos de entidades de negocio incluyen `tenantId: string`.

### Entidades principales (MVP)

| Entidad | Descripción |
|---------|-------------|
| `Tenant` | Organización/empresa constructora |
| `TenantConfig` | Configuración del tenant (ej. `autoAssignViewerOnProjectCreate`) |
| `User` | Usuario, pertenece a un solo tenant. Sin rol global; el rol es por proyecto |
| `StageTemplate` | Catálogo de etapas reutilizables a nivel tenant (ej. "Cimientos", "Estructura") |
| `Project` | Proyecto de construcción. Tiene estados Y etapas. Campos: nombre, descripción, fechas, presupuesto, ubicación |
| `ProjectStage` | Etapa personalizada del proyecto. Seleccionada del catálogo o creada nueva. Tiene nombre, orden y estado |
| `ProjectMember` | Relación User↔Project con rol: `ADMIN` \| `SUPERVISOR` \| `RESIDENT` \| `VIEWER` |
| `ActivityState` | Estado personalizado de actividad. Scope: tenant o proyecto. Gestionado por admin |
| `Activity` | Actividad del cronograma. Árbol recursivo (`parentId`). Asignada a un rol → deriva al usuario con ese rol en el proyecto |
| `DailyLog` | Bitácora. Múltiples por día/proyecto. La crea cualquier miembro asignado al proyecto |
| `Media` | Fotos/archivos asociados a un `DailyLog` (otros adjuntos a futuro) |

### Roles de proyecto
| Rol | Descripción |
|-----|-------------|
| `ADMIN` | Administrador del proyecto |
| `SUPERVISOR` | Supervisor de obra |
| `RESIDENT` | Residente de obra |
| `VIEWER` | Solo lectura |

> Roles de administración del SaaS (super-admin, etc.) se definen en fases posteriores al MVP.

### Visibilidad de proyectos
- La visibilidad **siempre depende de la asignación explícita** (`ProjectMember`).
- Ningún usuario ve proyectos en los que no tiene un rol asignado.
- **Excepción configurable:** `TenantConfig.autoAssignViewerOnProjectCreate = true` → al crear un proyecto se agrega automáticamente a todos los usuarios del tenant con rol `VIEWER`.

### Actividades y cronograma
- Estructura **árbol recursivo** (`parentId` auto-referencial): n niveles de sub-actividades.
- Asignación **por rol** → se resuelve al usuario que tiene ese rol en el proyecto.
- Progreso **configurable al crear la actividad**:
  - `PERCENTAGE` → valor 0–100%
  - `STATE` → estado discreto seleccionado de `ActivityState`
- `ActivityState` es gestionable por el admin del proyecto o del tenant. Puede tener scope tenant (reutilizable) o proyecto (local).
- Vista cronograma = **Gantt** sobre el árbol de actividades del proyecto.

### Etapas de proyecto
- No son predefinidas globalmente.
- `StageTemplate` es un catálogo a nivel tenant: el admin crea etapas reutilizables.
- Al configurar un proyecto, se seleccionan etapas del catálogo o se crean nuevas, y se ordenan.
- Cada `ProjectStage` tiene nombre, orden y estado propio que puede afectar el estado del proyecto.

# Design System

Este proyecto usa un design system definido. SIEMPRE seguirlo al crear o modificar cualquier componente frontend.

- Guía completa + clases Tailwind + ejemplos: `docs/design-system.md`
- Tokens CSS (@theme para Tailwind v4): `docs/design-system.css`

Reglas no negociables:
- Fuente única: **Inter** (nunca decorativas)
- Colores siempre desde tokens (nunca hex hardcodeados)
- Border radius: `rounded-input` (botones/inputs), `rounded-card` (cards), `rounded-badge` (pills)
- Sombras: solo `shadow-card` y `shadow-hover`
- Botón naranja (`bg-accent`) exclusivo para acciones de campo/obra
- Badges siempre pill shape + texto UPPERCASE
- Filas de tabla mínimo 48px de altura
- Dark mode usando variables `dark-*`

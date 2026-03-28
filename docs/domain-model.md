# Domain Model — Solid Plan
**Construction Project Manager**

> Documentación del modelo de dominio. Leer antes de implementar cualquier feature
> en `apps/api` o `apps/frontend`. Todos los modelos viven en `libs/util`.

---

## Arquitectura general

```
apps/
  api/        → NestJS — API REST, lógica de negocio, acceso a BD
  frontend/   → Angular — UI, consume la API
libs/
  ui/         → Angular — componentes reutilizables (design system)
  util/       → TypeScript — modelos, types, enums, value objects compartidos
```

Toda entidad de negocio importa sus tipos desde `@org/util` (alias del paquete `libs/util`).

---

## Multitenancy

### Estrategia actual (MVP)
Row-level isolation: una sola base de datos. **Toda entidad de negocio tiene `tenantId`.**

```
Request → JWT → extraer tenantId → filtrar TODOS los queries por tenantId
```

No existe ningún endpoint que retorne datos cross-tenant. Si un query no filtra por `tenantId`, es un bug de seguridad.

### Estrategia futura
Schema-based isolation: un schema/base de datos por tenant. El diseño actual lo permite sin cambios en los modelos — solo cambia la capa de conexión en `apps/api`.

### Regla de oro
> Antes de cualquier query o mutación en `apps/api`, verificar que el `tenantId` del JWT coincida con el recurso que se está accediendo.

---

## Entidades y relaciones

```
Tenant ──────────────────────────────────────────────────────┐
  │                                                           │
  ├──< TenantConfig (1:1)                                     │
  ├──< User                                                   │
  │      └── tenantRole: TENANT_ADMIN | MEMBER                │
  │                                                           │
  ├──< StageTemplate (catálogo de etapas reutilizables)       │
  ├──< Category (catálogo de categorías de actividades)       │
  ├──< ClassificationResource (catálogo de tipos de recurso)  │
  ├──< Resource (inventario de recursos)                      │
  ├──< ActivityState (estados custom, scope tenant o proyecto)│
  │                                                           │
  └──< Project                                                │
         │                                                    │
         ├──< ProjectMember (User↔Project + rol)              │
         │      └── role: ADMIN | SUPERVISOR | RESIDENT | VIEWER
         │                                                    │
         ├──< ProjectResource (asignación de recurso al proyecto)
         │      ├── resourceId → Resource (catálogo tenant)   │
         │      ├── allocation: plannedQty / usedQty / reservedQty
         │      ├── costingOverride? (precio acordado para este proyecto)
         │      ├── stageId? → ProjectStage                   │
         │      ├── activityId? → Activity                    │
         │      └── status: PLANNED|ORDERED|IN_USE|COMPLETED|CANCELLED
         │                                                    │
         ├──< ProjectStage (etapas, ordenadas)                │
         │      └── templateId? → StageTemplate               │
         │                                                    │
         ├──< Schedule (versiones del cronograma)             │
         │                                                    │
         ├──< Activity (árbol recursivo)                      │
         │      ├── parentActivityId? → Activity              │
         │      ├── stageId? → ProjectStage                   │
         │      ├── assignedRoleId → Role (PROJECT scope)     │
         │      ├── progressType: PERCENTAGE | STATE          │
         │      ├── progressStateId? → ActivityState          │
         │      └──< Activity (sub-actividades, n niveles)    │
         │                                                    │
         └──< DailyLog                                        │
                ├── authorId → User                           │
                └──< File (fotos y documentos de evidencia)   │
                       └── storage → S3                       │
```

---

## Descripción de entidades

### Tenant
Organización/empresa constructora. Raíz del sistema multitenant.
Tiene plan de suscripción (`FREE | STARTER | PRO | ENTERPRISE`).

### TenantConfig
Configuración 1:1 con Tenant. Controla comportamientos automáticos:
- `autoAssignViewerOnProjectCreate`: si `true`, al crear un proyecto todos los usuarios del tenant se agregan como VIEWER automáticamente.
- `requireApprovalForDailyLog`: los logs requieren aprobación de supervisor.
- Días/horas laborables para cálculo de cronograma.
- Preferencias de notificaciones por email.

### User
Un usuario pertenece a **un solo tenant**. Tiene:
- `tenantRole`: su rol en la organización (`TENANT_ADMIN | MEMBER`).
- Su acceso a proyectos específicos se gestiona en `ProjectMember`.

### StageTemplate
Catálogo de etapas reutilizables a nivel tenant. El admin lo mantiene.
Ejemplos: `Cimentación`, `Estructura`, `Instalaciones`, `Acabados`.
Al crear un proyecto, se pueden seleccionar etapas del catálogo.

### Project
Proyecto de construcción. Tiene código único, datos de ubicación, presupuesto, timeline y stakeholders. El estado puede cambiar por la etapa activa (`currentStageId`).

### ProjectStage
Etapa dentro de un proyecto. Tiene orden, estado y fechas propias.
Puede haberse creado desde un `StageTemplate` o desde cero.
El estado de la etapa activa influye en el estado general del proyecto.

### ProjectMember
**La entidad de control de acceso a proyectos.**
Un usuario solo ve un proyecto si tiene un `ProjectMember` en él.
Un usuario puede tener roles distintos en proyectos distintos.

| Rol | Capacidades |
|-----|-------------|
| `ADMIN` | Control total del proyecto |
| `SUPERVISOR` | Gestiona actividades, aprueba bitácoras |
| `RESIDENT` | Crea bitácoras, registra avances, sube evidencias |
| `VIEWER` | Solo lectura |

### Activity
Actividad del cronograma. Estructura de árbol recursivo (n niveles).

**Asignación por rol:** La actividad se asigna al `ProjectMemberRoleEnum` responsable,
no a un usuario directamente. El sistema resuelve el usuario via `ProjectMember`.

**Progreso configurable al crear:**
- `PERCENTAGE`: avance numérico 0–100%. Para ejecución continua.
- `STATE`: estado discreto de `ActivityState`. Para flujos de aprobación.

**Dependencias Gantt:**
- `FS` (Finish-to-Start): más común. B no puede empezar hasta que A termine.
- `SS` (Start-to-Start): ambas inician al mismo tiempo.
- `FF` (Finish-to-Finish): ambas terminan al mismo tiempo.
- `SF` (Start-to-Finish): B no puede terminar hasta que A empiece.

### ActivityState
Estados personalizados para actividades con `progressType = STATE`.
Scope tenant (reutilizable) o proyecto (local).
`isFinal = true` marca la actividad como completada. `isDefault = true` se asigna al crear.

### Schedule
Versión del cronograma de un proyecto. Un proyecto puede tener múltiples versiones.
Solo una puede estar `ACTIVE`. Flujo: `DRAFT → APPROVED → ACTIVE → ARCHIVED`.

### DailyLog
Bitácora de obra. Múltiples registros por día y proyecto.
Cualquier miembro asignado puede crear una bitácora (no solo el residente).
`isLocked = true` cuando ha sido firmada o venció el período de edición.

### File
**Modelo centralizado para todos los archivos del sistema.**
Representa un archivo almacenado en S3 con su metadata completa.
`association.entityType` indica a qué pertenece: `DAILY_LOG | PROJECT | ACTIVITY`.
Tipos: `PHOTO | DOCUMENT | PLAN | REPORT | OTHER`.

La URL puede ser pública o pre-signed — la API decide según el tipo de archivo y permisos.
El `storage.key` sigue el patrón: `tenants/{tenantId}/{entityType}/{entityId}/{uuid}.{ext}`

### Resource
Recurso utilizable en actividades: mano de obra (LABOR), maquinaria (EQUIPMENT) o material (MATERIAL). Solo MATERIAL tiene inventario con stock y alertas.

### Category
Categoría de actividad de obra. Configurable por tenant.
Ejemplos: `Albañilería`, `Instalaciones Eléctricas`, `Acabados`.

### ClassificationResource
Tipo de recurso con unidad de medida base. Tres tipos: `LABOR | EQUIPMENT | MATERIAL`.

### Role
Sistema de permisos granular por recurso y acción (CRUD + MANAGE).
Scope: `SYSTEM | TENANT | PROJECT`. Roles `isSystemDefault` no pueden eliminarse.

---

## Control de acceso (resumen)

```
Usuario hace request
  └── JWT contiene: userId, tenantId, (projectId si aplica)
        └── Guard verifica tenantId en la entidad
              └── ProjectMember verifica acceso al proyecto específico
                    └── Rol del ProjectMember determina qué puede hacer
```

---

## Estructura de archivos en libs/util

```
src/
  lib/
    enums/      → Constantes con as const (valores para BD y lógica)
    types/      → Tipos TypeScript derivados de enums (para type-safety)
    models/     → Interfaces de entidades de dominio
    value-objects/ → Objetos de valor (Budget, etc.)
  index.ts      → Re-exporta todo: enums, types, models, value-objects
```

**Convención de importación:**
```typescript
// En apps/api o apps/frontend:
import { Project, ProjectStatus, ProjectStatusEnum } from '@org/util';
```

---

## Notas para nuevos desarrolladores

1. **No hardcodear tenantId.** Siempre viene del JWT en el backend o del estado de sesión en el frontend.
2. **Roles por proyecto, no globales.** El `tenantRole` del User solo controla cosas de la organización. Para proyectos, siempre usar `ProjectMember.role`.
3. **Archivos siempre via File model.** No subir archivos directo y guardar URLs sueltas. Todo pasa por `File` para mantener el inventario centralizado.
4. **Progreso de Activity es inmutable en tipo.** Si `progressType = PERCENTAGE`, no cambiar a `STATE` — implica migrar historial.
5. **Actividades en árbol.** Al eliminar una actividad padre, decidir si eliminar en cascada o reasignar sub-actividades. Esta política se define en el servicio de actividades.
6. **Schedule con versionado.** Al modificar un cronograma aprobado, crear una nueva versión (DRAFT) en lugar de editar la activa.

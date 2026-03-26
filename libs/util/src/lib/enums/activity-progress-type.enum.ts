/**
 * Define cómo se mide el avance de una actividad.
 *
 * Se elige al crear la actividad y no puede cambiarse después
 * sin perder el historial de progreso.
 *
 * - PERCENTAGE: avance numérico del 0 al 100%. Ideal para actividades
 *   de ejecución continua (ej: "Vaciado de losa — 60%").
 *
 * - STATE: avance por estado discreto definido en ActivityState
 *   (ej: PENDIENTE → EN_REVISIÓN → APROBADO). Ideal para actividades
 *   que pasan por fases de aprobación o hitos concretos.
 */
export const ActivityProgressTypeEnum = {
  PERCENTAGE: 'PERCENTAGE',
  STATE: 'STATE',
} as const;

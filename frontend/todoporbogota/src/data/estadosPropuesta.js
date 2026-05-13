/**
 * Estados posibles de una propuesta en el flujo de moderación.
 * Similar al proceso de aprobación de App Store: un mensaje por turno por parte.
 */
export const ESTADOS_PROPUESTA = {
  PENDIENTE: 'PENDIENTE',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO',
  PROPUESTA_DE_CAMBIO: 'PROPUESTA DE CAMBIO',
}

export const ESTADOS_PROPUESTA_LABELS = {
  [ESTADOS_PROPUESTA.PENDIENTE]: 'Pendiente',
  [ESTADOS_PROPUESTA.APROBADO]: 'Aprobado',
  [ESTADOS_PROPUESTA.RECHAZADO]: 'Rechazado',
  [ESTADOS_PROPUESTA.PROPUESTA_DE_CAMBIO]: 'Propuesta de cambio',
}

export const ESTADOS_SELECT_MODERADOR = [
  ESTADOS_PROPUESTA.APROBADO,
  ESTADOS_PROPUESTA.RECHAZADO,
  ESTADOS_PROPUESTA.PROPUESTA_DE_CAMBIO,
]

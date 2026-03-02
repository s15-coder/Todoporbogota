/**
 * Modo admin y "ver como visitante" para probar la vista de iniciativas como si no fueran tuyas.
 */
export const ADMIN_MODE_KEY = 'todoporbogota_admin_mode'
export const ADMIN_MODE_EVENT = 'todoporbogota_admin_mode_change'
export const VIEW_AS_VISITOR_KEY = 'todoporbogota_view_as_visitor'
export const VIEW_AS_VISITOR_EVENT = 'todoporbogota_view_as_visitor_change'

export function getAdminMode() {
  try {
    return localStorage.getItem(ADMIN_MODE_KEY) === 'true'
  } catch {
    return false
  }
}

export function getViewAsVisitor() {
  try {
    return localStorage.getItem(VIEW_AS_VISITOR_KEY) === 'true'
  } catch {
    return false
  }
}

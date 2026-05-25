export type Role = 'super_admin' | 'admin' | 'editor'
export const ROLE_WEIGHT: Record<Role, number> = { editor: 1, admin: 2, super_admin: 3 }

export type UserRole = string | number;

export const roleLabels: Record<string, string> = {
    ROLE_ADMIN: 'Administrador',
    ROLE_SECRETARIA: 'Secretaria',
    ROLE_PROFESIONALES: 'Profesional',
    ROLE_PACIENTE: 'Paciente',
    '0': 'Administrador',
    '1': 'Secretaria',
    '2': 'Profesional',
    '3': 'Paciente',
};

export function formatUserRole(role?: UserRole | null) {
    if (role === undefined || role === null || role === '') {
        return 'Sin rol asignado';
    }

    const roleKey = String(role);
    return roleLabels[roleKey] ?? roleKey.replace('ROLE_', '').toLowerCase();
}

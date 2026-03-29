export interface MockComment {
	id: string
	activityId: string
	author: {
		userId: string
		name: string
		initials: string
		avatarBg: string
	}
	content: string
	createdAt: Date
}

export const MOCK_COMMENTS: MockComment[] = [
	// arq-02 — Planos arquitectónicos
	{
		id: 'c-001',
		activityId: 'arq-02',
		author: { userId: 'u3', name: 'Luis Torres', initials: 'LT', avatarBg: '#8B5CF6' },
		content: 'El cliente solicitó revisar las dimensiones del área de servicio en planta baja. Lo coordiné con Ana para ajustar antes de cerrar esta etapa.',
		createdAt: new Date('2024-02-10T09:15:00'),
	},
	{
		id: 'c-002',
		activityId: 'arq-02',
		author: { userId: 'u1', name: 'Carlos Mendoza', initials: 'CM', avatarBg: '#1E3A5F' },
		content: 'Confirmado, tomar en cuenta también el comentario del municipio sobre el cajón de estacionamiento mínimo. Hay que revisarlo antes de enviar.',
		createdAt: new Date('2024-02-10T11:42:00'),
	},
	{
		id: 'c-003',
		activityId: 'arq-02',
		author: { userId: 'u3', name: 'Luis Torres', initials: 'LT', avatarBg: '#8B5CF6' },
		content: 'Ajustes aplicados. Mando versión actualizada al cliente para validación.',
		createdAt: new Date('2024-02-13T16:05:00'),
	},

	// est-02b — Armado de acero
	{
		id: 'c-004',
		activityId: 'est-02b',
		author: { userId: 'u4', name: 'Pedro Ramírez', initials: 'PR', avatarBg: '#F59E0B' },
		content: 'Detectamos que el acero de 3/8" llegó con 2 días de retraso del proveedor. Se ajustó el cronograma interno para no bloquear el vaciado.',
		createdAt: new Date('2024-04-24T08:30:00'),
	},
	{
		id: 'c-005',
		activityId: 'est-02b',
		author: { userId: 'u2', name: 'Ana Gutiérrez', initials: 'AG', avatarBg: '#10B981' },
		content: 'Quedamos en revisar el avance el viernes. Si el armado llega al 90% confirmamos fecha de inspección con el supervisor estructural.',
		createdAt: new Date('2024-04-25T14:10:00'),
	},

	// est-02c — Vaciado de concreto (bloqueada)
	{
		id: 'c-006',
		activityId: 'est-02c',
		author: { userId: 'u4', name: 'Pedro Ramírez', initials: 'PR', avatarBg: '#F59E0B' },
		content: 'Actividad bloqueada por falta de firma del supervisor en el check de armadura. Se notificó pero aún sin respuesta.',
		createdAt: new Date('2024-05-07T10:00:00'),
	},
	{
		id: 'c-007',
		activityId: 'est-02c',
		author: { userId: 'u1', name: 'Carlos Mendoza', initials: 'CM', avatarBg: '#1E3A5F' },
		content: 'El supervisor confirma visita para el lunes. Mientras tanto avanzar con la preparación del concreto y el flete.',
		createdAt: new Date('2024-05-08T09:22:00'),
	},

	// arq-03 — Memorias descriptivas
	{
		id: 'c-008',
		activityId: 'arq-03',
		author: { userId: 'u3', name: 'Luis Torres', initials: 'LT', avatarBg: '#8B5CF6' },
		content: 'Primera versión de la memoria ya entregada al equipo para revisión interna. Esperamos comentarios antes del viernes.',
		createdAt: new Date('2024-03-05T17:00:00'),
	},
]

export function getCommentsByActivityId(activityId: string): MockComment[] {
	return MOCK_COMMENTS.filter(c => c.activityId === activityId)
}

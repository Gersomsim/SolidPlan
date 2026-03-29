import { Component, signal } from '@angular/core'
import { DatePipe } from '@angular/common'

import { Badge, BadgeVariant, Icon } from '@org/ui'

interface PaymentMethod {
	brand: string
	last4: string
	expMonth: number
	expYear: number
	isDefault: boolean
}

interface Invoice {
	id: string
	date: Date
	description: string
	amount: number
	currency: string
	status: 'PAID' | 'PENDING' | 'FAILED'
}

@Component({
	selector: 'app-billing-settings',
	standalone: true,
	imports: [DatePipe, Badge, Icon],
	templateUrl: './billing-settings.html',
})
export class BillingSettings {
	readonly addCardOpen = signal(false)

	readonly paymentMethods = signal<PaymentMethod[]>([
		{ brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2027, isDefault: true },
		{ brand: 'Mastercard', last4: '8888', expMonth: 6, expYear: 2026, isDefault: false },
	])

	readonly invoices: Invoice[] = [
		{ id: 'inv-006', date: new Date('2026-03-01'), description: 'Plan Starter — Marzo 2026', amount: 299, currency: 'MXN', status: 'PAID' },
		{ id: 'inv-005', date: new Date('2026-02-01'), description: 'Plan Starter — Febrero 2026', amount: 299, currency: 'MXN', status: 'PAID' },
		{ id: 'inv-004', date: new Date('2026-01-01'), description: 'Plan Starter — Enero 2026', amount: 299, currency: 'MXN', status: 'PAID' },
		{ id: 'inv-003', date: new Date('2025-12-01'), description: 'Plan Starter — Diciembre 2025', amount: 299, currency: 'MXN', status: 'PAID' },
		{ id: 'inv-002', date: new Date('2025-11-01'), description: 'Plan Starter — Noviembre 2025', amount: 299, currency: 'MXN', status: 'PAID' },
		{ id: 'inv-001', date: new Date('2025-10-01'), description: 'Plan Starter — Octubre 2025', amount: 299, currency: 'MXN', status: 'PAID' },
	]

	setDefault(last4: string): void {
		this.paymentMethods.update(methods =>
			methods.map(m => ({ ...m, isDefault: m.last4 === last4 })),
		)
	}

	removeMethod(last4: string): void {
		this.paymentMethods.update(methods => methods.filter(m => m.last4 !== last4))
	}

	statusBadgeVariant(status: string): BadgeVariant {
		const map: Record<string, BadgeVariant> = {
			PAID: 'completed',
			PENDING: 'in-progress',
			FAILED: 'delayed',
		}
		return map[status] as BadgeVariant
	}

	statusLabel(status: string): string {
		return { PAID: 'PAGADO', PENDING: 'PENDIENTE', FAILED: 'FALLIDO' }[status] ?? status
	}

	cardIcon(brand: string): string {
		const map: Record<string, string> = { Visa: 'V', Mastercard: 'MC', Amex: 'AE' }
		return map[brand] ?? brand[0]
	}
}

import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DailyLogsPage } from './daily-logs-page'

describe('DailyLogsPage', () => {
	let component: DailyLogsPage
	let fixture: ComponentFixture<DailyLogsPage>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DailyLogsPage],
		}).compileComponents()

		fixture = TestBed.createComponent(DailyLogsPage)
		component = fixture.componentInstance
		await fixture.whenStable()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})

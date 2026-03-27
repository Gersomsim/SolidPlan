import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload.component';
import { ErrorMessageService } from '../../../services/error-message.service';

@Component({
  standalone: true,
  imports: [FileUploadComponent, ReactiveFormsModule],
  template: `<lib-file-upload label="Documento" accept=".pdf" [maxSizeMB]="2" [formControl]="ctrl" />`,
})
class TestHostComponent {
  ctrl = new FormControl(null);
}

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [ErrorMessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders label', () => {
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent).toContain('Documento');
  });

  it('renders the drop zone', () => {
    const zone = fixture.nativeElement.querySelector('[data-dropzone]');
    expect(zone).not.toBeNull();
  });

  it('validates file size and shows error for oversized file', () => {
    const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'big.pdf', { type: 'application/pdf' });
    const comp = fixture.debugElement.children[0].componentInstance as FileUploadComponent;
    comp.handleFiles([largeFile]);
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[data-error]');
    expect(error).not.toBeNull();
    expect(error.textContent).toContain('excede');
  });
});

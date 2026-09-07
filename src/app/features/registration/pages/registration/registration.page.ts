import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { startWith } from 'rxjs';


import { RegistrationResponse } from '../../../../core/models/registration/registration-response.model';
import { DegreeCourse } from '../../../degree_course/models/degree-course.model';
import { RegistrationService } from '../../services/registration.service';
import { CountriesService, Country } from '../../../../shared/countries/countries.service';
import { PasswordRulesComponent } from '../../../../shared/password-rules/password-rules.component';
import { ApiError } from '../../../../core/models/error/api-error.model';
import { RegistrationRequest, RoleType } from '../../../../core/models/registration/registration-request.model';
import { CatalogService } from '../../../catalog/services/catalog.service';


@Component({
  selector: 'app-registration',
  standalone: true,
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PasswordRulesComponent
  ]
})
export class RegistrationPage implements OnInit {

  private static readonly DEFAULT_ORDERING = 'ORD270';
  private readonly destroyRef = inject(DestroyRef);

  registrationForm!: FormGroup;
  countries: Country[] = [];
  degreeCourses: DegreeCourse[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  successReferenceCode: string | null = null;
  successReferenceLabel: string | null = null;
  serverErrors: Record<string, string> = {};
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly registrationService: RegistrationService,
    private readonly countriesService: CountriesService,
    private readonly catalogService: CatalogService,
    private readonly router: Router
  ) {}


  /* ================= LIFECYCLE =============== */
  ngOnInit(): void {
    this.buildForm();
    this.setupRoleSpecificValidation();
    this.setupFeedbackReset();
    this.loadCsrfToken();
    this.loadDegreeCourses();

    this.countries = this.countriesService.getCountries();

    const browserRegion = this.countriesService.getBrowserRegion();
    if (browserRegion) {
      const exists = this.countries.some(c => c.code === browserRegion);
      if (exists) this.registrationForm.get('country')?.setValue(browserRegion);
    }
  }


  /* =============== REGISTRATION ============== */
  onSubmit(): void {
    this.clearFeedback();

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.errorMessage = 'Please review the registration data and try again.';
      return;
    }

    const request = this.buildRequest();
    this.isSubmitting = true;

    this.registrationService.register(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.handleSuccess(response),
        error: (err: ApiError) => this.handleError(err)
      });
  }


  registrationWithGoogle(): void {
    globalThis.location.href = this.registrationService.getOAuth2AuthorizationUrl('google');
  }


  registrationWithGithub(): void {
    globalThis.location.href = this.registrationService.getOAuth2AuthorizationUrl('github');
  }


  resetForm(): void {
    const browserRegion = this.countriesService.getBrowserRegion();

    this.registrationForm.reset({
      username: '',
      password: '',
      confirm: '',
      firstName: '',
      lastName: '',
      dob: '',
      fiscalCode: '',
      street: '',
      city: '',
      country: browserRegion ?? '',
      zip: '',
      phone: '',
      role: 'STUDENT',
      degreeCourseName: '',
      ordering: RegistrationPage.DEFAULT_ORDERING
    });

    this.registrationForm.markAsPristine();
    this.registrationForm.markAsUntouched();
    this.serverErrors = {};
  }


  get isStudentRole(): boolean {
    return this.registrationForm.get('role')?.value === 'STUDENT';
  }


  getFieldError(controlName: string): string | null {
    if (this.serverErrors[controlName]) {
      return this.serverErrors[controlName];
    }

    const control = this.registrationForm.get(controlName);
    if (!control || !control.invalid || (!control.touched && !control.dirty)) {
      return null;
    }

    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('minlength')) return `Minimum length is ${control.getError('minlength').requiredLength}.`;
    if (control.hasError('maxlength')) return `Maximum length is ${control.getError('maxlength').requiredLength}.`;
    if (control.hasError('pattern')) return this.patternMessage(controlName);

    return 'Invalid value.';
  }


  get passwordControl(): FormControl {
    const control = this.registrationForm.get('password');
    if (!control) throw new Error('Password control not found');
    return control as FormControl;
  }


  /* =============== PRIVATE =============== */
  private buildForm(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      fiscalCode: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
      role: ['STUDENT', Validators.required],
      degreeCourseName: [''],
      ordering: [RegistrationPage.DEFAULT_ORDERING]
    });
  }


  private setupRoleSpecificValidation(): void {
    this.registrationForm.get('role')?.valueChanges
      .pipe(
        startWith(this.registrationForm.get('role')?.value as RoleType),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(role => {
        const degreeCourseControl = this.registrationForm.get('degreeCourseName');
        const orderingControl = this.registrationForm.get('ordering');
        const isStudent = role === 'STUDENT';

        degreeCourseControl?.setValidators(isStudent ? [Validators.required] : []);
        orderingControl?.setValidators(isStudent ? [Validators.required] : []);

        if (!isStudent) {
          degreeCourseControl?.setValue('', { emitEvent: false });
          orderingControl?.setValue(RegistrationPage.DEFAULT_ORDERING, { emitEvent: false });
        }

        degreeCourseControl?.updateValueAndValidity({ emitEvent: false });
        orderingControl?.updateValueAndValidity({ emitEvent: false });
      });
  }


  private setupFeedbackReset(): void {
    this.registrationForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.errorMessage = null;
        this.successMessage = null;
        this.successReferenceCode = null;
        this.successReferenceLabel = null;
        this.serverErrors = {};
      });
  }


  private loadCsrfToken(): void {
    this.registrationService.initializeCsrf()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.errorMessage = 'Unable to initialize registration security token.';
        }
      });
  }


  private loadDegreeCourses(): void {
    this.catalogService.getCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: courses => {
          this.degreeCourses = [...courses].sort((left, right) =>
            left.name.localeCompare(right.name)
          );
        },
        error: () => {
          this.degreeCourses = [];
        }
      });
  }


  private buildRequest(): RegistrationRequest {
    const rawValue = this.registrationForm.getRawValue();
    const role = rawValue.role as RoleType;

    const common = {
      username: rawValue.username.trim(),
      password: rawValue.password,
      confirm: rawValue.confirm,
      firstName: rawValue.firstName.trim(),
      lastName: rawValue.lastName.trim(),
      dob: rawValue.dob,
      fiscalCode: rawValue.fiscalCode.trim().toUpperCase(),
      street: rawValue.street.trim(),
      city: rawValue.city.trim(),
      country: rawValue.country,
      zip: rawValue.zip.trim(),
      phone: rawValue.phone.trim()
    };

    if (role === 'STUDENT') {
      return {
        ...common,
        role,
        degreeCourseId: null,
        degreeCourseName: rawValue.degreeCourseName.trim() || null,
        ordering: rawValue.ordering.trim()
      };
    }

    return { ...common, role };
  }


  private handleSuccess(response: RegistrationResponse): void {
    this.successMessage = response.message;
    this.successReferenceCode = response.referenceCode;
    this.successReferenceLabel = this.referenceLabel(response.role);
    this.isSubmitting = false;
    this.resetForm();

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000);
  }


  private handleError(err: ApiError): void {
    this.isSubmitting = false;

    switch (err?.status) {
      case 400:
        this.errorMessage = err.message ?? 'Please review the registration data.';
        this.serverErrors = err.errors ?? {};   // ← diretto, no parseFieldErrors
        break;
      case 409:
        this.errorMessage = err.message ?? 'An account with this data already exists.';
        break;
      case 422:
        this.errorMessage = err.message ?? 'Invalid registration data.';
        break;
      case 503:
        this.errorMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        this.errorMessage = 'Registration failed. Please try again.';
    }
  }



  private clearFeedback(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.successReferenceCode = null;
    this.successReferenceLabel = null;
    this.serverErrors = {};
  }


  private referenceLabel(role: RoleType): string | null {
    switch (role) {
      case 'STUDENT':
        return 'Student register';
      case 'PROFESSOR':
        return 'Professor code';
      case 'ADMIN':
        return 'Admin code';
      default:
        return null;
    }
  }


  private patternMessage(controlName: string): string {
    switch (controlName) {
      case 'zip':
        return 'ZIP code must contain exactly 5 digits.';
      case 'phone':
        return 'Phone number must contain 9 to 15 digits and may start with +.';
      default:
        return 'Invalid value.';
    }
  }


}


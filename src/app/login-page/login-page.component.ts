import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import FormStatus from 'src/app/utils/form-status';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  formSubmitted = false;
  formStatus = FormStatus.Initial;
  formError = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit() {
    this.formSubmitted = true;

    if (!this.canSubmit) {
      return;
    }

    this.formStatus = FormStatus.Pending;
    this.formError = '';

    this.apiService.login(
      this.formControls.username.value,
      this.formControls.password.value
    ).pipe(
        catchError((error: HttpErrorResponse) => {
          this.formStatus = FormStatus.Initial;
          this.formError = error.error.message;
          return throwError(() => new Error(error.error.message));
        })
      )
      .subscribe((result: any) => {
        // Save the token to use it later
        this.authService.login(result.token);

        // Reset the form to its initial state
        this.formStatus = FormStatus.Initial;
        this.loginForm.reset();
        this.formSubmitted = false;

        // And redirect the user to the home page
        this.router.navigate(['/']);
      })
  }

  get formControls() {
    return this.loginForm.controls;
  }

  get canSubmit() {
    return (
      this.formStatus === FormStatus.Initial &&
      !this.usernameIsInvalid &&
      !this.passwordIsInvalid
    );
  }

  get usernameIsInvalid() {
    return this.formControls.username?.invalid && (
      this.formControls.username?.touched ||
      this.formSubmitted
    );
  }

  get passwordIsInvalid() {
    return this.formControls.password?.invalid && (
      this.formControls.password?.touched ||
      this.formSubmitted
    );
  }
}

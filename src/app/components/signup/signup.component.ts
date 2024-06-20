import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Owner } from 'src/app/models/owner.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null : { 'passwordMismatch': true };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Submitted!', this.signupForm.value);
      var petOwner = new Owner({
        id: -1,
        firstName: this.signupForm.controls['firstName'].value,
        lastName: this.signupForm.controls['lastName'].value,
        email: this.signupForm.controls['email'].value,
      });
      var user = new User({
        id: -1,
        username: this.signupForm.controls['username'].value,
        password: this.signupForm.controls['password'].value,
        enabled: true,
        petOwner: petOwner
      });

      this.authService.signup(user).subscribe(
        () => {
          console.log('Subscribed signup');
          this.router.navigate(['/login'])
        },
        error => console.error('Error during signup', error)
      );
    }
  }
}

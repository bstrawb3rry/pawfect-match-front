import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { CountryInformation } from 'src/app/models/country-info.model';
import { Owner } from 'src/app/models/owner.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { GeolocationService } from 'src/app/services/geolocation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  countries: CountryInformation[] = [];
  counties: { [key: string]: string } = {};
  cities: string[] = [];
  selectedCountry: CountryInformation;
  selectedCounty: { key: string, value: string } = {key: '', value: ''};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private geolocationService: GeolocationService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      county: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.geolocationService.getCountries()
      .subscribe(data => {
        this.countries = data;
      });
  }

  onCountryChange(event: any) {
    this.geolocationService.getCounties(this.selectedCountry.geonameId).subscribe(
      data => {
        this.counties = data;
        this.cities = undefined;
      });
  }

  onCountyChange(event: any) {
    console.log('selectedCounty in country change: ', this.selectedCounty);
    this.geolocationService.getCities(this.selectedCounty.key, this.selectedCountry.countryCode).subscribe(
      data => {
        this.cities = data;
      });
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
      var address = new Address({
        id: -1,
        country: this.selectedCountry.countryName,
        county: this.selectedCounty.value,
        city: this.signupForm.controls['city'].value,
        postalCode: +this.signupForm.controls['postalCode'].value,
        address: this.signupForm.controls['address'].value,
      });
      var user = new User({
        id: -1,
        username: this.signupForm.controls['username'].value,
        password: this.signupForm.controls['password'].value,
        enabled: true,
        petOwner: petOwner,
        address: address
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

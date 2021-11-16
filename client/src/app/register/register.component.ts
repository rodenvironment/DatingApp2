import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  registerForm!: FormGroup;
  maxDate: Date = new Date();
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, 
    private fb: FormBuilder, 
    private router: Router) { }

  ngOnInit(): void {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.initializeForm();
  }

  get username() {
    return this.registerForm.get('username');
  }
  get knownAs() {
    return this.registerForm.get('knownAs');
  }
  get gender() {
    return this.registerForm.get('gender');
  }
  get dateOfBirth() {
    return this.registerForm.get('dateOfBirth');
  }
  get city() {
    return this.registerForm.get('city');
  }
  get country() {
    return this.registerForm.get('country');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });

    this.registerForm.controls.password.valueChanges.subscribe(()=> {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  matchValues(matchTo: string) : ValidatorFn {
    return (control: AbstractControl) => {
      let areMatch = false;
      const parent = control?.parent as FormGroup;
      if(parent){
        areMatch = control?.value === parent.get(matchTo)?.value ? true: false;
      }
      
      return areMatch ? null: {noMatch: true};
    }
  }

  register() {
    this.accountService.registerUSer(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/members');
    }, error => {
      this.validationErrors = error;
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
    
  }

}

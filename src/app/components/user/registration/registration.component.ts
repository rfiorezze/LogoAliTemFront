import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ValidatorFields } from '@app/helpers/ValidatorFields';
import { User } from '@app/models/identity/User';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from '@app/shared/custom-validators'
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})

export class RegistrationComponent implements OnInit {
  user = {} as User;
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toaster: ToastrService) { }

  get f(): any { return this.form.controls; }

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorFields.MustMatch('password', 'confirmePassword')
    };

    this.form = this.fb.group({
      nomeCompleto: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['',
        [Validators.required, Validators.email, CustomValidators.emailDomainValidator]
      ],
      password: ['',
        [Validators.required, Validators.minLength(4)]
      ],
      confirmePassword: ['', Validators.required],
      termoAceite: ['', Validators.required],
    }, formOptions);
  }

  register(): void {
    this.user = { ...this.form.value };
    this.accountService.register(this.user).subscribe(
      () => {
        const retornarParaCertidao = localStorage.getItem('retornarParaCertidao');
  
        if (retornarParaCertidao) {
          this.router.navigate(['/calcula-estadia']);
          localStorage.removeItem('retornarParaCertidao');
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      (error: any) => {
        this.toaster.error(error.error.mensagem);
      }
    );
  }
}

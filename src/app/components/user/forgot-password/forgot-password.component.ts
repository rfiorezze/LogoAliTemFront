import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '@app/services/account.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '@app/shared/custom-validators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ForgotPasswordComponent {
  form!: FormGroup;

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void {
    this.form = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          CustomValidators.emailDomainValidator,
        ],
      ],
    });
  }

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  // Getter para facilitar o acesso aos controles do formulário
  get f() {
    return this.form.controls;
  }

  sendResetLink() {
    this.spinner.show();
    const email = this.form.get('email')?.value;
    this.accountService.forgotPassword(email).subscribe({
      next: () => {
        this.spinner.hide();
        this.toastr.success('E-mail enviado com sucesso! Verifique sua caixa de entrada.');
        this.form.reset(); // Limpa o formulário, incluindo o campo de e-mail
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Erro ao enviar e-mail. Tente novamente mais tarde.');
      }
    });
  }
}

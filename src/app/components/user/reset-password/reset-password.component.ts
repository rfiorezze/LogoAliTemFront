import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '@app/services/account.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  email: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });

    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.mustMatch('newPassword', 'confirmPassword')
    });
  }

  get f() {
    return this.form.controls;
  }

  resetPassword() {
    if (this.form.invalid) {
      return;
    }

    const { newPassword } = this.form.value;

    this.accountService.resetPassword(this.email, this.token, newPassword).subscribe({
      next: () => {
        this.toastr.success('Senha redefinida com sucesso!');
        this.router.navigateByUrl('/login');
      },
      error: () => this.toastr.error('Erro ao redefinir a senha.')
    });
  }

  // Validador para confirmar se as senhas são iguais
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}

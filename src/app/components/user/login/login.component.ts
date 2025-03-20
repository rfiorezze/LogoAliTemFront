import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserLogin } from '@app/models/identity/UserLogin';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent implements OnInit {
  model = {} as UserLogin;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  public login(): void {
    this.spinner.show();
    this.accountService.login(this.model).subscribe(
      () => {
        const retornarParaCertidao = localStorage.getItem(
          'retornarParaCertidao'
        );

        if (retornarParaCertidao) {
          this.router.navigate(['/calcula-estadia']);
          localStorage.removeItem('retornarParaCertidao');
        } else {
          this.router.navigate(['/dashboard']);
        }
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        if (error.status == 401) {
          this.toaster.error('Usuário ou senha inválido');
        } else {
          console.error(error);
        }
      }
    );
  }
}

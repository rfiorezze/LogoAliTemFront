import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  standalone: true,
  styleUrls: ['./perfil.component.scss'],
  imports:[TituloComponent, ReactiveFormsModule, CommonModule, RouterModule, NgxMaskDirective],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilComponent implements OnInit {

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  constructor(private fb: FormBuilder,
              public accountService: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService
      .getUser()
      .subscribe(
        (userRetorno: UserUpdate) => {
          console.log(userRetorno);
          this.userUpdate = userRetorno;
          this.form.patchValue(this.userUpdate);
          this.toastr.success('Usuário Carregado', 'Sucesso');
        },
        (error) => {
          console.error(error);
          this.toastr.error('Usuário não Carregado', 'Erro');
          this.router.navigate(['/home']);
        },
        () => this.spinner.hide()
      )      
  }

  private validation(): void {
    this.form = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]]
    });
  }

  // Conveniente para pegar um FormField apenas com a letra F
  get f(): any { return this.form.controls; }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario() {
    this.userUpdate = { ...this.form.value };
    this.spinner.show();

    this.accountService
      .updateUser(this.userUpdate)
      .subscribe(
        () => this.toastr.success('Usuário atualizado!', 'Sucesso'),
        (error) => {
          this.toastr.error(error.error);
          console.error(error);
        }
      )
      .add(() => this.spinner.hide());
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}

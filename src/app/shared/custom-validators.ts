// custom-validators.ts
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

export class CustomValidators {
  static dataNascimentoValida(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const dataNascimento = control.value;

    if (!dataNascimento) {
      return of(null); // Retorna Observable nulo se não houver data de nascimento
    }

    const hoje = new Date();
    const dataNascimentoDate = new Date(dataNascimento);

    if (dataNascimentoDate > hoje) {
      return of({ dataFutura: true }); // Retorna Observable com erro se a data for futura
    }

    return of(null); // Retorna Observable nulo se a data estiver correta
  }

  static emailDomainValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const email = control.value;
    const domainPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainPattern.test(email) ? null : { invalidDomain: true };
  }

  static anoValido(control: AbstractControl): ValidationErrors | null {
    const ano = control.value;
    const anoAtual = new Date().getFullYear();

    // Verificar se o ano está dentro do intervalo válido
    if (ano < 1900 || ano > anoAtual) {
      return { anoInvalido: true };
    }
    return null;
  }

  static validarCPF(control: FormControl): { [key: string]: boolean } | null {
    const cpf = control.value?.replace(/\D/g, '');

    if (!cpf || cpf.length !== 11) {
      return { cpfInvalido: true };
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return { cpfInvalido: true };

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return { cpfInvalido: true };

    return null;
  }
}

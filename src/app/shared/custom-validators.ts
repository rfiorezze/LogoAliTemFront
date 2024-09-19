// custom-validators.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';
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
}

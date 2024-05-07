import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Placa',
  standalone: true,
})
export class PlacaPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    if (value) {
      value = value.replace(/\W/g, ''); // Remover caracteres não alfanuméricos

      let placaFormatada = '';

      if (value.length === 7) {
        placaFormatada = value.replace(/^([A-Za-z]{3})([0-9A-Za-z]{4})$/, '$1-$2');
      }

      return placaFormatada || 'Placa inválida';
    }
  }
}

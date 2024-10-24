import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable()
export class EmailService {
  baseURL = environment.apiURL + 'api/Email';

  constructor(private http: HttpClient) {}

  // Método para enviar e-mail com ou sem PDF anexo
  public enviarEmail(
    emailDestino: string,
    assunto: string,
    corpo: string,
    copiaPara: string = '',
    arquivo?: Blob
  ): Observable<any> {
    const formData = new FormData();
    
    formData.append('emailDestino', emailDestino);
    formData.append('assunto', assunto);
    formData.append('corpo', corpo);

    if (copiaPara) {
      formData.append('copiaPara', copiaPara);
    }

    // Adicionar o arquivo apenas se estiver presente
    if (arquivo) {
      formData.append('arquivo', arquivo, 'anexo.pdf'); // Nome do arquivo no backend
    }

    return this.http
      .post<any>(`${this.baseURL}/enviar-email`, formData)
      .pipe(take(1));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Estado } from '@app/models/Estado';
import { Municipio } from '@app/models/Municipio';
import { Endereco } from '@app/models/Endereco';

@Injectable({
  providedIn: 'root',
})
export class LocalidadeService {
  baseURL = 'https://servicodados.ibge.gov.br/api/v1/localidades';
  baseUrlViaCEP = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  public getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${this.baseURL}/estados`).pipe(take(1));
  }

  public getMunicipiosPorUF(siglaUF: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.baseURL}/estados/${siglaUF}/municipios`).pipe(take(1));
  }

  public getEnderecoPorCep(CEP: string): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.baseUrlViaCEP}/${CEP}/json`).pipe(take(1));
  }
}

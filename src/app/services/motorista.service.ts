import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Motorista } from '../models/Motorista';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class MotoristaService {
  baseURL = environment.apiURL + 'api/Motoristas';

  constructor(private http: HttpClient) {}
  
  public getMotoristas(): Observable<Motorista[]>{
    return this.http
      .get<Motorista[]>(this.baseURL)
      .pipe(take(1));
  }

  public getMotoristasByNome(nome: string): Observable<Motorista[]>{
    return this.http
      .get<Motorista[]>(`${this.baseURL}/nome/${nome}`)
      .pipe(take(1));
  }

  public getMotoristasByLocalidade(estado: string, cidade: string): Observable<Motorista[]>{
    return this.http
      .get<Motorista[]>(`${this.baseURL}/localidade/${estado}/${cidade}`)
      .pipe(take(1));
  }

  public getMotoristaByCpf(cpf: string): Observable<Motorista>{
    return this.http
      .get<Motorista>(`${this.baseURL}/cpf/${cpf}`)
      .pipe(take(1));
  }

  public getMotoristaById(id: number): Observable<Motorista>{
    return this.http
      .get<Motorista>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public post(motorista: Motorista): Observable<Motorista>{
    return this.http
      .post<Motorista>(this.baseURL, motorista)
      .pipe(take(1));
  }

  public put(motorista: Motorista): Observable<Motorista>{
    console.log(motorista);
    return this.http
      .put<Motorista>(`${this.baseURL}/${motorista.id}`, motorista)
      .pipe(take(1));
  }

  public deleteMotorista(id: number): Observable<any>{
    return this.http
      .delete<string>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public getQuantidadeMotoristas(): Observable<number> {
    return this.http
      .get<{ total: number }>(`${this.baseURL}/quantidade`)
      .pipe(
        take(1),
        // extrai só o número
        map(response => response.total)
      );
  }  
}

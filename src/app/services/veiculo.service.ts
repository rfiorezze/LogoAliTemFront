import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Veiculo } from '../models/Veiculo';
import { environment } from '@environments/environment';

@Injectable()
export class VeiculoService {
  baseURL = environment.apiURL + 'api/Veiculos';

  constructor(private http: HttpClient) {}
  
  public getVeiculos(): Observable<Veiculo[]>{
    return this.http
      .get<Veiculo[]>(this.baseURL)
      .pipe(take(1));
  }

  public getVeiculosByPlaca(placa: string): Observable<Veiculo[]>{
    return this.http
      .get<Veiculo[]>(`${this.baseURL}/placa/${placa}`)
      .pipe(take(1));
  }

  public getVeiculoById(id: number): Observable<Veiculo>{
    return this.http
      .get<Veiculo>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public getVeiculosByMotoristaId(idMotorista: number): Observable<Veiculo[]>{
    return this.http
      .get<Veiculo[]>(`${this.baseURL}/motorista/${idMotorista}`)
      .pipe(take(1));
  }

  public post(Veiculo: Veiculo): Observable<Veiculo>{
    return this.http
      .post<Veiculo>(this.baseURL, Veiculo)
      .pipe(take(1));
  }

  public put(Veiculo: Veiculo): Observable<Veiculo>{
    console.log(Veiculo);
    return this.http
      .put<Veiculo>(`${this.baseURL}/${Veiculo.id}`, Veiculo)
      .pipe(take(1));
  }

  public deleteVeiculo(id: number): Observable<any>{
    return this.http
      .delete<string>(`${this.baseURL}/${id}`)
      .pipe(take(1));
  }

  public getTiposCarroceria(): Observable<any> {
    return this.http.get<any>('assets/TipoCarroceria.json');
  }
  
  public getCategorias(): Observable<any> {
    return this.http.get<any>('assets/Categoria.json');
  }

  public getMarcas(): Observable<any> {
    return this.http.get<any>('assets/Marcas.json');
  }

  public getQuantidadeVeiculos(): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/quantidade`).pipe(take(1));
  }
  
}
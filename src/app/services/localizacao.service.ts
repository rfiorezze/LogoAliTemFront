import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {
  private baseURL = environment.apiURL + 'api/localizacao';

  constructor(private http: HttpClient) {}

  /**
   * Obtém o endereço correspondente às coordenadas geográficas (latitude/longitude).
   */
  public obterEnderecoPorCoordenadas(latitude: number, longitude: number): Observable<{ endereco: string }> {
    return this.http
      .get<{ endereco: string }>(`${this.baseURL}/geolocalizacao?latitude=${latitude}&longitude=${longitude}`)
      .pipe(take(1));
  }

  /**
   * Calcula a distância (em km) entre dois endereços.
   */
  public calcularDistancia(origem: string, destino: string): Observable<{ distanciaKm: number }> {
    return this.http
      .get<{ distanciaKm: number }>(`${this.baseURL}/distancia?origem=${encodeURIComponent(origem)}&destino=${encodeURIComponent(destino)}`)
      .pipe(take(1));
  }

  /**
   * Obtém sugestões de endereços enquanto o usuário digita.
   * Adicionado debounceTime para evitar chamadas repetitivas.
   */
  public obterSugestoesEnderecos(input: string): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseURL}/sugestoes?input=${encodeURIComponent(input)}`)
      .pipe(
        debounceTime(500), // Aguarda 500ms antes de chamar a API
        distinctUntilChanged(), // Só chama a API se o input mudar
        take(1)
      );
  }
}

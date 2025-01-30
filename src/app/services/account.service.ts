import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map, take } from 'rxjs';
import { environment } from '@environments/environment';
import { User } from '@app/models/identity/User';
import { UserUpdate } from '@app/models/identity/UserUpdate';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private currentUserSource = new ReplaySubject<User | null>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  baseUrl = environment.apiURL + 'api/account/';

  constructor(private http: HttpClient) {
    const user = this.getUserFromLocalStorage();
    this.currentUserSource.next(user);
  }

  // Método de login
  public login(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  // Método para pegar informações do usuário
  getUser(): Observable<UserUpdate> {
    return this.http.get<UserUpdate>(this.baseUrl + 'getUser').pipe(take(1));
  }

  // Método para atualizar usuário
  updateUser(model: UserUpdate): Observable<void> {
    return this.http.put<UserUpdate>(this.baseUrl + 'updateUser', model).pipe(
      take(1),
      map((user: UserUpdate) => {
        this.setCurrentUser(user);
      })
    );
  }

  // Método para registrar usuário
  public register(model: User): Observable<void> {
    if (!model.userRoles) {
      model.userRoles = []; // Inicialize apenas se estiver indefinido
    }
    model.userRoles.push('Motorista'); // Adiciona o papel
  
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }  
  
  // Logout do usuário
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('user');
    }
    this.currentUserSource.next(null);
  }

  // Definir usuário atual
  public setCurrentUser(user: User): void {
    user.userRoles = user.userRoles || []; // Garante que userRoles não seja nulo
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSource.next(user);
  }  

  // Recupera o usuário do localStorage
  private getUserFromLocalStorage(): User | null {
    if (this.isLocalStorageAvailable()) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Verifica se o localStorage está disponível
  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  // Novo método para enviar o link de recuperação de senha
  public forgotPassword(email: string): Observable<void> {
    return this.http
      .post<void>(this.baseUrl + 'forgotpassword', { email })
      .pipe(take(1));
  }

  // Novo método para redefinir a senha
  public resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Observable<void> {
    const body = { email, token, newPassword };
    return this.http
      .post<void>(this.baseUrl + 'resetpassword', body)
      .pipe(take(1));
  }
}
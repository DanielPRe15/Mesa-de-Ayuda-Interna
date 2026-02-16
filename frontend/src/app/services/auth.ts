import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/loginResponse';
import { Register } from '../models/register';
import { Login } from '../models/login';
import { RegisterResponse } from '../models/registerResponse';
import { appSettings } from '../settings/appsettings';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = appSettings.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(data: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }

  register(data: Register): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }
}

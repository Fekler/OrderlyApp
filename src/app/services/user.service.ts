import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CreateUserDto, UpdateUserDto, UserDto, ChangePasswordDto } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/api/v1/user`;
  constructor(private http: HttpClient) { }
  getUsers(): Observable<ApiResponse<UserDto[]>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<UserDto[]>>(this.apiUrl, { headers });
  }
  createUser(user: CreateUserDto): Observable<ApiResponse<UserDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<ApiResponse<UserDto>>(this.apiUrl, user, { headers });
  }
  updateUser(user: UpdateUserDto): Observable<ApiResponse<UserDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ApiResponse<UserDto>>(`${this.apiUrl}`, user, { headers });
  }
  getUserByUuid(uuid: string): Observable<ApiResponse<UserDto>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ApiResponse<UserDto>>(`${this.apiUrl}/${uuid}`, { headers });
  }
  changePassword(user: ChangePasswordDto): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/change-password`, user, { headers });
  }
  deleteUser(uuid: string): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${uuid}`, { headers });
  }
}

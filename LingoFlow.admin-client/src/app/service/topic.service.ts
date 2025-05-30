// services/topic.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'http://localhost:5092/api/Topic';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  createTopic(topic: Omit<Topic, 'id'>): Observable<Topic> {
    return this.http.post<Topic>(this.baseUrl, topic, { headers: this.getHeaders() });
  }

  updateTopic(id: number, topic: Partial<Topic>): Observable<Topic> {
    return this.http.put<Topic>(`${this.baseUrl}/${id}`, topic, { headers: this.getHeaders() });
  }

  deleteTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}
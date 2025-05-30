// services/vocabulary.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vocabulary } from '../models/vocaabulary';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'http://localhost:5092/api/Vocabulary';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getVocabularyByTopic(topicId: number): Observable<Vocabulary[]> {
    return this.http.get<Vocabulary[]>(`${this.baseUrl}/${topicId}`, { headers: this.getHeaders() });
  }

  createVocabulary(topicId: number, vocabulary: Omit<Vocabulary, 'id'>): Observable<Vocabulary> {
    return this.http.post<Vocabulary>(`${this.baseUrl}/${topicId}`, vocabulary, { headers: this.getHeaders() });
  }

  updateVocabulary(topicId: number, vocabulary: Vocabulary): Observable<Vocabulary> {
    return this.http.put<Vocabulary>(`${this.baseUrl}/${topicId}`, vocabulary, { headers: this.getHeaders() });
  }

  deleteVocabulary(topicId: number, vocabularyId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${topicId}/${vocabularyId}`, { headers: this.getHeaders() });
  }
}
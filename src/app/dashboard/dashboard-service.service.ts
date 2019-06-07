import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {

  constructor(private http:HttpClient) { }

  getTweets(): Observable<String> {
    debugger;
    return this.http.get<String>('http://localhost:9090/asset-tracker-api//msgng-setup');
  }
  
  
  }

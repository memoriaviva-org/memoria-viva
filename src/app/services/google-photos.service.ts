// google-photos.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GooglePhotosService {

  private apiUrl = 'https://photoslibrary.googleapis.com/v1';

  constructor(private http: HttpClient) {}

  getMediaItems(accessToken: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.get(`${this.apiUrl}/mediaItems`, { headers });
  }

getPhotos(accessToken: string) {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${accessToken}`
  });

  return this.http.get('https://photoslibrary.googleapis.com/v1/mediaItems', { headers });
}

}

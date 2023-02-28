import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Simplified search service.
 */

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  text = new BehaviorSubject<string>('');
}

import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  input = '';

  constructor(private searchService: SearchService) { }

  onChange(ev) {
    this.searchService.text.next(ev);
  }
}

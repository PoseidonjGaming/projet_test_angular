import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './service/api/api.service';
import { TokenService } from './service/api/token/token.service';
import { User } from './models/user.model';
import { MatchMode } from './models/enum/MatchMode.model';
import { StringMatcher } from './models/enum/StringMatcher.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'projet_test_angular'
}

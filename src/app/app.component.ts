/**
 * It's the root component of the Angular application.
 * It represents the main container for the entire UI.
 *
 * Defines the root component (<app-root>)
 * Initializes the global UI state
 * Hosts common layouts (navbar, footer, router outlet)
 * Coordinates high-level components
 */


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, HeaderComponent]
})
export class AppComponent {
  title = 'uni-journey-frontend-app';
}

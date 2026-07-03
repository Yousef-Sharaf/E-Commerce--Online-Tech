import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet, Router, NavigationEnd} from '@angular/router';
import {HeaderComponent} from './shared/components/header.component';
import {FooterComponent} from './shared/components/footer.component';
import {filter} from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    @if (!isAdminRoute) {
      <div class="flex flex-col min-h-screen">
        <app-header></app-header>
        <div class="flex-grow">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    } @else {
      <!-- Admin layout does not use main header/footer -->
      <router-outlet></router-outlet>
    }
  `,
})
export class App {
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
    });
  }
}

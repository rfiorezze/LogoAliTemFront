import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  imports: [CommonModule, CollapseModule, BsDropdownModule, RouterModule],
  providers: [provideAnimations()],
})
export class NavComponent implements OnInit, OnDestroy {
  isCollapsed = true;

  constructor(
    public accountService: AccountService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object // Injeta o PLATFORM_ID
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Executa no navegador
      this.checkScreenSize();
      window.addEventListener('resize', this.checkScreenSize.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Remove listener no navegador
      window.removeEventListener('resize', this.checkScreenSize.bind(this));
    }
  }

  private checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      const screenWidth = window.innerWidth;
      this.isCollapsed = screenWidth >= 768; // Menu colapsado em telas maiores
    }
  }

  logout(): void {
    this.accountService.logout();
    localStorage.removeItem('dadosEstadia');
    localStorage.removeItem('retornarParaCertidao');
    this.router.navigateByUrl('/user/login');
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = "/user/login";
    }
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }
}
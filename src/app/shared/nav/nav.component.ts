import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class NavComponent implements OnInit {
  isCollapsed = true;

  constructor(
    public accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout(): void {
    this.accountService.logout();
    localStorage.removeItem('dadosEstadia');
    localStorage.removeItem('retornarParaCertidao');
    this.router.navigateByUrl('/user/login');
    window.location.href="/user/login";
  }

  showMenu(): boolean {
    return this.router.url !== '/user/login';
  }
}
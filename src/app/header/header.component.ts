import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy{
  collapsed: boolean = true;
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private dataStorage: DataStorageService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.userSubject.subscribe((user: User) => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveRecipes() {
    this.dataStorage.storeRecipes();
  }

  onFetchRecipes() {
    this.dataStorage.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MainButtonComponent } from './main-button/main-button.component';
import { AuthGuardService } from 'src/auth/auth-guard.service';
import { AuthService } from 'src/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MainButtonService } from './main-button/main-button.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainButtonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthGuardService, AuthService, MainButtonService],
  bootstrap: [AppComponent]
})
export class AppModule { }

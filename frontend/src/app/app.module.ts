import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WindowRef} from './WindowRef';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {MainButtonComponent} from './main-button/main-button.component';
import {AuthGuardService} from 'src/auth/auth-guard.service';
import {AuthService} from 'src/auth/auth.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MainButtonService} from './main-button/main-button.service';
import {DeviceComponent} from './device/device.component';
import {SpotifyApiService} from './services/spotify-api.service';
import {SearchComponent} from './components/Search/search.component';
import {TileComponent} from './components/tile/tile.component';
import {UserComponent} from './user/user.component';
import {SocketService} from './services/socket.service';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {SpotifyConnectorService} from './services/spotify-connector.service';
import {PlayerComponent} from './components/player/player.component';
import {BackgroundComponent} from './background/background.component';
import {SvgIconComponent} from './svg-icon.component';
import {environment} from 'src/environments/environment';
import {PlayerService} from './services/player.service';
import {CurrentSongComponent} from './components/current-song/current-song.component';
import {UserProfileService} from './services/user-profile.service';
import {TokenInterceptor} from './services/token-interceptor';

const socketUrl = environment.socketEndpoint !== 'heroku' ? environment.socketEndpoint : window.location.hostname;
const config: SocketIoConfig = {
  url: socketUrl, options: {
    transports: ['websocket']
  }
};

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    LoginComponent,
    HomeComponent,
    PlayerComponent,
    MainButtonComponent,
    DeviceComponent,
    SearchComponent,
    TileComponent,
    UserComponent,
    SvgIconComponent,
    CurrentSongComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    SpotifyConnectorService,
    AuthGuardService,
    AuthService,
    SpotifyApiService,
    MainButtonService,
    SocketService,
    WindowRef,
    PlayerService,
    UserProfileService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

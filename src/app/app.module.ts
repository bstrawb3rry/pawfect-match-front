import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { PetService } from './services/pet.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MyMatchesComponent } from './components/my-matches/my-matches.component';
import { MatchService } from './services/match.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { PetDetailsDialogComponent } from './components/pet-details-dialog/pet-details-dialog.component';
import { MyPetsComponent } from './components/my-pets/my-pets.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { StorageService } from './services/storage.service';
import { AddPetDialogComponent } from './components/add-pet-dialog/add-pet-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessageService } from './services/chat-message.service';
import { AddChatDialogComponent } from './components/add-chat-dialog/add-chat-dialog.component';
import { GeolocationService } from './services/geolocation.service';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatSliderModule } from '@angular/material/slider';
import { RangeSliderComponent } from './components/range-slider/range-slider.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    PhotoGalleryComponent,
    DashboardComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    MyMatchesComponent,
    PetDetailsDialogComponent,
    MyPetsComponent,
    SignupComponent,
    LoginComponent,
    AuthLayoutComponent,
    AddPetDialogComponent,
    ChatComponent,
    AddChatDialogComponent,
    ConfirmDialogComponent,
    RangeSliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSelectModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSliderModule
  ],
  providers: [PetService, MatchService, AuthService, StorageService, ChatMessageService, GeolocationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyMatchesComponent } from './components/my-matches/my-matches.component';
import { MyPetsComponent } from './components/my-pets/my-pets.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, 
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: 'my-matches', component: MyMatchesComponent },
      { path: 'my-pets', component: MyPetsComponent },
      { path: 'my-dms', component: ChatComponent }
    ]
  },
  { path: '**', redirectTo: 'login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
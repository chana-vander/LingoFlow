import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TopicsComponent } from './components/topics/topics.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'topics', component: TopicsComponent },
];

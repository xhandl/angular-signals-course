import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatSidenav, MatSidenavContainer} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import {LoadingComponent} from './loading/loading.component';
import {MessagesComponent} from './messages/messages.component';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet, MatSidenavContainer, MatSidenav, MatNavList, MatListItem, MatIcon, RouterLink, MatToolbar,
        MatIconButton, MessagesComponent, LoadingComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {


}

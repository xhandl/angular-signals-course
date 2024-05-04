import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MessagesService} from '../messages/messages.service';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'login',
    standalone: true,
    imports: [
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    fb = inject(FormBuilder);

    form = this.fb.group({
        email: [''],
        password: ['']
    });

    #messagesService = inject(MessagesService);
    #authService = inject(AuthService);

    async onLogin() {
        try {
            const {email, password} = this.form.value;

            if (!email || !password) {
                this.#messagesService.showMessage('Enter an email and password.', 'error');
                return;
            }

            await this.#authService.login(email, password);
        } catch (error) {
            console.error(error);
            this.#messagesService.showMessage('Login failed, please try again', 'error');
        }
    }
}

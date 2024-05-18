import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {User} from '../models/user.model';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';

const USER_STORAGE_KEY = 'user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    #userSignal = signal<User | null>(null);
    user = this.#userSignal.asReadonly();

    isLoggedIn = computed(() => !!this.user());

    #http = inject(HttpClient);
    #router = inject(Router);

    constructor() {
        this.loadUserFromStorage();

        effect(() => {
            const user = this.user();

            if (user) {
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            } else {
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        });
    }

    loadUserFromStorage() {
        const json = localStorage.getItem(USER_STORAGE_KEY);

        if (json) {
            const user = JSON.parse(json);

            if (user) {
                this.#userSignal.set(user);
            }
        }
    }

    async login(email: string, password: string): Promise<User> {
        const login$ = this.#http.post<User>(`${environment.apiRoot}/login`, {
            email,
            password
        });

        const user = await firstValueFrom(login$);
        this.#userSignal.set(user);
        return user;
    }

    async logout() {
        this.#userSignal.set(null);
        await this.#router.navigateByUrl('/login');
    }
}

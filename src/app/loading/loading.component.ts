import {Component, inject} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {LoadingService} from './loading.service';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    imports: [MatProgressSpinner],
    standalone: true
})
export class LoadingComponent {

    loadingService = inject(LoadingService);

    loading = this.loadingService.loading;

}

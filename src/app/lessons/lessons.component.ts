import {Component, ElementRef, inject, signal, viewChild} from '@angular/core';
import {Lesson} from '../models/lesson.model';
import {LessonDetailComponent} from './lesson-detail/lesson-detail.component';
import {LessonsService} from '../services/lessons.service';

@Component({
    selector: 'lessons',
    standalone: true,
    imports: [
        LessonDetailComponent
    ],
    templateUrl: './lessons.component.html',
    styleUrl: './lessons.component.scss'
})
export class LessonsComponent {

    mode = signal<'master' | 'detail'>('master');
    lessons = signal<Lesson[]>([]);
    selectedLesson = signal<Lesson | null>(null);

    searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

    lessonsService = inject(LessonsService);

    async ngOnInit() {
        const result = await this.lessonsService.loadLessons({});

        this.lessons.set(result);
    }

    async onSearch() {

        const query = this.searchInput().nativeElement.value;

        console.log('searching for lessons with query', query);

        const result = await this.lessonsService.loadLessons({query});

        this.lessons.set(result);
    }

    onLessonSelected(lesson: Lesson) {
        this.mode.set('detail');
        this.selectedLesson.set(lesson);
    }

    onCancel() {
        this.mode.set('master');
    }

    onLessonUpdated(lesson: Lesson) {

        this.lessons.update(lessons =>
            lessons.map(l => l.id === lesson.id ? lesson : l)
        );

        this.mode.set('master');

    }
}

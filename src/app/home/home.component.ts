import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../models/course.model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {CoursesCardListComponent} from '../courses-card-list/courses-card-list.component';
import {openEditCourseDialog} from '../edit-course-dialog/edit-course-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MessagesService} from '../messages/messages.service';
import {CoursesService} from '../services/courses.service';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {catchError, from} from 'rxjs';

@Component({
    selector: 'home',
    standalone: true,
    imports: [
        MatTabGroup,
        MatTab,
        CoursesCardListComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

    #courses = signal<Course[]>([]);

    #coursesService = inject(CoursesService);

    #matDialog = inject(MatDialog);

    beginnerCourses = computed(() => {
        const courses = this.#courses();
        return courses.filter(course => course.category === 'BEGINNER');
    });

    advancedCourses = computed(() => {
        const courses = this.#courses();
        return courses.filter(course => course.category === 'ADVANCED');
    });

    #messagesService = inject(MessagesService);

    // courses$ = toObservable(this.#courses);

    #injector = inject(Injector);

    constructor() {
        // effect(() => {
        //     console.log('Beginner courses', this.beginnerCourses());
        //     console.log('Advanced courses', this.advancedCourses());
        // });

        this.loadCourses()
            .then(() => console.log('Courses loaded: ', this.#courses()));

        // this.courses$.subscribe(courses => {
        //     console.log('courses$: ', courses);
        // });
    }

    async loadCourses() {
        try {
            const courses = await this.#coursesService.loadAllCourses();
            this.#courses.set(courses.sort(sortCoursesBySeqNo));
        } catch (error) {
            this.#messagesService.showMessage('Error loading courses!', 'error');
            console.error(error);
        }
    }

    onCourseUpdated(updatedCourse: Course) {
        const courses = this.#courses();
        const newCourses = courses.map(course =>
            course.id === updatedCourse.id ? updatedCourse : course
        );
        this.#courses.set(newCourses);
    }

    async onCourseDeleted(courseId: string) {
        try {
            await this.#coursesService.deleteCourse(courseId);

            const courses = this.#courses();
            const newCourses = courses.filter(
                course => course.id !== courseId
            );
            this.#courses.set(newCourses);
        } catch (error) {
            console.error(error);
            alert('Error deleting course!');
        }
    }


    async onAddCourse() {
        const newCourse = await openEditCourseDialog(
            this.#matDialog,
            {
                mode: 'create',
                title: 'Create Course'
            }
        );

        if (newCourse) {
            const courses = this.#courses();
            this.#courses.set([...courses, newCourse]);
        }
    }

    protected readonly toObservable = toObservable;

    toObservableExample() {
        // const courses$ = this.toObservable(this.#courses, {
        //     injector: this.#injector
        // });
        // courses$.subscribe(courses => {
        //     console.log('courses$: ', courses);
        // });

        const numbers = signal(0);

        numbers.set(1);
        numbers.set(2);
        numbers.set(3);

        const numbers$ = this.toObservable(numbers, {
            injector: this.#injector
        });

        numbers.set(4);

        numbers$.subscribe(number => {
            console.log('numbers$: ', number);
        });

        numbers.set(5);
    }

    onToSignalExample() {
        try {
            const courses$ = from(this.#coursesService.loadAllCourses())
                .pipe(
                    catchError(error => {
                        console.error('Error in catchError: ', error);
                        throw error;
                    })
                );

            const courses = toSignal(courses$, {
                injector: this.#injector
            });

            effect(() => {
                console.log('courses: ', courses());
            }, {
                injector: this.#injector
            });
        } catch (error) {
            console.error('Error in catch block: ', error);
        }
    }
}

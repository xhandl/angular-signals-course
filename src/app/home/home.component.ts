import {Component, computed, effect, inject, signal} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../models/course.model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {CoursesCardListComponent} from '../courses-card-list/courses-card-list.component';
import {CoursesService} from '../services/courses.service';
import {openEditCourseDialog} from '../edit-course-dialog/edit-course-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MessagesService} from '../messages/messages.service';

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

    constructor() {
        effect(() => {
            console.log('Beginner courses', this.beginnerCourses());
            console.log('Advanced courses', this.advancedCourses());
        });

        this.loadCourses()
            .then(() => console.log('Courses loaded: ', this.#courses()));
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
}

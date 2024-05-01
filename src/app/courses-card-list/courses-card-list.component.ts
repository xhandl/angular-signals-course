import {Component, inject, input, output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Course} from '../models/course.model';
import {openEditCourseDialog} from '../edit-course-dialog/edit-course-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'courses-card-list',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './courses-card-list.component.html',
    styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {
    courses = input.required<Course[]>();

    courseUpdated = output<Course>();

    courseDeleted = output<string>();

    #matDialog = inject(MatDialog);

    async onEditCourse(course: Course) {
        const newCourse = await openEditCourseDialog(
            this.#matDialog,
            {
                mode: 'update',
                title: 'Edit Course',
                course
            }
        );

        if (newCourse) {
            this.courseUpdated.emit(newCourse);
        }
    }

    onCourseDelete(course: Course) {
        this.courseDeleted.emit(course.id);
    }
}

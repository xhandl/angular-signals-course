import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {EditCourseDialogData} from './edit-course-dialog.data.model';
import {LoadingIndicatorComponent} from '../loading/loading.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CourseCategoryComboboxComponent} from '../course-category-combobox/course-category-combobox.component';
import {firstValueFrom} from 'rxjs';
import {Course} from '../models/course.model';
import {CoursesService} from '../services/courses.service';

@Component({
    selector: 'edit-course-dialog',
    standalone: true,
    imports: [
        LoadingIndicatorComponent,
        ReactiveFormsModule,
        CourseCategoryComboboxComponent
    ],
    templateUrl: './edit-course-dialog.component.html',
    styleUrl: './edit-course-dialog.component.scss'
})
export class EditCourseDialogComponent {

    dialogRef = inject(MatDialogRef);

    data: EditCourseDialogData = inject(MAT_DIALOG_DATA);

    fb = inject(FormBuilder);

    form = this.fb.group({
        title: [''],
        longDescription: [''],
        category: [''],
        iconUrl: ['']
    });

    #coursesService = inject(CoursesService);

    constructor() {
        this.form.patchValue({
            title: this.data?.course?.title,
            longDescription: this.data?.course?.longDescription,
            category: this.data?.course?.category,
            iconUrl: this.data?.course?.iconUrl
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    async onSave() {
        const courseProps = this.form.value as Partial<Course>;

        if (this.data.mode === 'update') {
            await this.saveCourse(this.data.course!.id, courseProps);
        }
    }

    async saveCourse(courseId: string, changes: Partial<Course>) {
        try {
            const updatedCourse = await this.#coursesService.saveCourse(courseId, changes);
            this.dialogRef.close(updatedCourse);
        } catch (error) {
            console.error(error);
            alert('Error saving course!');
        }
    }
}

export async function openEditCourseDialog(dialog: MatDialog, data: EditCourseDialogData) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.width = '400px';
    config.data = data;

    const close$ = dialog.open(EditCourseDialogComponent, config)
        .afterClosed();

    return firstValueFrom(close$);
}

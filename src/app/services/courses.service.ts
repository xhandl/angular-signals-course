import {inject, Injectable} from '@angular/core';
import {Course} from '../models/course.model';
import {HttpClient, HttpContext} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {GetCoursesResponse} from '../models/get-courses.response';
import {firstValueFrom} from 'rxjs';
import {SkipLoading} from '../loading/skip-loading.component';


@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    private http = inject(HttpClient);

    private env: any = environment;

    async loadAllCourses(): Promise<Course[]> {
        const courses$ = this.http.get<GetCoursesResponse>(
            `${this.env.apiRoot}/courses`,
            {
                context: new HttpContext().set(SkipLoading, true)
            }
        );
        const response = await firstValueFrom(courses$);
        return response.courses;
    }

    async createCourse(course: Partial<Course>): Promise<Course> {
        const course$ = this.http.post<Course>(`${this.env.apiRoot}/courses`, course);
        return firstValueFrom(course$);
    }

    async saveCourse(courseId: string, changes: Partial<Course>): Promise<Course> {
        const course$ = this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, changes);
        return firstValueFrom(course$);
    }

    async deleteCourse(courseId: string): Promise<void> {
        const delete$ = this.http.delete<void>(`${this.env.apiRoot}/courses/${courseId}`);
        return firstValueFrom(delete$);
    }
}

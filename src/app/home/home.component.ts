import {Component, computed, effect, inject, signal} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../models/course.model';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {CoursesCardListComponent} from '../courses-card-list/courses-card-list.component';
import {CoursesService} from '../services/courses.service';

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

  coursesService = inject(CoursesService);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(course => course.category === 'ADVANCED');
  });

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
      const courses = await this.coursesService.loadAllCourses();

      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      alert('Error loading courses!');
      console.error(error);
    }
  }

}

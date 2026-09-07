// features/catalog/pages/curriculum/curriculum.page.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CurriculumService } from '../../services/curriculum.service';
import { CourseCatalogItem } from '../../models/course-catalog.model';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  templateUrl: './curriculum.page.html',
  styleUrls: ['./curriculum.page.scss'],
  imports: [CommonModule, RouterModule]
})
export class CurriculumPage implements OnInit {

  degreeCourseName = '';
  courses = signal<CourseCatalogItem[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly curriculumService: CurriculumService
  ) {}

  ngOnInit(): void {
    this.degreeCourseName = this.route.snapshot.paramMap.get('degreeCourseName') ?? '';
    if (!this.degreeCourseName) {
      this.errorMessage.set('No degree course specified.');
      this.isLoading.set(false);
      return;
    }
    this.load();
  }

  totalCfu(): number {
    return this.courses().reduce((sum, c) => sum + c.cfu, 0);
  }

  private load(): void {
    this.curriculumService.getCoursesByDegreeCourse(this.degreeCourseName).subscribe({
      next: result => {
        this.courses.set(result.content);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load curriculum.');
        this.isLoading.set(false);
      }
    });
  }
}

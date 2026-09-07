import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { StudyPlanDto } from "../../study_plan/models/study-plan.model";
import { StudyPlanService } from "../../study_plan/services/study-plan.service";


@Component({
  selector: 'app-courses-read',
  standalone: true,
  templateUrl: './courses-read.page.html',
  styleUrls: ['./courses-read.page.scss'],
  imports: [CommonModule, RouterModule]
})
export class CoursesReadPage implements OnInit {

  studyPlan = signal<StudyPlanDto | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(private readonly studyPlanService: StudyPlanService) {}

  ngOnInit(): void {
    this.studyPlanService.getStudyPlan().subscribe({
      next: (plan: any) => {
        this.studyPlan.set(plan);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load your study plan.');
        this.isLoading.set(false);
      }
    });
  }

  totalCfu(): number {
    return this.studyPlan()?.courses.reduce((sum: any, c: { cfu: any; }) => sum + c.cfu, 0) ?? 0;
  }
}

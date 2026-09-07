import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DegreeCourse } from "../../../degree_course/models/degree-course.model";
import { RouterModule } from "@angular/router";
import { ThemeService } from "../../../../core/services/theme/theme.service";
import { CatalogService } from "../../services/catalog.service";

@Component({
  standalone: true,
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  imports: [CommonModule, RouterModule]
})
export class CatalogPage implements OnInit {

  degreeCourses: DegreeCourse[] = [];

  constructor(
    private readonly service: CatalogService,
    private readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.service.getCatalog().subscribe({
      next: (courses: DegreeCourse[]) => this.degreeCourses = courses
    });
  }

  get darkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}

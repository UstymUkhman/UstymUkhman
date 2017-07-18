import { Component, EventEmitter, ElementRef } from '@angular/core';
import { Http                                } from '@angular/http';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  selector: 'my-works',
  templateUrl: 'components/my-works/my-works.component.html'
})


export class MyWorksComponent {
  constructor(works, http, lettering) {
    this.projectIndex     = -1;
    this.listOffset       = 0;
    this.worksList        = [];
    this.projects         = [];

    this.fadeOut          = false;
    this.goToMenu         = false;
    this.startRaining     = false;
    this.skipLettering    = false;
    this.showBackButton   = false;
    this.activeBackButton = false;
    this.showWorksCounter = false;

    this.http             = http;
    this.lettering        = lettering;
    this.worksElement     = works.nativeElement;
    this.projectsFile     = 'assets/projects.json';

    this.getWorksList();
  }

  getWorksList() {
    this.http
      .get(this.projectsFile)
      .subscribe(
        res      => this.projects = res.json().projects,
        error    => console.error(error),
        complete => this.showWorksList()
      );
  }

  showWorksList() {
    for (let i = 0; i < this.projects.length; i++) {
      let project = Object.keys(this.projects[i])[0];

      this.worksList.push({
        name : project,
        url  : this.projects[i][project]
      });
    }

    setTimeout(() => {
      this.projectsSources = this.worksElement.getElementsByClassName('project-source');
      this.lastScrollingProject = this.projects.length - 4;
      this.lastProject = this.projects.length - 1;
      this.prepareWorksList();
    });
  }

  prepareWorksList() {
    if (++this.projectIndex < this.worksList.length) {
      const cbDelay = this.skipLettering ? 0 : 1000;

      this.lettering.animate(
        this.projectsSources[this.projectIndex].children[1],
        50, this.prepareWorksList.bind(this), cbDelay
      );

      if (this.skipLettering) {
        this.lettering.skipLettering();
      }

    } else {
      this.currentWork    = 0;
      this.showBackButton = true;

      setTimeout(() => {
        this.startRaining     = true;
        this.showWorksCounter = true;
      }, 1000);
    }
  }

  setProjectsNavigation(event) {
    if (!this.startRaining) {
      this.skipLettering = true;
      return;
    }

    const code    = event.keyCode,
          project = this.currentWork;

    if (!this.checkValidCode(code)) {
      return;

    } else if (this.activeBackButton && code === 13) {
      this.removeProjectsSection();
      return;

    } else if (this.activeBackButton) {
      this.currentWork = (code === 38) ? 0 : this.lastProject;
      this.activeBackButton = false;

    } else {
      this.activeBackButton = ((this.currentWork === this.lastProject && code === 40) || (!this.currentWork && code === 38));
    }

    if (code === 13)
      window.open(this.worksList[project].url, '_blank');

    else if (code === 38)
      this.currentWork = (!this.currentWork) ? this.lastProject : this.currentWork - 1;

    else if (code === 40)
      this.currentWork = (this.currentWork === this.lastProject) ? 0 : this.currentWork + 1;

    if (this.projects.length > 5) {
      this.listOffset = (this.currentWork < this.lastScrollingProject)
        ? `${this.currentWork * -this.listStep}px`
        : this.listOffset;

    } else {
      this.listOffset = '50%';
    }

    if (this.activeBackButton) {
      this.listOffset = `${(this.lastScrollingProject - 1) * -this.listStep}px`;
      this.currentWork = -1;
    }
  }

  checkValidCode(code) {
    return (code === 13 || code === 38 || code === 40)
  }

  removeProjectsSection() {
    this.goToMenu = true;
    document.removeEventListener('keydown', this.projectsNavigation, false);

    setTimeout(() => {
      this.fadeOut          = true;
      this.startRaining     = false;
      this.removeMatrixRain = true;
    }, 3500);
  }

  onResizeHandler() {
    this.listStep = window.innerHeight * 0.15 + 21;
  }

  ngAfterViewInit() {
    this.onResizeHandler();
    this.onResize = this.onResizeHandler.bind(this);
    this.projectsNavigation = this.setProjectsNavigation.bind(this);

    window.addEventListener('resize', this.onResize, false);
    document.addEventListener('keydown', this.projectsNavigation, false);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize, false);
    document.removeEventListener('keydown', this.projectsNavigation, false);
  }

  static get parameters() {
    return [[ElementRef], [Http], [LetteringService]];
  }
}

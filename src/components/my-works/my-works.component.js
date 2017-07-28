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
    this.isMobile         = isMobile;
    this.lettering        = lettering;
    this.worksElement     = works.nativeElement;

    this.getWorksList();
  }

  getWorksList() {
    this.http
      .get('assets/projects.json')
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

    if (this.projects.length < 6) {
      this.listOffset = '-50%';
    }

    setTimeout(() => {
      this.projectsSources = this.worksElement.getElementsByClassName('project-source');
      this.lastScrollingProject = this.projects.length - (isMobile ? 5 : 4);
      this.lastProject = this.projects.length - 1;

      this.createClickHandlers();
      this.prepareWorksList();
    });
  }

  prepareWorksList(endAnimation = false) {
    if (!endAnimation) {
      const delay = this.skipLettering ? 0 : 1000;

      setTimeout(() => {
        const currentIndex   = this.projectIndex,
              nextIndex      = ++this.projectIndex,
              lastProject    = this.lastScrollingProject - (isMobile ? 0 : 1),
              scrollableList = this.projects.length > 5 && currentIndex < lastProject;

        if (!this.projectsSources[nextIndex]) {
          this.prepareWorksList(true);
          return;
        }

        if (!this.skipLettering && scrollableList) {
          this.listOffset = `${nextIndex * -this.listStep}px`;
        }

        this.lettering.animate(
          this.projectsSources[nextIndex].children[1],
          50, this.prepareWorksList.bind(this), 0
        );

        if (this.skipLettering) {
          this.lettering.skipLettering();
          this.prepareWorksList();
        }
      }, delay);

    } else if (!this.showBackButton) {
      const buttonDelay = this.skipLettering ? 500 : 0;

      setTimeout(() => {
        this.showBackButton = true;
      }, buttonDelay);

      setTimeout(() => {
        this.startRaining     = true;
        this.showWorksCounter = true;
        this.currentWork      = isMobile ? null : 0;
        this.listOffset       = this.projects.length < 6 ? '-50%' : 0;
      }, buttonDelay + 1000);
    }
  }

  openProjectLink(project) {
    window.open(this.worksList[project].url, '_blank');
  }

  setProjectsNavigation(event) {
    if (!this.startRaining) {
      this.lettering.skipLettering();
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
      this.openProjectLink(project);

    else if (code === 38)
      this.currentWork = (!this.currentWork) ? this.lastProject : this.currentWork - 1;

    else if (code === 40)
      this.currentWork = (this.currentWork === this.lastProject) ? 0 : this.currentWork + 1;

    if (this.projects.length > 5) {
      this.listOffset = (this.currentWork < this.lastScrollingProject)
        ? `${this.currentWork * -this.listStep}px`
        : this.listOffset;

    } else {
      this.listOffset = '-50%';
    }

    if (this.activeBackButton) {
      if (this.projects.length > 5) {
        this.listOffset = `${(this.lastScrollingProject - 1) * -this.listStep}px`;
      }

      this.currentWork = -1;
    }
  }

  checkValidCode(code) {
    return (code === 13 || code === 38 || code === 40)
  }

  removeProjectsSection() {
    this.goToMenu = true;

    this.removeClickHandlers();
    window.removeEventListener('resize', this.onResize, false);
    document.removeEventListener('keydown', this.projectsNavigation, false);

    setTimeout(() => {
      this.fadeOut          = true;
      this.startRaining     = false;
      this.removeMatrixRain = true;
    }, 3500);
  }

  createClickHandlers() {
    if (isMobile) {
      for (let i = 0; i < this.projectsSources.length; i++) {
        this.projectsSources[i].addEventListener('click', this.setClickHandler.bind(this, i));
      }

      this.onClick = this.setClickHandler.bind(this);
      document.addEventListener('click', this.onClick, true);
    }
  }

  removeClickHandlers() {
    if (isMobile && this.projectsSources.length) {
      for (let i = 0; i < this.projectsSources.length; i++) {
        this.projectsSources[i].removeEventListener('click', this.setClickHandler.bind(this, i));
      }

      document.removeEventListener('click', this.onClick, true);
    }
  }

  setClickHandler(index) {
    if (typeof index !== 'number') {
      this.setProjectsNavigation({ keyCode: 0 });
      return;
    }

    this.currentWork = index;
    setTimeout(() => { this.openProjectLink(index); }, 400);
  }

  onResizeHandler() {
    this.listStep = window.innerHeight * 0.14 + 21;
  }

  ngAfterViewInit() {
    this.onResizeHandler();
    this.onResize = this.onResizeHandler.bind(this);
    this.projectsNavigation = this.setProjectsNavigation.bind(this);

    window.addEventListener('resize', this.onResize, false);
    document.addEventListener('keydown', this.projectsNavigation, false);
  }

  ngOnDestroy() {
    this.removeClickHandlers();
    window.removeEventListener('resize', this.onResize, false);
    document.removeEventListener('keydown', this.projectsNavigation, false);
  }

  static get parameters() {
    return [[ElementRef], [Http], [LetteringService]];
  }
}

import { Component, EventEmitter, ElementRef } from '@angular/core';
import { Http                                } from '@angular/http';
import { LetteringService                    } from '../../services/lettering.service';


@Component({
  selector: 'experiments',
  templateUrl: 'components/experiments/experiments.component.html'
})


export class ExperimentsComponent {
  constructor(experiments, http, lettering) {
    this.fadeOut            = false;
    this.goToMenu           = false;
    this.startRaining       = false;
    this.skipLettering      = false;
    this.showBackButton     = false;
    this.activeBackButton   = false;

    this.projectIndex       = -1;
    this.listOffset         = 0;
    this.experiments        = [];
    this.experimentsList    = [];
    this.http               = http;
    this.lettering          = lettering;
    this.experimentsElement = experiments.nativeElement;

    this.getExperimentsList();
  }

  getExperimentsList() {
    this.http
      .get('assets/experiments.json')
      .subscribe(
        res      => this.experiments = res.json().experiments,
        error    => console.error(error),
        complete => this.showExperimentsList()
      );
  }

  showExperimentsList() {
    for (let i = 0; i < this.experiments.length; i++) {
      let experiment = Object.keys(this.experiments[i])[0];

      this.experimentsList.push({
        name : experiment,
        url  : this.experiments[i][experiment]
      });
    }

    if (this.experiments.length < 6) {
      this.listOffset = '-50%';
    }

    setTimeout(() => {
      this.experimentsSources = this.experimentsElement.getElementsByClassName('experiment-source');
      this.lastScrollingProject = this.experiments.length - 4;
      this.lastProject = this.experiments.length - 1;
      this.prepareExperimentsList();
    });
  }

  prepareExperimentsList(endAnimation = false) {
    if (!endAnimation) {
      const delay = this.skipLettering ? 0 : 1000;

      setTimeout(() => {
        const currentIndex   = this.projectIndex,
              nextIndex      = ++this.projectIndex,
              scrollableList = this.experiments.length > 5 && currentIndex < this.lastScrollingProject;

        if (!this.experimentsSources[nextIndex]) {
          this.prepareExperimentsList(true);
          return;
        }

        if (!this.skipLettering && scrollableList) {
          this.listOffset = `${nextIndex * -this.listStep}px`;
        }

        this.lettering.animate(
          this.experimentsSources[nextIndex].children[1],
          50, this.prepareExperimentsList.bind(this), 0
        );

        if (this.skipLettering) {
          this.lettering.skipLettering();
          this.prepareExperimentsList();
        }
      }, delay);

    } else if (!this.showBackButton) {
      this.showBackButton = true;

      setTimeout(() => {
        this.listOffset   = 0;
        this.startRaining = true;
      }, 1000);
    }
  }

  removeExperimentsSection() {
    this.goToMenu = true;

    setTimeout(() => {
      this.fadeOut          = true;
      this.startRaining     = false;
      this.removeMatrixRain = true;
    }, 3500);
  }

  setClickHandler() {
    this.lettering.skipLettering();
    this.skipLettering = true;
    this.listOffset = 0;
  }

  ngAfterViewInit() {
    this.onClick = this.setClickHandler.bind(this);
    document.addEventListener('click', this.onClick, false);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onClick, false);
  }

  static get parameters() {
    return [[ElementRef], [Http], [LetteringService]];
  }
}

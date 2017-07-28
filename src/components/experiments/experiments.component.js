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

    this.listOffset         = 0;
    this.experimentIndex    = -1;
    this.experiments        = [];
    this.experimentsList    = [];
    this.currentExperiment  = null;

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
      this.lastScrollingProject = this.experiments.length - 5;
      this.lastProject = this.experiments.length - 1;

      this.createClickHandlers();
      this.prepareExperimentsList();
    });
  }

  prepareExperimentsList(endAnimation = false) {
    if (!endAnimation) {
      const delay = this.skipLettering ? 0 : 1000;

      setTimeout(() => {
        const currentIndex   = this.experimentIndex,
              nextIndex      = ++this.experimentIndex,
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
      const buttonDelay = this.skipLettering ? 500 : 0;

      setTimeout(() => {
        this.showBackButton = true;
      }, buttonDelay);

      setTimeout(() => {
        this.startRaining = true;
        this.listOffset   = this.experiments.length < 6 ? '-50%' : 0;
      }, buttonDelay + 1000);
    }
  }

  removeExperimentsSection() {
    this.goToMenu = true;
    this.removeClickHandlers();
    window.removeEventListener('resize', this.onResize, false);

    setTimeout(() => {
      this.fadeOut          = true;
      this.startRaining     = false;
      this.removeMatrixRain = true;
    }, 3500);
  }

  createClickHandlers() {
    for (let i = 0; i < this.experimentsSources.length; i++) {
      this.experimentsSources[i].addEventListener('click', this.setClickHandler.bind(this, i));
    }

    document.addEventListener('click', this.setClickHandler.bind(this));
  }

  removeClickHandlers() {
    if (this.experimentsSources.length) {
      for (let i = 0; i < this.experimentsSources.length; i++) {
        this.experimentsSources[i].removeEventListener('click', this.setClickHandler.bind(this, i));
      }

      document.removeEventListener('click', this.setClickHandler.bind(this));
    }
  }

  setClickHandler(index) {
    const isExperiment = typeof index === 'number';

    if (isExperiment) {
      this.currentExperiment = index;
      setTimeout(() => { window.open(this.experimentsList[index].url, '_blank'); }, 400);

    } else if (!isExperiment && !this.startRaining) {
      this.lettering.skipLettering();
      this.skipLettering = true;
    }
  }

  setResizeHandler() {
    this.listStep = window.innerHeight * 0.14 + 21;
  }

  ngAfterViewInit() {
    this.setResizeHandler();
    this.onResize = this.setResizeHandler.bind(this);

    window.addEventListener('resize', this.onResize, false);
  }

  ngOnDestroy() {
    this.removeClickHandlers();
    window.removeEventListener('resize', this.onResize, false);
  }

  static get parameters() {
    return [[ElementRef], [Http], [LetteringService]];
  }
}

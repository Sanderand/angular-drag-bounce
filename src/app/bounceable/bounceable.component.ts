import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { BOUNCEABLE_CFG } from './bounceable.tokens';
import { BounceableConfig } from './bounceable.config';
import { BounceableService } from './bounceable.service';
import { Vector } from './vector.class';

@Component({
    selector: 'as-bounceable',
    template: '<ng-content></ng-content>',
    styleUrls: ['./bounceable.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BounceableComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding('style.transform') public get translation (): string {
      return `translate3d(${ this.position.x }px, ${ this.position.y }px, 0px)`;
    }

    @Input() public position = new Vector();
    @Input() public momentum = new Vector();

    public width: number;
    public height: number;
    public weight: number;

    public isMoving: boolean;
    public isDragging: boolean;

    constructor (
      @Inject(BOUNCEABLE_CFG) private _bounceableConfig: any,
      private _bounceableService: BounceableService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _elementRef: ElementRef,
    ) {}

    public ngOnInit (): void {
        this._bounceableService.register(this);
        this._changeDetectorRef.detach();
    }

    public ngAfterViewInit (): void {
      this.width = this._elementRef.nativeElement.offsetWidth;
      this.height = this._elementRef.nativeElement.offsetHeight;
      this.weight = this.width * this.height;
    }

    public ngOnDestroy (): void {
        this._bounceableService.unregister(this);
    }

    public onMouseDown ($event: Event): void {
        this.isDragging = false;

        if (this._elementRef.nativeElement.contains($event.target)) {
          $event.preventDefault();
          this.isDragging = true;
        }
    }

    public onMouseUp (momentum: Vector): void {
        if (!this.isDragging) {
          return;
        }

        this.momentum = Object.assign({}, momentum);
        this.isMoving = true;
        this.isDragging = false;
    }

    public step (isColliding?: boolean): void {
      if (!this.isMoving) {
        return;
      }

      this.handleTooFarLeftOrRight();
      this.handleTooFarUpOrDown();

      if (!isColliding) {
        this.applyAirFriction();
      }

      this.updatePosition();
    }

    private handleTooFarLeftOrRight (): void {
        const left = this.position.x;
        const right = this.position.x + this.width;

        if (left < 0) {
            this.position.x = 0;
            this.momentum.x *= -this._bounceableConfig.edgeBounceFrictionFactor;
        }

        if (right > window.innerWidth) {
            this.position.x = window.innerWidth - this.width;
            this.momentum.x *= -this._bounceableConfig.edgeBounceFrictionFactor;
        }
    }

    private handleTooFarUpOrDown (): void {
        const top = this.position.y;
        const bottom = this.position.y + this.height;

        if (top < 0) {
            this.position.y = 0;
            this.momentum.y *= -this._bounceableConfig.edgeBounceFrictionFactor;
        }

        if (bottom > window.innerHeight) {
            this.position.y = window.innerHeight - this.height;
            this.momentum.y *= -this._bounceableConfig.edgeBounceFrictionFactor;
        }
    }

    private applyAirFriction (): void {
        this.momentum.x *= this._bounceableConfig.airFrictionFactor;
        this.momentum.y *= this._bounceableConfig.airFrictionFactor;

        if (Math.abs(this.momentum.x) < this._bounceableConfig.momentumNullThreshold) { this.momentum.x = 0; }
        if (Math.abs(this.momentum.y) < this._bounceableConfig.momentumNullThreshold) { this.momentum.y = 0; }

        this.isMoving = !(this.momentum.x === 0 && this.momentum.y === 0);
    }

    private updatePosition (): void {
        this.position.x += this.momentum.x;
        this.position.y += this.momentum.y;
    }
}

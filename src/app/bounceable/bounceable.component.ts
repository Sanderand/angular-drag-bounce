import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

import { BounceableService } from './bounceable.service';
import { Vector } from './vector.class';

const FRICTION_FACTOR = 0.9;
const MOMENTUM_TURN_OFF_THRESHOLD = 0.5;
const BOUNCE_REVERSE_FACTOR = -0.5;

@Component({
    selector: 'as-bounceable',
    template: '<ng-content></ng-content>',
    styleUrls: ['./bounceable.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BounceableComponent implements OnInit {
    @HostBinding('style.left.px') public get left (): number { return this.position.x; };
    @HostBinding('style.top.px') public get top (): number { return this.position.y; };

    // @HostBinding('style.width.px')
    public get width (): number { return +this._elementRef.nativeElement.offsetWidth; }
    public get height (): number { return +this._elementRef.nativeElement.offsetHeight; }

    @Input() public position = new Vector();
    @Input() public momentum = new Vector();

    public isMoving: boolean = false;
    public isDragging: boolean = false;

    constructor (
      private _elementRef: ElementRef,
      private _bounceableService: BounceableService
    ) {}

    public ngOnInit (): void {
        this._bounceableService.register(this);
    }

    public get weight (): number {
      return this.width * this.height;
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
        this.applyFriction();
      }

      this.updatePosition();
    }

    private handleTooFarLeftOrRight (): void {
        let actualWidth = this._elementRef.nativeElement.offsetWidth;
        let left = this.position.x;
        let right = this.position.x + actualWidth;

        if (left < 0) {
            this.position.x = 0;
            this.momentum.x *= BOUNCE_REVERSE_FACTOR;
        }

        if (right > window.innerWidth) {
            this.position.x = window.innerWidth - actualWidth;
            this.momentum.x *= BOUNCE_REVERSE_FACTOR;
        }
    }

    private handleTooFarUpOrDown (): void {
        let top = this.position.y;
        let bottom = this.position.y + this.height;

        if (top < 0) {
            this.position.y = 0;
            this.momentum.y *= BOUNCE_REVERSE_FACTOR;
        }

        if (bottom > window.innerHeight) {
            this.position.y = window.innerHeight - this.height;
            this.momentum.y *= BOUNCE_REVERSE_FACTOR;
        }
    }

    private applyFriction (): void {
        this.momentum.x *= FRICTION_FACTOR;
        this.momentum.y *= FRICTION_FACTOR;

        if (Math.abs(this.momentum.x) < MOMENTUM_TURN_OFF_THRESHOLD) { this.momentum.x = 0; }
        if (Math.abs(this.momentum.y) < MOMENTUM_TURN_OFF_THRESHOLD) { this.momentum.y = 0; }

        this.isMoving = !(this.momentum.x === 0 && this.momentum.y === 0);
    }

    private updatePosition (): void {
        this.position.x += this.momentum.x;
        this.position.y += this.momentum.y;
    }
}

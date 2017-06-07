import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { BounceableService } from './bounceable.service';

import { BOUNCEABLE_CFG } from './bounceable.tokens';
import { CollisionService } from './collision.service';
import { Vector } from './vector.class';

@Component({
    selector: 'as-bounceable',
    template: '<ng-content></ng-content>',
    styleUrls: ['./bounceable.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BounceableComponent implements OnInit, AfterViewInit, OnDestroy {
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
        private _collisionService: CollisionService,
        private _elementRef: ElementRef
    ) {}

    public ngOnInit (): void {
        this._bounceableService.register(this);
        this._changeDetectorRef.detach();
    }

    public ngAfterViewInit (): void {
        this.width = this._elementRef.nativeElement.offsetWidth;
        this.height = this._elementRef.nativeElement.offsetHeight;
        this.weight = this.width * this.height;
        this.updatePosition();
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

    public step (): void {
        if (!this.isMoving) {
            return;
        }

        this.handleCollisions();
        this.handleOutOfContainerBounds();
        this.applyAirFriction();
        this.updatePosition();
    }

    private handleCollisions (): void {
        this._bounceableService.getItems()
            .filter(item => item !== this)
            .filter(item => this._collisionService.doItemsCollide(item, this))
            .forEach(item => this.respondToCollisionWithItem(item));
    }

    private handleOutOfContainerBounds (): void {
        const left = this.position.x;
        const right = this.position.x + this.width;
        const top = this.position.y;
        const bottom = this.position.y + this.height;

        if (left < 0) {
            this.position.x = 0;
            this.momentum.x *= -this._bounceableConfig.edgeBounceFrictionFactor;
        }

        if (right > document.body.clientWidth) {
            this.position.x = document.body.clientWidth - this.width;
            this.momentum.x *= -this._bounceableConfig.edgeBounceFrictionFactor;
        }

        if (top < 0) {
            this.position.y = 0;
            this.momentum.y *= -this._bounceableConfig.edgeBounceFrictionFactor;
        }

        if (bottom > document.body.clientHeight) {
            this.position.y = document.body.clientHeight - this.height;
            this.momentum.y *= -this._bounceableConfig.edgeBounceFrictionFactor;
        }
    }

    private respondToCollisionWithItem (item: BounceableComponent): void {
        const overlap = this._collisionService.getItemsOverlap(item, this);
        const forItemWeightRatio = this.weight / (this.weight + item.weight);
        const itemWeightRatio = 1 - forItemWeightRatio;
        const collisionMomentum: Vector = {
            x: this.momentum.x + item.momentum.x,
            y: this.momentum.y + item.momentum.y
        };

        // reset position to collision point
        let momentumReverseFactor = Math.abs(
            Math.abs(this.momentum.x) > Math.abs(this.momentum.y)
            ? overlap.x / this.momentum.x
            : overlap.y / this.momentum.y
        );

        this.position.x -= this.momentum.x * momentumReverseFactor;
        this.position.y -= this.momentum.y * momentumReverseFactor;

        // update momentum for both items
        this.momentum.x = -this.momentum.x * itemWeightRatio;
        this.momentum.y = -this.momentum.y * itemWeightRatio;
        item.momentum.x = item.momentum.x + collisionMomentum.x * forItemWeightRatio;
        item.momentum.y = item.momentum.y + collisionMomentum.y * forItemWeightRatio;

        item.isMoving = true;
    }

    private applyAirFriction (): void {
        this.momentum.x *= this._bounceableConfig.airFrictionFactor;
        this.momentum.y *= this._bounceableConfig.airFrictionFactor;

        if (Math.abs(this.momentum.x) < this._bounceableConfig.momentumNullThreshold) {
            this.momentum.x = 0;
        }
        if (Math.abs(this.momentum.y) < this._bounceableConfig.momentumNullThreshold) {
            this.momentum.y = 0;
        }

        this.isMoving = !(this.momentum.x === 0 && this.momentum.y === 0);
    }

    private updatePosition (): void {
        this.position.x += this.momentum.x;
        this.position.y += this.momentum.y;

        this._elementRef.nativeElement.style.transform = `translate3d(${ this.position.x }px, ${ this.position.y }px, 0px)`;
    }
}

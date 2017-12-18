import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	ViewEncapsulation,
	OnChanges,
	SimpleChanges
} from '@angular/core';
import { BounceableService } from './bounceable.service';

import { BOUNCEABLE_CFG } from './bounceable.tokens';
import { CollisionService } from './collision.service';
import { Vector } from './vector.class';

@Component({
	selector: 'as-bounceable',
	template: '<ng-content></ng-content>',
	styleUrls: [ 'bounceable.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class BounceableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
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

	public ngOnChanges (changes: SimpleChanges): void {
		const { position, momentum } = changes;

		if (position && position.currentValue) {
			this.position = new Vector(position.currentValue.x, position.currentValue.y);
		}

		if (momentum && momentum.currentValue) {
			this.momentum = new Vector(momentum.currentValue.x, momentum.currentValue.y);
		}
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

		this.momentum = new Vector(momentum.x, momentum.y);
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

	public get bottom (): number {
		return this.position.y + this.height;
	}

	public get top (): number {
		return this.position.y;
	}

	public get right (): number {
		return this.position.x + this.width;
	}

	public get left (): number {
		return this.position.x;
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
		const overlapVector = this._collisionService.getItemsOverlap(this, item);
		const overlapRatioX = Math.abs(overlapVector.x / this.momentum.x);
		const overlapRatioY = Math.abs(overlapVector.y / this.momentum.y);
		const itemWeightRatio = this.weight / (this.weight + item.weight);
		const thisWeightRatio = 1 - itemWeightRatio;
		const totalImpulse = new Vector(this.momentum.x + item.momentum.x, this.momentum.y + item.momentum.y);
		const itemImpulse = new Vector(totalImpulse.x * itemWeightRatio, totalImpulse.y * itemWeightRatio);
		const thisImpulse = new Vector(totalImpulse.x * thisWeightRatio, totalImpulse.y * thisWeightRatio);
		const setBackVector = new Vector(this.momentum.x, this.momentum.y);

		setBackVector.multiply((Math.abs(overlapRatioX) < Math.abs(overlapRatioY) ? overlapRatioX : overlapRatioY) * -1.001);
		this.position.add(setBackVector.x, setBackVector.y);
		this.momentum.set(-thisImpulse.x, -thisImpulse.y);
		item.momentum.add(itemImpulse.x, itemImpulse.y);
		item.isMoving = true;
	}

	private applyAirFriction (): void {
		this.momentum.multiply(this._bounceableConfig.airFrictionFactor);

		if (Math.abs(this.momentum.x) < this._bounceableConfig.momentumNullThreshold) {
			this.momentum.x = 0;
		}

		if (Math.abs(this.momentum.y) < this._bounceableConfig.momentumNullThreshold) {
			this.momentum.y = 0;
		}

		this.isMoving = !(this.momentum.x === 0 && this.momentum.y === 0);
	}

	private updatePosition (): void {
		this.position.add(this.momentum.x, this.momentum.y);
		this._elementRef.nativeElement.style.transform = `translate3d(${ this.position.x }px, ${ this.position.y }px, 0px)`;
	}
}

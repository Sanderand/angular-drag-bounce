import { Inject, Injectable } from '@angular/core';
import 'rxjs/add/observable/interval';
import { BounceableComponent } from './bounceable.component';

import { BOUNCEABLE_CFG } from './bounceable.tokens';
import { Vector } from './vector.class';

@Injectable()
export class BounceableService {
	private _items: Array<BounceableComponent> = [];
	private _dragStart: Vector = new Vector();
	private _timeUntilNextRenderMS: number;
	private _nextRenderTimeout: any;

	constructor (
		@Inject(BOUNCEABLE_CFG) private _bounceableConfig: any
	) {
		this._timeUntilNextRenderMS = 1000 / this._bounceableConfig.framesPerSecond;
		this.setupListeners();
	}

	public register (item: BounceableComponent): void {
		this._items.push(item);
		this.forceUpdate();
	}

	public unregister (item: BounceableComponent): void {
		this._items = this._items.filter(i => i !== item);
	}

	public getItems (): Array<BounceableComponent> {
		return this._items;
	}

	private step (): void {
		this.clearTimeout();

		this._items.forEach(item => item.step());

		if (this.itemsAreStillMoving()) {
			this._nextRenderTimeout = setTimeout(() => this.step(), this._timeUntilNextRenderMS);
		}
	}

	private forceUpdate (): void {
		if (!this._nextRenderTimeout) {
			this.step();
		}
	}

	private clearTimeout (): void {
		clearTimeout(this._nextRenderTimeout);
		this._nextRenderTimeout = null;
	}

	private setupListeners (): void {
		document.addEventListener('mousedown', this.onMouseDown);
		document.addEventListener('mouseup', this.onMouseUp);
	}

	private onMouseDown = ($event: MouseEvent): void => {
		this._dragStart = new Vector($event.clientX, $event.clientY);
		this._items.forEach(i => i.onMouseDown($event));
	};

	private onMouseUp = ($event: MouseEvent): void => {
		const momentum = new Vector(
			($event.clientX - this._dragStart.x) * this._bounceableConfig.momentumSlowDownFactor,
			($event.clientY - this._dragStart.y) * this._bounceableConfig.momentumSlowDownFactor
		);

		this._items.forEach(i => i.onMouseUp(momentum));

		this.forceUpdate();
	};

	private itemsAreStillMoving (): boolean {
		return this._items.some(i => i.isMoving);
	}
}

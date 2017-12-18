export class Vector {
	public x: number;
	public y: number;

	constructor (
		x: number = 0,
		y: number = 0
	) {
		this.x = x;
		this.y = y;
	}

	public get length (): number {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}

	public set (x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	public normalize (): void {
		this.multiply(1 / this.length);
	}

	public add (x: number, y: number): void {
		this.x += x;
		this.y += y;
	}

	public subtract (x: number, y: number): void {
		this.add(-x, -y)
	}

	public multiply (factor: number): void {
		this.x *= factor;
		this.y *= factor;
	}

	public divide (factor: number): void {
		this.multiply(1 / factor);
	}
}

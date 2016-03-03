import {Component} from 'angular2/core';
import {Route} from '../../model/Route';
import {NgClass, NgIf} from 'angular2/common';

@Component({
    templateUrl: 'app/components/m307/m307.html',
    directives: [
    	NgClass,
    	NgIf
    ]
})
export class M307Component {
	public static routes: Route[] = [
		new Route('JS-Form', 'php/js-form'),
		new Route('Use Case 1', 'php/uc1'),
		new Route('Use Case 2', 'php/uc2'),
		new Route('Test Result', 'php/test')
	];
	public routes: Route[] = M307Component.routes;
	public currentRoutes: Route[] = [];
	public isFrameFullscreen: boolean;

	constructor() {
		this.loadRoute(this.routes[0]);
		this.isFrameFullscreen = false;
	}

	public loadRoute(route: Route): void {
		let index: number = 0;

		for (let i = 0; i < this.routes.length; i++) {
			if(this.routes[i] == route) {
				index = i;
				break;
			}
		}

		this.currentRoutes[1] = this.routes[index];
		if (index === 0) {
			this.currentRoutes[0] = this.routes[this.routes.length - 1];
		} else {
			this.currentRoutes[0] = this.routes[index - 1];
		}

		if (index === this.routes.length - 1) {
			this.currentRoutes[2] = this.routes[0];
		} else {
			this.currentRoutes[2] = this.routes[index + 1];
		}
	}

	public toggleFullscreen(): void {
		this.isFrameFullscreen = !this.isFrameFullscreen;
	}
}

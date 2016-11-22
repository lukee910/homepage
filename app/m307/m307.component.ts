import {Component} from '@angular/core';
import {Route} from '../model/Route';
import {NgClass} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    templateUrl: 'app/m307/m307.html',
    directives: [
    	NgClass
    ]
})
export class M307Component {
	public static routes: Route[] = [
		new Route('JS-Form', 'js-form'),
		new Route('Use Case 1', 'uc1'),
		new Route('Use Case 2', 'uc2'),
		new Route('Test Result', 'test')
	];
	public routes: Route[] = M307Component.routes;
	public currentRoutes: Route[] = [];
	public currentUrl: SafeResourceUrl;
	public isFrameFullscreen: boolean;

	constructor(private domSanitizer: DomSanitizer) {
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

		this.currentUrl =
            this.domSanitizer.bypassSecurityTrustResourceUrl('http://php.lukee910.ch/' + this.currentRoutes[1].path);
	}

	public toggleFullscreen(): void {
		this.isFrameFullscreen = !this.isFrameFullscreen;
	}
}

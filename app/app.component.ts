import {Component} from 'angular2/core';
import {M307Component} from './components/m307/m307';
import {HomeComponent} from './components/home/home';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

@Component({
    selector: 'homepage',
    templateUrl: 'app/app.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers: [
        ROUTER_PROVIDERS
    ]
})
@RouteConfig([{
    path: '/m307',
    name: 'M307',
    component: M307Component
}, {
    path: '/home',
    name: 'Home',
    component: HomeComponent,
    useAsDefault: true
}])
export class AppComponent {
    public activeRoute: string;
}
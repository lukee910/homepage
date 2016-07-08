import {Component} from 'angular2/core';
import {M307Component} from './m307/m307.component';
import {M105Component} from './m105/m105.component';
import {McSimComponent} from './mcsim/mcsim.component';
import {HomeComponent} from './home/home.component';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router} from 'angular2/router';
import {McSimHelpComponent} from "./mcsim/mcsim.help";

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
    path: '/m105',
    name: 'M105',
    component: M105Component
}, {
    path: '/mcsim',
    name: 'MC Sim',
    component: McSimComponent
}, {
    path: '/mcsimhelp',
    name: 'MC Sim Help',
    component: McSimHelpComponent
}, {
    path: '/',
    name: 'Home',
    component: HomeComponent,
    useAsDefault: true
}])
export class AppComponent {
    constructor(private router: Router) { }
}

import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Http, HTTP_PROVIDERS} from 'angular2/http';

@Component({
    templateUrl: 'app/home/home.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    viewProviders: [        
        HTTP_PROVIDERS
    ]
})
export class HomeComponent implements OnInit {
    private issuesReportHref = '';
    
    constructor(private http: Http) {}
    
    ngOnInit() {
        var setHref = (response) => {
            this.issuesReportHref = response.json().bugs.url;
        };
        this.http.get('/package.json')
            .subscribe(setHref);
    }
 }

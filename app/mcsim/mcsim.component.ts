import {Component} from 'angular2/core';
import {McService} from './mcsim.service';
import {McEnvironment} from '../model/McEnvironment';

@Component({
    templateUrl: 'app/mcsim/mcsim.html'
})
export class McSimComponent {
	private mcService: McService;
	constructor() {
		this.mcService = new McService(new McEnvironment(8));
		this.mcService.debug();
	}
}

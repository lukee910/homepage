import {Injectable} from 'angular2/core';
import {McEnvironment} from '../model/McEnvironment';
import {Statement} from '../model/Statement';

@Injectable()
export class McService {
	private statements: Statement[] = Statement.GetMcSimStatements();
	constructor(public env: McEnvironment) { }

	public debug(): void {
		this.statements[4].Action(this.env, 5);
		this.statements[14].Action(this.env);
		this.statements[11].Action(this.env);
		console.log(this.env.Out);
	}
}

import {Injectable} from 'angular2/core';
import {McEnvironment} from '../model/McEnvironment';
import {Statement} from '../model/Statement';

@Injectable()
export class McService {
	public Program: Statement[] = [];

	constructor(public env: McEnvironment, private statements: Statement[] = Statement.GetMcSimStatements()) {}

	public Clock(): boolean {
		var id = this.env.ReadROM();
		if (id === -1) {
			return false;
		}
		var param: number;
		var statement: Statement;
		this.statements.forEach(function(value: Statement) {
			if (value.Id === id) {
				statement = value;
				return;
			}
		});

		if (!statement) {
			return false;
		}

		if (statement.TakesParam) {
			param = this.env.ReadROM();
		}

		statement.Action(this.env, param);
		return true;
	}

	public Compile(code: string): boolean {
		var statements: string[] = code.split(';');
		if(statements[statements.length - 1].trim() !== 'end') {
			return false;
		}
		statements[0] = statements[0].trim();
		var splitted: string[] = statements[0].split(/\s*\n\s*/);
		var hasProgram: boolean = false;
		splitted.forEach(function(value: string) {
			if (value.trim() === '') {
				return;
			}
			if (value.indexOf('Program') !== -1) {
				hasProgram = true;
				return;
			}
		});
		if (splitted[splitted.length - 1].trim() === '') {
			return false;
		} else {
			statements[0] = splitted[splitted.length - 1];
		}

		/*var program: Statement[] = [];
		var statementCodes: number[] = [];
		for (let i: number = 0; i < statements.length - 1; i++) {
			var statement: Statement = null;
			this.statements.forEach(function(value: Statement) {
				if (value.Name === statements[i].trim()) {
					statement = value;
				}
			});
			if (statement === null) {
				return false;
			}
			program.push(statement);
			statementCodes.push(statement.Id);
		}

		if (this.env.Max > program.length) {
			return false;
		}

		this.Program = program;
		this.env.SetROM();*/

		return true;
	}

	public debug(): void {
		this.statements[4].Action(this.env, 5);
		this.statements[14].Action(this.env);
		this.statements[11].Action(this.env);
		console.log(this.env.Out);
	}
}

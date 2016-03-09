import {Injectable} from 'angular2/core';
import {McEnvironment} from '../model/McEnvironment';
import {Statement} from '../model/Statement';

@Injectable()
export class McService {
	public Program: number[] = [];

	constructor(public env: McEnvironment, public Statements: Statement[] = Statement.GetMcSimStatements()) {}

	public Clock(): boolean {
		var id = this.env.ReadROM();
		if (id === -1) {
			return false;
		}
		var param: number = 0;
		var statement: Statement = undefined;
		this.Statements.forEach(function(value: Statement) {
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

        statements[0] = statements[0].replace(/[ \n]+/g, ' ');
        if(statements[0] !== ' ') {
            let beginning = statements[0].split(' ');
            if(beginning[0].toLowerCase() !== 'program') {
                return false;
            }
            statements[0] = beginning[2] + ' ' + (beginning[3] || '');
        } else {
            return false;
        }

		var program: number[] = [];
		for (let i: number = 0; i < statements.length - 1; i++) {
            if(statements[i].trim() === '') {
                continue;
            }

			var statement: Statement = null;
			this.Statements.forEach(function(value: Statement) {
                var regex = new RegExp(value.Name + '[ ]{0,1}' + (value.TakesParam ? '[0-9]+' : ''));
				if (regex.test(statements[i].trim())) {
					statement = value;
				}
			});
			if (statement === null) {
				return false;
			}
			program.push(statement.Id);
            if(statement.TakesParam) {
                let param = parseInt(statements[i].trim().replace(statement.Name, ''));
                if(isNaN(param)) {
                    return false;
                }
                program.push(param);
            }
		}

		this.Program = program;
		return this.env.SetROM(this.Program);
	}
}

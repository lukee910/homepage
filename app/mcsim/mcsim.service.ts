import {Injectable} from 'angular2/core';
import {McEnvironment} from '../model/McEnvironment';
import {Statement} from '../model/Statement';

@Injectable()
export class McService {
	public CompileErrorMessage: string = '';

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
		this.CompileErrorMessage = '';

		var statements: string[] = code.split('\n');
		statements.forEach(function(value: string, index: number) {
			statements[index] = value.split(';')[0].trim();
		});
		if (statements[statements.length - 1] !== 'end') {
			this.CompileErrorMessage = 'End statement missing/invalid.';
			return false;
		}

        statements[0] = statements[0].replace(/[ \n]+/g, ' ');
        if (statements[0] !== ' ') {
            let beginning = statements[0].split(' ');
            if (beginning[0].toLowerCase() !== 'program') {
				this.CompileErrorMessage = 'Program statement (beginning) missing/invalid.';
                return false;
            }
            statements[0] = '';
        } else {
			this.CompileErrorMessage = 'Program statement (beginning) missing/invalid.';
            return false;
        }

		var program: number[] = [];
		for (let i: number = 0; i < statements.length - 1; i++) {
            if (!statements[i]) {
                continue;
            }

			var statement: Statement = null;
			var hasMissingParam = false;
			this.Statements.forEach(function(value: Statement) {
                var regex = new RegExp('^' + value.Name + '[ ]{0,1}' + (value.TakesParam ? '[0-9]*' : '') + '$');
				if (regex.test(statements[i])) {
					statement = value;
				}
				if (value.TakesParam && statements[i] === value.Name) {
					hasMissingParam = true;
				}
			});
			if (hasMissingParam) {
				this.CompileErrorMessage = 'Parameter missing for statement ' + statements[i];
				return;
			}
			if (statement === null) {
				this.CompileErrorMessage = 'Statement not found: ' + statements[i];
				return false;
			}
			program.push(statement.Id);
            if (statement.TakesParam) {
                let param = parseInt(statements[i].replace(statement.Name, ''));
                if (isNaN(param)) {
					this.CompileErrorMessage = 'Parameter was not a number. Statement: ' + statement.Name + ', Parameter: ' + statements[i];
                    return false;
                }
                program.push(param);
            }
		}
		return this.env.SetROM(program);
	}
}

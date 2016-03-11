import {Injectable} from 'angular2/core';
import {McEnvironment} from '../model/McEnvironment';
import {Statement} from '../model/Statement';

@Injectable()
export class McService {
	public CompileErrorMessage: string = '';
	public env: McEnvironment = null;
	public Statements: Statement[] = [];
	private isInitialized = false;

	public Configure(env: McEnvironment, statements: Statement[]): void {
		this.env = env;
		this.Statements = statements;
		this.isInitialized = true;
	}

	public Clock(): boolean {
		if(!this.isInitialized) {
			return false;
		}

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
		if (!this.isInitialized) {
			this.CompileErrorMessage = 'Service not inizialized';
			return false;
		}

		this.CompileErrorMessage = '';

		var hasMissingtSemiColon: string = '';
		var statements: string[] = code.trim().split('\n');
		statements.forEach(function(value: string, index: number) {
            if (index !== 0 && value !== '' && value !== 'end' && value.indexOf(';') === -1) {
				hasMissingtSemiColon = 'Statement `' + value + '` is missing a semicolon.';
				return;
            }
			statements[index] = value.split(';')[0].trim();
		});
		if(hasMissingtSemiColon) {
			this.CompileErrorMessage = hasMissingtSemiColon;
			return false;
		}		
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
		if (this.env.SetROM(program)) {
            return true;
        } else {
            this.CompileErrorMessage = 'Unable to write program to ROM. ';
            if(program.length > this.env.Config.RomLength()) {
                this.CompileErrorMessage += 'Program is too long.';
            } else {
                var max = this.env.Max;
                var hasTooLong = false;
                program.forEach(function(value: number, index: number) {
                    if(value > max) {
                        hasTooLong = true;
                    }
                });
                if(hasTooLong) {
                    this.CompileErrorMessage += 'A value given as parameter is longer than the maximum. (' + max + ')';
                }
            }
            return false;
        }
	}
}

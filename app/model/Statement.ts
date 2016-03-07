import {McEnvironment} from './McEnvironment';

export class Statement {
	constructor(public Name: string, public Desc: string, public Id: number, public Action: (env: McEnvironment, param?: number) => void) { }

	public static GetMcSimStatements(): Statement[] {
		var ret: Statement[] = [];
		// STAA
		ret.push(new Statement('STAA', '(N):=A, Store A to RAM address.', 0, (env: McEnvironment, param: number) => {
			if (param >= env.RAM.length || param < 0) {
				return;
			}
			env.RAM[param] = env.A;
		}));
		// STAB
		ret.push(new Statement('STAB', '(N):=B, Store B to RAM address.', 1, (env: McEnvironment, param: number) => {
			if (param >= env.RAM.length || param < 0) {
				return;
			}
			env.RAM[param] = env.B;
		}));
		// LDAA RAM
		ret.push(new Statement('LDAA', 'A:=(N), Store RAM address to A.', 2, (env: McEnvironment, param: number) => {
			if (param >= env.RAM.length || param < 0) {
				return;
			}
			env.A = env.RAM[param];
		}));
		// LDAB RAM
		ret.push(new Statement('LDAB', 'B:=(N), Store RAM address to B.', 3, (env: McEnvironment, param: number) => {
			if (param >= env.RAM.length || param < 0) {
				return;
			}
			env.B = env.RAM[param];
		}));
		// LDAA value
		ret.push(new Statement('LDAA #', 'A:=#N, Store value to A.', 4, (env: McEnvironment, param: number) => {
			env.SetAccumulator(param, true);
		}));
		// LDAB value
		ret.push(new Statement('LDAB #', 'B:=#N, Store value to B.', 5, (env: McEnvironment, param: number) => {
			env.SetAccumulator(param, false);
		}));
		// JMP
		ret.push(new Statement('JMP', 'Jump to statement.', 6, (env: McEnvironment, param: number) => {
			if(param >= env.ROM.length || param < 0) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// JCS
		ret.push(new Statement('JJCSMP', 'Jump to statement if carry.', 7, (env: McEnvironment, param: number) => {
			if (param >= env.ROM.length || param < 0 || !env.Carry) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// IN
		ret.push(new Statement('IN', 'Store input to A.', 8, (env: McEnvironment, param: number) => {
			env.A = env.In;
		}));
		// TAB
		ret.push(new Statement('TAB', 'B:=A, Store A to B.', 9, (env: McEnvironment, param: number) => {
			env.B = env.A;
		}));
		// TBA
		ret.push(new Statement('TBA', 'A:=B, Store B to A.', 10, (env: McEnvironment, param: number) => {
			env.A = env.B;
		}));
		// OUT
		ret.push(new Statement('OUT', 'Print A to Out.', 11, (env: McEnvironment, param: number) => {
			env.Out = env.A;
		}));
		// JCC
		ret.push(new Statement('JCC', 'Jump to statement if not carry.', 12, (env: McEnvironment, param: number) => {
			if (param > env.ROM.length || param < 0 || env.Carry) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// ABA
		ret.push(new Statement('ABA', 'A:=A+B, Store B to A.', 13, (env: McEnvironment, param: number) => {
			env.AddToAccumulator(env.B, true);
		}));
		// ASLA
		ret.push(new Statement('ASLA', 'A:=A*2, Double A.', 14, (env: McEnvironment, param: number) => {
			env.AddToAccumulator(env.A, true);
		}));
		// RORA
		ret.push(new Statement('RORA', 'A:=A/2, Rotate right, divide A by 2.', 15, (env: McEnvironment, param: number) => {
			env.AddToAccumulator(-0.5 * env.A, true);
		}));
		return ret;
	}
}

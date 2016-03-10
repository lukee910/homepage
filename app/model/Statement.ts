import {McEnvironment} from './McEnvironment';

export class Statement {
	constructor(public Name: string, public Desc: string, public Id: number, public TakesParam: boolean, public Action: (env: McEnvironment, param?: number) => void) { }

	public static GetDemoPcStatements(): Statement[] {
		var ret: Statement[] = [];
		// ADDA value
		ret.push(new Statement('ADDA #', 'Add value to A', 139, true, (env: McEnvironment, param: number) => {
			env.SetAccumulator(param, true);
		}));
		// ADDA memory
		ret.push(new Statement('ADDA', 'Add value from memory to A', 139, true, (env: McEnvironment, param: number) => {
			if (param >= env.ROM.length || param < 0) {
				return;
			}
			env.SetAccumulator(env.ROM[param], true);
		}));
		// JCC
		ret.push(new Statement('JCC', 'Jump if Carry clear => Carry == 0', 84, true, (env: McEnvironment, param: number) => {
			if (param > env.ROM.length || param < 0 || env.Carry) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// JCS
		ret.push(new Statement('JCS', 'Jump if Carry set => Carry == 1', 85, true, (env: McEnvironment, param: number) => {
			if (param > env.ROM.length || param < 0 || !env.Carry) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// JMP
		ret.push(new Statement('JMP', 'Jump to statement.', 126, true, (env: McEnvironment, param: number) => {
			if (param >= env.ROM.length || param < 0) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// LDAA value
		ret.push(new Statement('LDAA #', 'Load Accumulator A with value.', 134, true, (env: McEnvironment, param: number) => {
			env.SetAccumulator(param, true);
		}));
		// LDAA memory
		ret.push(new Statement('LDAA', 'Load Accumulator A with value from memory.', 150, true, (env: McEnvironment, param: number) => {
			if (param >= env.ROM.length || param < 0) {
				return;
			}
			env.SetAccumulator(env.ROM[param], true);
		}));
		// ROLA
		ret.push(new Statement('ROLA', 'A:=A*2, Double A.', 73, false, (env: McEnvironment) => {
			env.AddToAccumulator(env.A, true);
		}));
		// RORA
		ret.push(new Statement('RORA', 'A:=A/2, Divide A by 2.', 70, false, (env: McEnvironment) => {
			env.AddToAccumulator(-0.5 * env.A, true);
		}));
		// STAA
		ret.push(new Statement('STAA', 'Store Accumulator A.', 151, true, (env: McEnvironment, param: number) => {
			if (param >= env.ROM.length || param < 0) {
				return;
			}
			env.ROM[param] = env.A;
		}));
		// SUBA value
		ret.push(new Statement('SUBA #', 'Subtract A by value.', 128, true, (env: McEnvironment, param: number) => {
			env.AddToAccumulator(-param, true);
		}));
		// SUBA value
		ret.push(new Statement('SUBA', 'Subtract A by value from memory.', 144, true, (env: McEnvironment, param: number) => {
			if (param >= env.ROM.length || param < 0) {
				return;
			}
			env.AddToAccumulator(-env.ROM[param], true);
		}));
		return ret;
	}

	public static GetMcSimStatements(): Statement[] {
		var ret: Statement[] = [];
		// STAA
		ret.push(new Statement('STAA', '(N):=A, Store A to RAM address.', 0, true, (env: McEnvironment, param: number) => {
			if (param >= env.RAM.length || param < 0) {
				return;
			}
			env.RAM[param] = env.A;
		}));
		// STAB
		ret.push(new Statement('STAB', '(N):=B, Store B to RAM address.', 1, true, (env: McEnvironment, param: number) => {
			if (param >= env.RAM.length || param < 0) {
				return;
			}
			env.RAM[param] = env.B;
		}));
		// LDAA RAM
		ret.push(new Statement('LDAA', 'A:=(N), Store RAM address to A.', 2, true, (env: McEnvironment, param: number) => {
			if (param >= env.RAM.length || param < 0) {
				return;
			}
			env.SetAccumulator(env.RAM[param], true);
		}));
		// LDAB RAM
		ret.push(new Statement('LDAB', 'B:=(N), Store RAM address to B.', 3, true, (env: McEnvironment, param: number) => {
			if (param >= env.RAM.length || param < 0) {
				return;
			}
			env.SetAccumulator(env.RAM[param], false);
		}));
		// LDAA value
		ret.push(new Statement('LDAA #', 'A:=#N, Store value to A.', 4, true, (env: McEnvironment, param: number) => {
			env.SetAccumulator(param, true);
		}));
		// LDAB value
		ret.push(new Statement('LDAB #', 'B:=#N, Store value to B.', 5, true, (env: McEnvironment, param: number) => {
			env.SetAccumulator(param, false);
		}));
		// JMP
		ret.push(new Statement('JMP', 'Jump to statement.', 6, true, (env: McEnvironment, param: number) => {
			if(param >= env.ROM.length || param < 0) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// JCS
		ret.push(new Statement('JCS', 'Jump to statement if carry.', 7, true, (env: McEnvironment, param: number) => {
			if (param >= env.ROM.length || param < 0 || !env.Carry) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// IN
		ret.push(new Statement('IN', 'Store input to A.', 8, false, (env: McEnvironment) => {
			env.SetAccumulator(env.In, true);
		}));
		// TAB
		ret.push(new Statement('TAB', 'B:=A, Store A to B.', 9, false, (env: McEnvironment) => {
			env.SetAccumulator(env.A, false);
		}));
		// TBA
		ret.push(new Statement('TBA', 'A:=B, Store B to A.', 10, false, (env: McEnvironment) => {
			env.SetAccumulator(env.B, true);
		}));
		// OUT
		ret.push(new Statement('OUT', 'Print A to Out.', 11, false, (env: McEnvironment) => {
			env.Out = env.A;
		}));
		// JCC
		ret.push(new Statement('JCC', 'Jump to statement if not carry.', 12, true, (env: McEnvironment, param: number) => {
			if (param > env.ROM.length || param < 0 || env.Carry) {
				return;
			}
			env.ProgramCounter = param;
		}));
		// ABA
		ret.push(new Statement('ABA', 'A:=A+B, Store B to A.', 13, false, (env: McEnvironment) => {
			env.AddToAccumulator(env.B, true);
		}));
		// ASLA
		ret.push(new Statement('ASLA', 'A:=A*2, Double A.', 14, false, (env: McEnvironment) => {
			env.AddToAccumulator(env.A, true);
		}));
		// RORA
		ret.push(new Statement('RORA', 'A:=A/2, Rotate right, divide A by 2.', 15, false, (env: McEnvironment) => {
			env.AddToAccumulator(-0.5 * env.A, true);
		}));
		return ret;
	}
}

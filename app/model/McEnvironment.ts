export class McEnvironment {
	public ProgramCounter: number;
	public ROM: number[];
	public RAM: number[];
	public A: number;
	public B: number;
	public Carry: boolean;
	public Bit: number;
	public Max: number;
	public In: number;
	public Out: number;

	constructor(bit: number) {
		if(bit > 24 || bit < 0 || Math.floor(bit) !== bit) {
			throw `[McEnvrionment.ts:constructor] ${bit} is not a valid value for bits.`;
		}
		this.Bit = bit;
		this.Max = Math.pow(2, this.Bit);
		this.Reset();
	}

	public Reset(): void {
		this.ProgramCounter 
			= this.A
			= this.B
			= this.In
			= this.Out
			= 0;
		this.Carry = false;		
		this.ROM = this.GenerateMemory();
		this.RAM = this.GenerateMemory();
	}

	public ReadROM(): number {
		return this.ROM[this.ProgramCounter++];
	}

	public AddToAccumulator(value: number, isA: boolean): void {
		var result: number = Math.abs((isA ? this.A : this.B) + value);
		var resultModulo: number = result % this.Max;
		if(isA) {
			this.A = resultModulo;
			this.Carry = result > this.Max;
		} else {
			this.B = resultModulo;
		}
	}

	public SetAccumulator(value: number, isA: boolean): void {
		if(isA) {
			this.A = Math.abs(value % this.Max);
		} else {
			this.B = Math.abs(value % this.Max);
		}
	}

	private GenerateMemory(): number[] {
		var ret = [];
		for (let i = 0; i < this.Bit; i++) {
			ret.push(0);
		}
		return ret;
	}
}

export class McEnvironment {
	public ProgramCounter: number;
	public ROM: number[];
	public RomLength: number;
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
		this.Max = Math.pow(2, this.Bit) - 1;
		this.Reset();
	}

	public Reset(): void {
		this.ProgramCounter
			= this.RomLength
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
		if(this.ProgramCounter >= this.ROM.length || this.ProgramFinished()) {
			return -1;
		}
		return this.ROM[this.ProgramCounter++];
	}

	public SetROM(value: number[]): boolean {
		if(value.length > this.Max) {
			return false;
		}
		this.ROM = value;
		this.RomLength = value.length;
		while(this.ROM.length < this.Max) {
			this.ROM.push(0);
		}
		return true;
	}

	public ProgramFinished(): boolean {
		return this.ProgramCounter >= this.RomLength;
	}

	public AddToAccumulator(value: number, isA: boolean): void {
		var result: number = Math.abs((isA ? this.A : this.B) + value);
		var resultModulo: number = this.GetModulo(result);
		if(isA) {
			this.A = resultModulo;
			this.Carry = result > this.Max;
		} else {
			this.B = resultModulo;
		}
	}

	public SetAccumulator(value: number, isA: boolean): void {
		if(isA) {
			this.A = Math.abs(this.GetModulo(value));
		} else {
			this.B = Math.abs(this.GetModulo(value));
		}
	}

	private GenerateMemory(): number[] {
		var ret = [];
		for (let i = 0; i < this.Max; i++) {
			ret.push(0);
		}
		return ret;
	}

	private GetModulo(value: number): number {
		return value % (this.Max + 1);
	}
}

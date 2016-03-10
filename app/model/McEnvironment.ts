import {McEnvironmentConfig} from './McEnvironmentConfig';

export class McEnvironment {
	public ProgramCounter: number;
	public ROM: number[];
	public RomLength: number;
	public RAM: number[];
	public A: number;
	public B: number;
	public Carry: boolean;
	public Max: number;
	public In: number;
	public Out: number;

	constructor(public Config: McEnvironmentConfig) {
		if (Config.Bit() > 8 || Config.Bit() < 0 || Math.floor(Config.Bit()) !== Config.Bit()) {
			throw `[McEnvrionment.ts:constructor] ${Config.Bit()} is not a valid value for bits.`;
		}
		this.Max = Math.pow(2, Config.Bit()) - 1;
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
		this.ROM = this.GenerateMemory(this.Config.RomLength());
		this.RAM = this.GenerateMemory(this.Config.RamLength());
	}

	public ReadROM(): number {
		if (this.ProgramCounter >= this.Config.RomLength() || this.ProgramFinished()) {
			return -1;
		}
		return this.ROM[this.ProgramCounter++];
	}

	public SetROM(values: number[]): boolean {
		if (values.length > this.Config.RomLength()) {
			return false;
		}
        var hasTooLong = false;
        var max = this.Max;
		values.forEach(function(value) {
            if(value > max) {
                hasTooLong = true;
            }
        });
        if(hasTooLong) {
            return false;
        }

		this.ROM = values;
		this.RomLength = values.length;
		while (this.ROM.length < this.Config.RomLength()) {
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
			if (this.Config.ResetCarryOnSetAccumulator()) {
				this.Carry = false;
			}
		} else {
			this.B = Math.abs(this.GetModulo(value));
		}
	}

	private GenerateMemory(length: number): number[] {
		var ret = [];
		for (let i = 0; i < length; i++) {
			ret.push(0);
		}
		return ret;
	}

	private GetModulo(value: number): number {
		return value % (this.Max + 1);
	}
}

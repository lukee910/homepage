export interface McEnvironmentConfig {
	RomLength(): number;
	RamLength(): number;
	Bit(): number;
	ResetCarryOnSetAccumulator(): boolean;
}

export class McEnvironmentConfigBuilder {
	public RomLength = 0;
	public RamLength = 0;
	public Bit = 0;
	public ResetCarryOnSetAccumulator = false;

	constructor(config: McEnvironmentConfig = null) {
		if(config !== null) {
			this.RomLength = config.RomLength();
			this.RamLength = config.RamLength();
			this.Bit = config.Bit();
			this.ResetCarryOnSetAccumulator = config.ResetCarryOnSetAccumulator();
		}
	}

	public Build(): McEnvironmentConfig {
		return {
			RomLength: (function(romLength) { return function() { return romLength; }; })(this.RomLength),
			RamLength: (function(ramLength) { return function() { return ramLength; }; })(this.RamLength),
			Bit: (function(bit) { return function() { return bit; }; })(this.Bit),
			ResetCarryOnSetAccumulator: (function(resetCarry) { return function() { return resetCarry; }; })(this.ResetCarryOnSetAccumulator)
		}
	}
}

export class McSimConfig implements McEnvironmentConfig {
	public RomLength(): number { return 8 };
	public RamLength(): number { return 4 };
	public Bit(): number { return 4 };
	public ResetCarryOnSetAccumulator(): boolean { return false };
}

export class DemoPcConfig implements McEnvironmentConfig {
	public RomLength(): number { return 16 };
	public RamLength(): number { return 0 };
	public Bit(): number { return 8 };
	public ResetCarryOnSetAccumulator(): boolean { return false };
}

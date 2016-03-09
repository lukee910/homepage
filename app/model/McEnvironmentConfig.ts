export interface McEnvironmentConfig {
	RomLength(): number;
	RamLength(): number;
	Bit(): number;
	ResetCarryOnSetAccumulator(): boolean;
}

export class McSimConfig implements McEnvironmentConfig {
	public RomLength(): number { return 8 };
	public RamLength(): number { return 4 };
	public Bit(): number { return 4 };
	ResetCarryOnSetAccumulator(): boolean { return false };
}

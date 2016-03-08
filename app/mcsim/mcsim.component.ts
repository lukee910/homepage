import {Component} from 'angular2/core';
import {McService} from './mcsim.service';
import {McEnvironment} from '../model/McEnvironment';
import {Statement} from '../model/Statement';
import {NgFor, NgIf} from 'angular2/common';

@Component({
    templateUrl: 'app/mcsim/mcsim.html',
    directives: [
    	NgFor,
		NgIf
    ]
})
export class McSimComponent {
	public mcService: McService;
	public TempCommands: number[] = [];
	public CommandsModel: string = '';
	public RomLength: number = 0;

	constructor() {
		this.mcService = new McService(new McEnvironment(4));
	}

	public SetCommands(): void {
		var commands: number[] = [];
		this.CommandsModel.split(';').forEach(function (value: string) {
			var parsed: number = parseInt(value);
			if (!isNaN(parsed)) {
				commands.push(parsed);
			}			
		});
		this.mcService.env.Reset();
		this.mcService.env.SetROM(commands);
		this.RomLength = this.mcService.env.RomLength;
	}

	public ApplyRomLength(): void {
		if(this.RomLength < 0 || this.RomLength >= this.mcService.env.ROM.length) {
			return;
		}		
		this.mcService.env.RomLength = this.RomLength;
	}

	public IsBitOn(value: number, position: number): boolean {
		position = this.CorrectPosition(position);
		return (value >>> 0).toString(2).split('').reverse()[position] === '1';
	}

	public ArrayOfLength(value: number): Object[] {
		return new Array(value);
	}

	public ToggleBitOfCollection(register: number[], registerIndex: number, position: number): void {
		var value: number = this.ToggleBitInValue(register[registerIndex], position);
		if (value === -1) {
			return;
		}
		register[registerIndex] = value;
	}

	public ToggleBit(register: string, position: number): void {
		var value: number = this.ToggleBitInValue(parseInt(this.mcService.env[register]), position);
		if(value === -1) {
			return;
		}
		this.mcService.env[register] = value;
	}

	public Reset(): void {
		this.mcService.env.Reset();
		this.RomLength = this.mcService.env.RomLength;
	}

	private ToggleBitInValue(value: number, position: number): number {
		if (isNaN(value)) {
			return -1;
		}
		var difference: number = Math.pow(2, this.CorrectPosition(position));
		if (this.IsBitOn(value, position)) {
			difference = -difference;
		}
		value += difference;
		if (value < 0 || value > this.mcService.env.Max) {
			return -1;
		}
		return value;
	}

	private CorrectPosition(position: number): number {
		return this.mcService.env.Bit - 1 - position;
	}
}

import {Component, OnInit} from 'angular2/core';
import {McService} from './mcsim.service';
import {McEnvironment} from '../model/McEnvironment';
import {DemoPcConfig, McSimConfig, McEnvironmentConfigBuilder} from '../model/McEnvironmentConfig';
import {Statement} from '../model/Statement';
import {NgFor, NgIf} from 'angular2/common';

@Component({
    templateUrl: 'app/mcsim/mcsim.html',
    providers: [McService]
})
export class McSimComponent implements OnInit {
	public TempCommands: number[] = [];
	public CommandsModel: string = 'Program _\n\nend';
	public RomLength: number = 0;
    private compilationResult: boolean;
    private statements: Statement[] = Statement.GetMcSimStatements();
    private config = new McEnvironmentConfigBuilder(new McSimConfig());
    private selectedProgram: string;
    private programs: Program[] = [];
    private programSaveResult: string = '';

	constructor(public mcService: McService) {
		this.ConfigureService();
	}
    
    ngOnInit() {
        this.LoadLocalStoragePrograms();
    }

	public ConfigureService(): void {
		this.mcService.Configure(new McEnvironment(this.config.Build()), this.statements);
	}

	public SelectedPresetChanged($event): void {
		var selectedPreset = $event.target.value;
		var config: McSimConfig = null;
		if (selectedPreset === 'mcsim') {
			config = new McSimConfig();
			this.statements = Statement.GetMcSimStatements();
		} else if (selectedPreset === 'demopc') {
			config = new DemoPcConfig();
			this.statements = Statement.GetDemoPcStatements();
		} else {
			return;
		}
		this.config = new McEnvironmentConfigBuilder(config);
	}

	public SetCommands(): void {
        this.mcService.env.Reset();
		this.compilationResult = !!this.mcService.Compile(this.CommandsModel);
        this.RomLength = this.mcService.env.RomLength;
	}
    
    private GetProgramName(): string {
        var line = this.CommandsModel.split('\n')[0].trim().split(' ');
        var notEmptyCounter = 0;
        var programName = '';
        line.forEach(function(value) {
            if(value !== '' && notEmptyCounter++ === 1) {
                programName = value;
            }
        });
        return programName;
    }
    
    private LoadLocalStoragePrograms(): void {
        var programs = JSON.parse(localStorage.getItem('mcsim.programs'));
        this.programs = <Program[]> programs || [];
        this.selectedProgram = this.programs.length > 0 ? this.programs[0].Name : '';
    }
    
    private SaveLocalStoragePrograms(): void {
        localStorage.setItem('mcsim.programs', JSON.stringify(this.programs));
        this.selectedProgram = this.programs.length > 0 ? this.programs[0].Name : '';
    }

    private SaveProgram(overwrite: boolean = false): void {
		var nameAlreadyExists = false;
		var name = this.GetProgramName();
		this.programs.forEach(function (value: Program) {
			if(value.Name === name) {
				nameAlreadyExists = true;
			}
		});
		if (nameAlreadyExists) {
			if (!overwrite) {
				this.programSaveResult = 'Program already exists';
				return;
			} else {
				this.RemoveProgram(name);
			}
		}
		this.programSaveResult = '';
		this.programs.push({
			Name: name,
			Program: this.CommandsModel
		});
		this.SaveLocalStoragePrograms();
    }

    private LoadProgram(name: string = this.selectedProgram): void {
		var setProgram = (program: Program) => {
			this.CommandsModel = program.Program;
		};
    	this.programs.forEach(function (value: Program) {
    		if(value.Name === name) {
				setProgram(value);
    		}
    	});
		this.programSaveResult = '';
    }

    private RemoveProgram(name: string = this.selectedProgram): void {
		var programs: Program[] = [];
		this.programs.forEach(function (value) {
			if (name !== value.Name) {
				programs.push(value);
			}
		});
		this.programs = programs;
		this.SaveLocalStoragePrograms();
		this.programSaveResult = '';
    }

	private Commands_OnKeyPress($event: KeyboardEvent) {
		if ($event.ctrlKey && $event.keyCode !== 17) {
			if ($event.keyCode === 13 || $event.keyCode === 10) {
				this.SetCommands();
				$event.stopPropagation();
				return false;
			} else if ($event.keyCode === 82 || $event.keyCode === 83) {
				this.SaveProgram($event.keyCode === 82 ? true : false);
				$event.stopPropagation();
				return false;
			}
		}
	}

	public ApplyRomLength(): void {
		if(this.RomLength < 0 || this.RomLength > this.mcService.env.ROM.length) {
			return;
		}		
		this.mcService.env.RomLength = this.RomLength;
	}

	public IsBitOn(value: number, position: number): boolean {
		position = this.CorrectPosition(position);
		return (value >>> 0).toString(2).split('').reverse()[position] === '1';
	}

	public ArrayOfLength(value: number = this.mcService.env.Config.Bit()): Object[] {
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
        this.compilationResult = undefined;
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
		return this.mcService.env.Config.Bit() - 1 - position;
	}
}

interface Program {
    Name: string;
    Program: string;
}

import {Component, Input, OnInit} from '@angular/core';
import {IMetric} from '../../interfaces';

@Component({
	selector: 'app-metrics',
	templateUrl: './metrics.component.html',
	styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnInit {

	@Input() public metrics: IMetric[];

	constructor() {
	}

	ngOnInit() {
	}

	public hasValue = (m: IMetric) => !isNaN(m.value);

	trackById = (i: number, m: IMetric) => m.id;
}

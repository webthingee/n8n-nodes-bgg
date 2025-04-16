import { INodeType } from 'n8n-workflow';
import { Bgg } from '../Bgg.node';

describe('Bgg', () => {
	let bgg: INodeType;

	beforeEach(() => {
		bgg = new Bgg();
	});

	it('should be defined', () => {
		expect(bgg).toBeDefined();
	});
}); 
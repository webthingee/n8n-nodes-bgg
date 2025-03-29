import { Bgg } from '../Bgg.node';
import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData } from 'n8n-workflow';

describe('Bgg Node', () => {
	let node: Bgg;
	let mockExecuteFunctions: IExecuteFunctions;

	beforeEach(() => {
		node = new Bgg();
		mockExecuteFunctions = {
			getNode: jest.fn(),
			getNodeParameter: jest.fn(),
			getInputData: jest.fn(),
			continueOnFail: jest.fn(),
		} as unknown as IExecuteFunctions;
	});

	describe('getGame operation', () => {
		it('should throw error if gameId is not provided', async () => {
			mockExecuteFunctions.getNodeParameter = jest.fn()
				.mockImplementation((parameterName) => {
					console.log('getNodeParameter called with:', parameterName);
					if (parameterName === 'operation') return 'getGame';
					if (parameterName === 'gameId') return '';
					return '';
				});
			mockExecuteFunctions.getInputData = jest.fn().mockReturnValue([{}]);

			try {
				await node.execute.call(mockExecuteFunctions);
				console.log('No error was thrown');
			} catch (error) {
				console.log('Error was thrown:', error);
			}

			await expect(node.execute.call(mockExecuteFunctions)).rejects.toThrow('Game ID is required');
		});

		it('should return game data for valid gameId', async () => {
			mockExecuteFunctions.getNodeParameter = jest.fn()
				.mockImplementation((parameterName) => {
					if (parameterName === 'operation') return 'getGame';
					if (parameterName === 'gameId') return '342942'; // Catan game ID
					return '';
				});
			mockExecuteFunctions.getInputData = jest.fn().mockReturnValue([{}]);

			const result = await node.execute.call(mockExecuteFunctions);
			expect(result[0][0].json).toHaveProperty('id');
			expect(result[0][0].json).toHaveProperty('name');
		});
	});

	describe('searchGames operation', () => {
		it('should throw error if searchQuery is not provided', async () => {
			mockExecuteFunctions.getNodeParameter = jest.fn()
				.mockImplementation((parameterName) => {
					if (parameterName === 'operation') return 'searchGames';
					if (parameterName === 'searchQuery') return '';
					return '';
				});
			mockExecuteFunctions.getInputData = jest.fn().mockReturnValue([{}]);

			await expect(node.execute.call(mockExecuteFunctions)).rejects.toThrow('Search query is required');
		});

		it('should return search results for valid query', async () => {
			mockExecuteFunctions.getNodeParameter = jest.fn()
				.mockImplementation((parameterName) => {
					if (parameterName === 'operation') return 'searchGames';
					if (parameterName === 'searchQuery') return 'Catan';
					return '';
				});
			mockExecuteFunctions.getInputData = jest.fn().mockReturnValue([{}]);

			const result = await node.execute.call(mockExecuteFunctions);
			expect(result[0][0].json).toHaveProperty('items');
			expect(Array.isArray(result[0][0].json.items)).toBe(true);
		});
	});
}); 
import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

interface BggGame {
	$: {
		id: string;
		type: string;
	};
	name?: Array<{
		$: {
			value: string;
		};
	}>;
	description?: string[];
	image?: string[];
	thumbnail?: string[];
	minplayers?: Array<{
		$: {
			value: string;
		};
	}>;
	maxplayers?: Array<{
		$: {
			value: string;
		};
	}>;
	playingtime?: Array<{
		$: {
			value: string;
		};
	}>;
	minplaytime?: Array<{
		$: {
			value: string;
		};
	}>;
	maxplaytime?: Array<{
		$: {
			value: string;
		};
	}>;
	yearpublished?: Array<{
		$: {
			value: string;
		};
	}>;
}

interface BggSearchResult {
	items: {
		item: Array<{
			$: {
				id: string;
				type: string;
			};
			name?: Array<{
				$: {
					value: string;
				};
			}>;
			yearpublished?: Array<{
				$: {
					value: string;
				};
			}>;
		}>;
	};
}

export class Bgg implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BoardGameGeek',
		name: 'bgg',
		icon: 'file:icon.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with BoardGameGeek API',
		defaults: {
			name: 'BoardGameGeek',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Game',
						value: 'getGame',
						description: 'Get information about a specific game',
						action: 'Get information about a specific game',
					},
					{
						name: 'Search Games',
						value: 'searchGames',
						description: 'Search for games',
						action: 'Search for games',
					},
				],
				default: 'getGame',
			},
			{
				displayName: 'Game ID',
				name: 'gameId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['getGame'],
					},
				},
				description: 'The ID of the game to retrieve',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['searchGames'],
					},
				},
				description: 'The search term to look for games',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'getGame') {
					const gameId = this.getNodeParameter('gameId', i) as string;
					if (!gameId) {
						throw new NodeOperationError(this.getNode(), 'Game ID is required');
					}

					const response = await axios.get(`https://boardgamegeek.com/xmlapi2/thing?id=${gameId}`);
					const result = await parseStringPromise(response.data) as { items: { item: BggGame[] } };
					
					if (!result.items || !result.items.item || result.items.item.length === 0) {
						throw new NodeOperationError(this.getNode(), 'Game not found');
					}

					const game = result.items.item[0];
					returnData.push({
						json: {
							id: game.$.id,
							type: game.$.type,
							name: game.name?.[0]?.$.value || '',
							description: game.description?.[0] || '',
							image: game.image?.[0] || '',
							thumbnail: game.thumbnail?.[0] || '',
							minPlayers: game.minplayers?.[0]?.$.value || '',
							maxPlayers: game.maxplayers?.[0]?.$.value || '',
							playingTime: game.playingtime?.[0]?.$.value || '',
							minPlayTime: game.minplaytime?.[0]?.$.value || '',
							maxPlayTime: game.maxplaytime?.[0]?.$.value || '',
							yearPublished: game.yearpublished?.[0]?.$.value || '',
						},
					});
				} else if (operation === 'searchGames') {
					const searchQuery = this.getNodeParameter('searchQuery', i) as string;
					if (!searchQuery) {
						throw new NodeOperationError(this.getNode(), 'Search query is required');
					}

					const response = await axios.get(`https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(searchQuery)}&type=boardgame`);
					const result = await parseStringPromise(response.data) as BggSearchResult;

					if (!result.items || !result.items.item) {
						returnData.push({
							json: {
								items: [],
							},
						});
						continue;
					}

					const games = result.items.item.map((item) => ({
						id: item.$.id,
						type: item.$.type,
						name: item.name?.[0]?.$.value || '',
						yearPublished: item.yearpublished?.[0]?.$.value || '',
					}));

					returnData.push({
						json: {
							items: games,
						},
					});
				}
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					returnData.push({ 
						json: { 
							error: error instanceof Error ? error.message : 'An unknown error occurred' 
						} 
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 
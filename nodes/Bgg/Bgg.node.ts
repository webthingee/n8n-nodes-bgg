import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
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

interface BggForum {
	$: {
		id: string;
		title: string;
		noposting: string;
		description: string;
		numthreads: string;
		numposts: string;
		lastpostdate: string;
	};
}

interface BggForumList {
	forums: {
		forum: BggForum[];
	};
}

interface BggThread {
	$: {
		id: string;
		subject: string;
		author: string;
		numarticles: string;
		postdate: string;
		lastpostdate: string;
	};
}

interface BggForumThreads {
	forum: {
		$: {
			id: string;
			title: string;
			numthreads: string;
			numposts: string;
			lastpostdate: string;
			noposting: string;
			termsofuse: string;
		};
		threads: {
			thread: Array<{
				$: {
					id: string;
					subject: string;
					author: string;
					numarticles: string;
					postdate: string;
					lastpostdate: string;
				};
			}>;
		};
	};
}

interface ForumThread {
	id: string;
	subject: string;
	author: string;
	numArticles: number;
	postDate: string;
	lastPostDate: string;
}

interface ForumResponse extends IDataObject {
	forumId: string;
	forumTitle: string;
	threadCount: number;
	postCount: number;
	lastPostDate: string;
	threads: ForumThread[];
	rawResponse?: string;
}

export class Bgg implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BoardGameGeek',
		name: 'bgg',
		icon: 'file:icon.svg',
		group: ['input'],
		version: 1.3,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with BoardGameGeek API v1.3 (Built: ' + new Date().toISOString() + ')',
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
					{
						name: 'Get Rules Forum Threads',
						value: 'getRulesForumThreads',
						description: 'Get threads from the rules forum of a game',
						action: 'Get threads from the rules forum of a game',
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
						operation: ['getGame', 'getRulesForumThreads'],
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
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				required: false,
				default: 1,
				displayOptions: {
					show: {
						operation: ['getRulesForumThreads'],
					},
				},
				description: 'Page number of threads to retrieve',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				required: false,
				default: 50,
				displayOptions: {
					show: {
						operation: ['getRulesForumThreads'],
					},
				},
				description: 'Number of threads per page',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				required: false,
				default: 'mostRecent',
				displayOptions: {
					show: {
						operation: ['getRulesForumThreads'],
					},
				},
				options: [
					{
						name: 'Most Recent',
						value: 'mostRecent',
						description: 'Sort by most recent activity',
					},
					{
						name: 'Newest Threads',
						value: 'newest',
						description: 'Sort by thread creation date',
					},
					{
						name: 'Most Active',
						value: 'mostActive',
						description: 'Sort by number of articles',
					},
					{
						name: 'Alphabetical',
						value: 'alphabetical',
						description: 'Sort by thread subject',
					},
				],
				description: 'How to sort the forum threads',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				required: false,
				default: 'desc',
				displayOptions: {
					show: {
						operation: ['getRulesForumThreads'],
					},
				},
				options: [
					{
						name: 'Descending',
						value: 'desc',
						description: 'Sort in descending order (newest/highest first)',
					},
					{
						name: 'Ascending',
						value: 'asc',
						description: 'Sort in ascending order (oldest/lowest first)',
					},
				],
				description: 'The order to sort the results',
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
				} else if (operation === 'getRulesForumThreads') {
					const gameId = this.getNodeParameter('gameId', i) as string;
					const page = this.getNodeParameter('page', i) as number;
					const count = this.getNodeParameter('count', i) as number;

					// First get the rules forum ID
					const forumListResponse = await axios.get(`https://boardgamegeek.com/xmlapi2/forumlist?type=thing&id=${gameId}`);
					const forumListResult = await parseStringPromise(forumListResponse.data) as BggForumList;
					
					const rulesForum = forumListResult.forums.forum.find(f => f.$.title.toLowerCase().includes('rules'));
					if (!rulesForum) {
						throw new Error('Rules forum not found');
					}

					// Then get the forum threads
					const forumResponse = await axios.get(`https://boardgamegeek.com/xmlapi2/forum?id=${rulesForum.$.id}&page=${page}&count=${count}`);
					console.log('Raw Forum XML Response:', forumResponse.data);
					
					// Parse with mergeAttrs to avoid the $ property
					const forumResult = await parseStringPromise(forumResponse.data, {
						mergeAttrs: true,
						explicitArray: false
					});
					console.log('Raw Parsed Result:', JSON.stringify(forumResult, null, 2));

					// Clean up the structure
					const cleanResult = {
						forumId: forumResult.forum.id,
						forumTitle: forumResult.forum.title,
						threadCount: parseInt(forumResult.forum.numthreads, 10),
						postCount: parseInt(forumResult.forum.numposts, 10),
						lastPostDate: new Date(forumResult.forum.lastpostdate).toISOString(),
						threads: forumResult.forum.threads.thread.map((thread: any) => ({
							id: thread.id,
							subject: thread.subject,
							author: thread.author,
							numArticles: parseInt(thread.numarticles, 10),
							postDate: new Date(thread.postdate).toISOString(),
							lastPostDate: new Date(thread.lastpostdate).toISOString()
						}))
					};

					// Sort threads based on user preferences
					const sortBy = this.getNodeParameter('sortBy', i) as string;
					const sortOrder = this.getNodeParameter('sortOrder', i) as string;
					
					cleanResult.threads.sort((a: ForumThread, b: ForumThread) => {
						let comparison = 0;
						switch (sortBy) {
							case 'mostRecent':
								comparison = new Date(b.lastPostDate).getTime() - new Date(a.lastPostDate).getTime();
								break;
							case 'newest':
								comparison = new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
								break;
							case 'mostActive':
								comparison = b.numArticles - a.numArticles;
								break;
							case 'alphabetical':
								comparison = a.subject.localeCompare(b.subject);
								break;
						}
						return sortOrder === 'desc' ? comparison : -comparison;
					});

					returnData.push({
						json: cleanResult
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
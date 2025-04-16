import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';
import { parseStringPromise } from 'xml2js';

interface XmlGameItem {
	$: {
		id: string;
		type: string;
	};
	name: Array<{
		$: {
			type: string;
			value: string;
		};
	}>;
	yearpublished: Array<{
		$: {
			value: string;
		};
	}>;
	description: string[];
	image?: string[];
	thumbnail?: string[];
	minplayers: Array<{
		$: {
			value: string;
		};
	}>;
	maxplayers: Array<{
		$: {
			value: string;
		};
	}>;
	playingtime: Array<{
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
	minage?: Array<{
		$: {
			value: string;
		};
	}>;
	statistics?: Array<{
		ratings: Array<{
			average: Array<{
				$: {
					value: string;
				};
			}>;
			usersrated: Array<{
				$: {
					value: string;
				};
			}>;
			bayesaverage: Array<{
				$: {
					value: string;
				};
			}>;
			stddev: Array<{
				$: {
					value: string;
				};
			}>;
			median: Array<{
				$: {
					value: string;
				};
			}>;
		}>;
	}>;
}

interface BggGame extends IDataObject {
	id: string;
	name: string;
	yearpublished?: string;
	description?: string;
	image?: string;
	thumbnail?: string;
	minplayers?: string;
	maxplayers?: string;
	playingtime?: string;
	minplaytime?: string;
	maxplaytime?: string;
	minage?: string;
	statistics?: {
		ratings: {
			average: string;
			usersrated: string;
			bayesaverage: string;
			stddev: string;
			median: string;
		};
	};
}

interface BggSearchResult {
	items: {
		item: Array<{
			$: {
				id: string;
				type: string;
			};
			name: Array<{
				$: {
					type: string;
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

interface BggHotnessItem {
	$: {
		id: string;
		rank: string;
	};
	thumbnail: Array<{
		$: {
			value: string;
		};
	}>;
	name: Array<{
		$: {
			value: string;
		};
	}>;
	yearpublished: Array<{
		$: {
			value: string;
		};
	}>;
}

interface BggHotness {
	items: {
		item: BggHotnessItem[];
	};
}

export class Bgg implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BoardGameGeek',
		name: 'bgg',
		icon: 'file:icon.svg',
		group: ['input'],
		version: [1, 3, 0],
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with BoardGameGeek API (Built: ' + new Date().toISOString() + ')',
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
						description: 'Get detailed game information using ID',
						action: 'Get detailed information about a specific game',
					},
					{
						name: 'Get Forum Threads',
						value: 'getForumThreads',
						description: 'Get threads from a specific forum type',
						action: 'Get threads from a specific forum type',
					},
					{
						name: 'Get Articles in Thread',
						value: 'getThread',
						description: 'Get articles in a specific forum thread',
						action: 'Get articles in a specific forum thread',
					},
					{
						name: 'Search Games',
						value: 'searchGames',
						description: 'Search for games by name',
						action: 'Search for games by name',
					},
					{
						name: 'Get Hotness',
						value: 'getHotness',
						description: 'Get the current hot games on BGG',
						action: 'Get the current hot games on BGG',
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
						operation: ['getGame', 'getForumThreads'],
					},
				},
				description: 'The ID of the game to retrieve',
			},
			{
				displayName: 'Forum Type',
				name: 'forumType',
				type: 'options',
				required: true,
				default: 'general',
				options: [
					{
						name: 'General',
						value: 'general',
						description: 'Get threads from the General forum',
					},
					{
						name: 'News',
						value: 'news',
						description: 'Get threads from the News forum',
					},
					{
						name: 'Reviews',
						value: 'reviews',
						description: 'Get threads from the Reviews forum',
					},
					{
						name: 'Rules',
						value: 'rules',
						description: 'Get threads from the Rules forum',
					},
					{
						name: 'Sessions',
						value: 'sessions',
						description: 'Get threads from the Sessions forum',
					},
					{
						name: 'Strategy',
						value: 'strategy',
						description: 'Get threads from the Strategy forum',
					},
					{
						name: 'Variants',
						value: 'variants',
						description: 'Get threads from the Variants forum',
					},
					{
						name: 'Crowdfunding',
						value: 'crowdfunding',
						description: 'Get threads from the Crowdfunding forum',
					},
				],
				displayOptions: {
					show: {
						operation: ['getForumThreads'],
					},
				},
				description: 'The type of forum to get threads from',
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
				default: 1,
				displayOptions: {
					show: {
						operation: ['getGame', 'getForumThreads'],
					},
				},
				description: 'Page number of threads to retrieve',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 50,
				displayOptions: {
					show: {
						operation: ['getForumThreads'],
					},
				},
				description: 'Number of threads per page',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				default: 'mostRecent',
				displayOptions: {
					show: {
						operation: [
							'getForumThreads',
						],
					},
				},
				options: [
					{
						name: 'Most Recent Activity',
						value: 'mostRecent',
					},
					{
						name: 'Newest Threads',
						value: 'newest',
					},
					{
						name: 'Most Active',
						value: 'mostActive',
					},
					{
						name: 'Alphabetical',
						value: 'alphabetical',
					},
				],
				description: 'How to sort the forum threads',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				default: 'desc',
				displayOptions: {
					show: {
						operation: [
							'getForumThreads',
						],
					},
				},
				options: [
					{
						name: 'Ascending',
						value: 'asc',
					},
					{
						name: 'Descending',
						value: 'desc',
					},
				],
				description: 'The order to sort the results',
			},
			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['getThread'],
					},
				},
				description: 'The ID of the thread to retrieve',
			},
			{
				displayName: 'Return Raw Response',
				name: 'rawResponse',
				type: 'boolean',
				default: false,
				description: 'Whether to return the raw XML response instead of parsed JSON',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;

		for (let i = 0; i < length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const rawResponse = this.getNodeParameter('rawResponse', i, false) as boolean;

				if (operation === 'getGame') {
					const gameId = this.getNodeParameter('gameId', i) as string;
					if (!gameId) {
						throw new NodeOperationError(this.getNode(), 'Game ID is required');
					}

					const response = await this.helpers.request({
						method: 'GET',
						url: `https://boardgamegeek.com/xmlapi2/thing?id=${gameId}&stats=1`,
						headers: {
							'Accept': 'application/xml',
						},
					});

					if (rawResponse) {
						returnData.push({
							json: {
								rawResponse: response
							}
						});
						continue;
					}

					const result = await parseStringPromise(response) as { items: { item: XmlGameItem[] } };
					const items = result.items.item;

					if (!items || items.length === 0) {
						throw new NodeOperationError(this.getNode(), 'No game found with the given ID');
					}

					const game = items[0];
					const gameData: BggGame = {
						id: game.$.id,
						name: Array.isArray(game.name) ? game.name.find(n => n.$.type === 'primary')?.$?.value || game.name[0].$.value : '',
						yearpublished: game.yearpublished?.[0].$.value,
						description: game.description?.[0],
						image: game.image?.[0],
						thumbnail: game.thumbnail?.[0],
						minplayers: game.minplayers?.[0].$.value,
						maxplayers: game.maxplayers?.[0].$.value,
						playingtime: game.playingtime?.[0].$.value,
						minplaytime: game.minplaytime?.[0].$.value,
						maxplaytime: game.maxplaytime?.[0].$.value,
						minage: game.minage?.[0].$.value,
					};

					if (game.statistics?.[0]?.ratings?.[0]) {
						const ratings = game.statistics[0].ratings[0];
						gameData.statistics = {
							ratings: {
								average: ratings.average?.[0].$.value || '0',
								usersrated: ratings.usersrated?.[0].$.value || '0',
								bayesaverage: ratings.bayesaverage?.[0].$.value || '0',
								stddev: ratings.stddev?.[0].$.value || '0',
								median: ratings.median?.[0].$.value || '0',
							},
						};
					}

					returnData.push({
						json: gameData
					});
				} else if (operation === 'searchGames') {
					const searchQuery = this.getNodeParameter('searchQuery', i) as string;
					if (!searchQuery) {
						throw new NodeOperationError(this.getNode(), 'Search query is required');
					}

					const response = await this.helpers.request({
						method: 'GET',
						url: `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(searchQuery)}&type=boardgame`,
						headers: {
							'Accept': 'application/xml',
						},
					});

					if (rawResponse) {
						returnData.push({
							json: {
								rawResponse: response
							}
						});
						continue;
					}

					const result = await parseStringPromise(response);

					if (!result.items || !result.items.item || result.items.item.length === 0) {
						throw new NodeOperationError(this.getNode(), 'No games found matching the search query');
					}

					const searchResults: BggSearchResult[] = result.items.item.map((item: { $: { id: string }; name: Array<{ $: { value: string } }> }) => ({
						id: item.$.id,
						name: item.name[0].$.value,
					}));

					returnData.push({
						json: {
							items: searchResults,
						},
					});
				} else if (operation === 'getForumThreads') {
					const gameId = this.getNodeParameter('gameId', i) as string;
					const page = this.getNodeParameter('page', i) as number;
					const count = this.getNodeParameter('count', i) as number;
					const forumType = this.getNodeParameter('forumType', i) as string;

					if (!gameId) {
						throw new Error('Game ID is required');
					}

					// First get the forum list to find the correct forum ID
					const forumListResponse = await this.helpers.request({
						method: 'GET',
						url: 'https://boardgamegeek.com/xmlapi2/forumlist',
						qs: {
							type: 'thing',
							id: gameId,
						},
					});

					const forumListResult = await parseStringPromise(forumListResponse) as BggForumList;
					
					// Find the forum based on type
					const targetForum = forumListResult.forums.forum.find(f => {
						const title = f.$.title.toLowerCase();
						return title.includes(forumType.toLowerCase());
					});

					if (!targetForum) {
						throw new Error(`${forumType} forum not found for game ${gameId}`);
					}

					// Then get the forum threads
					const forumResponse = await this.helpers.request({
						method: 'GET',
						url: 'https://boardgamegeek.com/xmlapi2/forum',
						qs: {
							id: targetForum.$.id,
							page,
							count,
						},
					});

					const forumResult = await parseStringPromise(forumResponse, {
						mergeAttrs: true,
						explicitArray: false
					});

					// Clean up the structure
					const cleanResult: ForumResponse = {
						forumId: forumResult.forum.id,
						forumTitle: forumResult.forum.title,
						threadCount: parseInt(forumResult.forum.numthreads, 10),
						postCount: parseInt(forumResult.forum.numposts, 10),
						lastPostDate: new Date(forumResult.forum.lastpostdate).toISOString(),
						threads: []
					};

					// Handle both single thread and multiple thread cases
					if (forumResult.forum.threads?.thread) {
						const threads = Array.isArray(forumResult.forum.threads.thread) 
							? forumResult.forum.threads.thread 
							: [forumResult.forum.threads.thread];
						
						cleanResult.threads = threads.map((thread: any) => ({
							id: thread.id,
							subject: thread.subject,
							author: thread.author,
							numArticles: parseInt(thread.numarticles, 10),
							postDate: new Date(thread.postdate).toISOString(),
							lastPostDate: new Date(thread.lastpostdate).toISOString()
						}));
					}

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
				} else if (operation === 'getThread') {
					const threadId = this.getNodeParameter('threadId', i) as string;
					if (!threadId) {
						throw new NodeOperationError(this.getNode(), 'Thread ID is required');
					}

					responseData = await this.helpers.request({
						method: 'GET',
						url: `https://boardgamegeek.com/xmlapi2/thread?id=${threadId}`,
						headers: {
							'Accept': 'application/xml',
						},
					});
					console.log('Raw Thread XML Response:', responseData);
					
					if (rawResponse) {
						returnData.push({
							json: {
								rawResponse: responseData
							}
						});
						continue;
					}

					const result = await parseStringPromise(responseData, {
						mergeAttrs: true,
						explicitArray: false
					});
					console.log('Parsed Thread Response:', JSON.stringify(result, null, 2));
					
					if (!result.thread) {
						throw new NodeOperationError(this.getNode(), 'Thread not found');
					}

					const articles = result.thread.articles?.article || [];
					const articlesArray = Array.isArray(articles) ? articles : [articles];
					
					returnData.push({
						json: {
							id: result.thread.id,
							subject: result.thread.subject,
							numArticles: parseInt(result.thread.numarticles, 10),
							link: result.thread.link,
							articles: articlesArray.map((article: any) => ({
								id: article.id,
								username: article.username,
								link: article.link,
								postDate: article.postdate,
								editDate: article.editdate,
								numEdits: parseInt(article.numedits || '0', 10),
								subject: article.subject || '',
								body: article.body || ''
							}))
						},
					});
				} else if (operation === 'getHotness') {
					responseData = await this.helpers.request({
						method: 'GET',
						url: 'https://boardgamegeek.com/xmlapi2/hot?type=boardgame',
						headers: {
							'Accept': 'application/xml',
						},
					});

					if (rawResponse) {
						returnData.push({
							json: {
								rawResponse: responseData
							}
						});
						continue;
					}

					const result = await parseStringPromise(responseData) as BggHotness;

					if (!result.items || !result.items.item) {
						returnData.push({
							json: {
								items: [],
							},
						});
						continue;
					}

					const hotItems = result.items.item.map((item) => ({
						id: item.$.id,
						rank: parseInt(item.$.rank, 10),
						name: item.name[0].$.value || '',
						yearPublished: item.yearpublished?.[0]?.$.value || '',
						thumbnail: item.thumbnail?.[0]?.$.value || '',
					}));

					returnData.push({
						json: {
							items: hotItems,
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
				throw new NodeOperationError(this.getNode(), error instanceof Error ? error.message : 'An unknown error occurred');
			}
		}

		return [returnData];
	}
} 
import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BggApi implements ICredentialType {
	name = 'bggApi';
	displayName = 'BoardGameGeek API';
	documentationUrl = 'https://boardgamegeek.com/wiki/page/BGG_XML_API2';
	properties: INodeProperties[] = [];
} 
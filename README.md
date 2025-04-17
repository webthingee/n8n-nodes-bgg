# n8n-nodes-bgg

This is an n8n community node. It lets you use BoardGameGeek in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Troubleshooting](#troubleshooting)  
[Version History](#version-history)  

## Features

- Get detailed game information
- Search for games
- Get forum threads
- Get articles in a thread
- Get current hot games

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
npm install n8n-nodes-bgg
```

2. Restart your n8n instance

## Operations

- Get Game: Get detailed game information using ID
- Get Forum Threads: Get threads from a specific forum type
- Get Articles in Thread: Get articles in a specific forum thread
- Search Games: Search for games by name
- Get Hotness: Get the current hot games on BGG

## Credentials

This node does not require credentials as it uses the public BGG XML API.

## Compatibility

Tested with n8n version 1.0.0 and later.

## Usage

1. Install the node
2. Add it to your workflow
3. Configure the operation and parameters
4. Run the workflow

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [BGG XML API documentation](https://boardgamegeek.com/wiki/page/BGG_XML_API2)

## Troubleshooting

If you encounter any issues while installing or using this node, please refer to our [Troubleshooting Guide](TROUBLESHOOTING.md).

Common issues and their solutions are documented there, including:
- Installation errors
- Version number conflicts
- Database-related issues
- Node registration problems

## Version History

### 1.3.0
- Fixed version number format
- Updated error handling
- Added proper dependency structure
- Resolved duplicate node registration issue

### 1.0.0
- Initial release
- Basic BGG API integration
- Game information retrieval
- Forum thread access
- Search functionality

## Development Notes

See [docs/DEVELOPMENT_NOTES.md](docs/DEVELOPMENT_NOTES.md) for detailed information about the development process and future improvements.

## License

[MIT](LICENSE) 
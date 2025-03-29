# n8n-nodes-bgg

This is an n8n community node for interacting with the BoardGameGeek (BGG) API. It allows you to search for board games and retrieve detailed information about specific games.

## Features

- Search for board games by name
- Get detailed information about a specific game using its ID
- No authentication required - uses BGG's public API

## Installation

### In n8n:
1. Go to Settings > Community Nodes
2. Click on "Install Community Node"
3. Enter `n8n-nodes-bgg`
4. Click "Install"

### Docker users:
After installing the node, restart your n8n container for the node to appear in the nodes menu.

## Usage

### Search Games
1. Add a "BoardGameGeek" node to your workflow
2. Select "Search Games" as the operation
3. Enter your search query (e.g., "Catan", "Pandemic")
4. The node will return a list of matching games with their IDs and publication years

### Get Game Details
1. Add a "BoardGameGeek" node to your workflow
2. Select "Get Game" as the operation
3. Enter the game ID (you can get this from the search operation)
4. The node will return detailed game information including:
   - Name
   - Description
   - Player count
   - Playing time
   - Year published
   - Images
   - And more!

## Example Response

### Search Games
```json
{
  "items": [
    {
      "id": "13",
      "type": "boardgame",
      "name": "Catan",
      "yearPublished": "1995"
    }
  ]
}
```

### Get Game Details
```json
{
  "id": "13",
  "type": "boardgame",
  "name": "Catan",
  "description": "...",
  "minPlayers": "3",
  "maxPlayers": "4",
  "playingTime": "120",
  "yearPublished": "1995"
}
```

## License

[MIT](LICENSE.md) 
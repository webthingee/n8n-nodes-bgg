# n8n-nodes-bgg

This is an n8n community node for interacting with the BoardGameGeek (BGG) API. It allows you to search for board games and retrieve detailed information about specific games.

## Documentation

For detailed information about the BGG XML API2, see [BGG API Documentation](docs/BGG_API.md).

## Features

- Search for board games by name
- Get detailed information about a specific game using its ID
- Get rules forum threads for a specific game
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

### Get Rules Forum Threads
1. Add a "BoardGameGeek" node to your workflow
2. Select "Get Rules Forum Threads" as the operation
3. Enter the game ID
4. Optionally set:
   - Page number and number of threads per page
   - Sort By: How to sort the threads
     - Most Recent (default): Sort by most recent activity
     - Newest Threads: Sort by thread creation date
     - Most Active: Sort by number of articles
     - Alphabetical: Sort by thread subject
   - Sort Order:
     - Descending (default): Newest/highest first
     - Ascending: Oldest/lowest first
5. The node will return:
   - Forum information:
     - Forum ID
     - Title
     - Description
     - Number of threads
     - Number of posts
     - Last post date
   - List of threads including:
     - Thread ID
     - Subject
     - Author
     - Number of articles
     - Post date
     - Last post date

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

### Get Rules Forum Threads
```json
{
  "forum": {
    "id": "4415662",
    "title": "Rules",
    "description": "Post any rules questions you have here.",
    "numThreads": "107",
    "numPosts": "489",
    "lastPostDate": "2024-04-15 16:26:35"
  },
  "threads": [
    {
      "id": "3494792",
      "subject": "Abyssal reel",
      "author": "KevinQ9",
      "numArticles": "5",
      "postDate": "2024-04-12 08:58:45",
      "lastPostDate": "2024-04-15 16:26:35"
    }
  ]
}
```

## License

[MIT](LICENSE.md) 
# n8n-nodes-bgg

This is an n8n community node for interacting with the BoardGameGeek (BGG) API. It allows you to search for board games and retrieve detailed information about specific games.

## Features

- Search for board games by name
- Get detailed information about a specific game using its ID
- Get forum threads for a specific game (Rules, Reviews, General, Strategy, Variants, News, Crowdfunding, Sessions)
- Get detailed information about a specific forum thread
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

### Get Forum Threads
1. Add a "BoardGameGeek" node to your workflow
2. Select "Get Forum Threads" as the operation
3. Enter the game ID
4. Select the forum type (Rules, Reviews, General, etc.)
5. Optionally set:
   - Page number and number of threads per page
   - Sort By: How to sort the threads
     - Most Recent (default): Sort by most recent activity
     - Newest Threads: Sort by thread creation date
     - Most Active: Sort by number of articles
     - Alphabetical: Sort by thread subject
   - Sort Order:
     - Descending (default): Newest/highest first
     - Ascending: Oldest/lowest first
6. The node will return:
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

### Get Thread
1. Add a "BoardGameGeek" node to your workflow
2. Select "Get Thread" as the operation
3. Enter the thread ID (you can get this from the Get Forum Threads operation)
4. The node will return detailed thread information including:
   - Thread ID
   - Subject
   - Number of articles
   - Link to the thread
   - List of articles with:
     - Article ID
     - Username
     - Link to the article
     - Post date
     - Edit date (if edited)
     - Number of edits
     - Subject
     - Body content

## Example Responses

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

### Get Forum Threads
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

### Get Thread
```json
{
  "id": "2393912",
  "subject": "Building villages",
  "numArticles": 4,
  "link": "https://boardgamegeek.com/thread/2393912/building-villages",
  "articles": [
    {
      "id": "2393912",
      "username": "user123",
      "link": "https://boardgamegeek.com/article/2393912",
      "postDate": "2024-04-10 14:30:00",
      "editDate": "2024-04-10 15:45:00",
      "numEdits": 1,
      "subject": "Building villages",
      "body": "How do I build villages in this game?"
    }
  ]
}
```

## Documentation

For detailed information about the BGG XML API2, see [BGG API Documentation](docs/BGG_API.md).

For development notes and history, see [Development Notes](docs/DEVELOPMENT_NOTES.md).

## License

[MIT](LICENSE.md) 
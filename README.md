# n8n-nodes-bgg

A custom n8n node for interacting with the BoardGameGeek (BGG) XML API2.

## Features

- Get detailed game information
- Search for games
- Get forum threads
- Get current hot games

## Installation

1. Install the package in your n8n custom nodes directory:
```bash
npm install n8n-nodes-bgg
```

2. Restart your n8n instance

## Usage

### Get Game
Retrieves detailed information about a specific game using its BGG ID.

Example response:
```json
{
  "id": "13",
  "name": "Catan",
  "description": "The game of Catan...",
  "yearPublished": "1995",
  "minPlayers": "3",
  "maxPlayers": "4",
  "playingTime": "90",
  "minAge": "10",
  "image": "https://cf.geekdo-images.com/...",
  "thumbnail": "https://cf.geekdo-images.com/...",
  "mechanics": [
    "Dice Rolling",
    "Hand Management",
    "Trading"
  ]
}
```

### Search Games
Searches for games by name.

Example response:
```json
{
  "items": [
    {
      "id": "13",
      "name": "Catan",
      "yearPublished": "1995"
    }
  ]
}
```

### Get Forum Threads
Retrieves threads from a specific forum type for a game.

Example response:
```json
{
  "forumId": "123",
  "forumTitle": "General",
  "threadCount": 50,
  "postCount": 200,
  "lastPostDate": "2024-03-20T12:00:00Z",
  "threads": [
    {
      "id": "456",
      "subject": "First game impressions",
      "author": "user123",
      "numArticles": 10,
      "postDate": "2024-03-19T10:00:00Z",
      "lastPostDate": "2024-03-20T12:00:00Z"
    }
  ]
}
```

### Get Hotness
Retrieves the current hot games on BGG.

Example response:
```json
{
  "items": [
    {
      "id": "13",
      "rank": 1,
      "name": "Catan",
      "yearPublished": "1995",
      "thumbnail": "https://cf.geekdo-images.com/..."
    }
  ]
}
```

## Development Notes

See [docs/DEVELOPMENT_NOTES.md](docs/DEVELOPMENT_NOTES.md) for detailed information about the development process and future improvements.

## License

[MIT](LICENSE) 
# n8n Node Development Guide

## Starting a New n8n Node Project

### Recommended Approach
For new n8n node projects, it's highly recommended to start with the [official n8n-nodes-starter template](https://github.com/n8n-io/n8n-nodes-starter/tree/master). This template provides:

1. Proper project structure
2. Pre-configured linting
3. All required dependencies
4. Example nodes and credentials
5. Development environment setup

### Starting from Scratch
1. Generate new repository from the starter template
2. Clone your repository:
```bash
git clone https://github.com/<your organization>/<your-repo-name>.git
```
3. Install dependencies:
```bash
pnpm i
```
4. Follow the starter template's README for setup

### Key Learnings from n8n-nodes-bgg
When developing your node, remember these crucial points:

1. Version Management:
   - Node version in .ts file: Use single integer (`version: 1`)
   - Package version in package.json: Use semantic versioning (`"version": "1.3.0"`)

2. Error Handling:
```typescript
import { NodeOperationError } from 'n8n-workflow';
throw new NodeOperationError(this.getNode(), 'Error message');
```

3. Required Dependencies:
```json
"devDependencies": {
  "@typescript-eslint/eslint-plugin": "^5.45",
  "@typescript-eslint/parser": "~5.45",
  "eslint": "^8.24.0",
  "eslint-plugin-n8n-nodes-base": "^1.11.0"
}
```

## Development Process 
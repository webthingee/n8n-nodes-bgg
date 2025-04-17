# n8n-nodes-bgg Troubleshooting Guide

This document outlines common issues encountered with the BoardGameGeek n8n node and their solutions.

## Installation Issues

### Error: "invalid input syntax for type integer"

**Error Message:**
```
Error loading package "n8n-nodes-bgg": Failed to save installed package
Cause: invalid input syntax for type integer: "1.3"
```

**Solution:**
1. Ensure the node version in `nodes/Bgg/Bgg.node.ts` is set to a single integer:
```typescript
version: 1,
```
2. Keep the package version in `package.json` in semver format:
```json
"version": "1.3.0"
```
3. Rebuild and publish the package
4. If the error persists, try restarting the PostgreSQL database

### Duplicate Nodes in n8n Interface

**Symptom:** Multiple instances of the BoardGameGeek node appear in the n8n nodes list (one with ⚡ and one without)

**Solution:**
1. Restart the n8n server
   - For Railway: Use the Railway dashboard to restart the service
   - For local development: `npm restart`

This clears the node registration cache and ensures proper node registration.

## Development Guidelines

### Version Numbers
- Node version in `Bgg.node.ts`: Use single integer (`version: 1`)
- Package version in `package.json`: Use semver format (`"version": "1.3.0"`)

### Error Handling
Use n8n's built-in error types:
```typescript
import { NodeOperationError } from 'n8n-workflow';

// Example usage
throw new NodeOperationError(this.getNode(), 'Game ID is required');
```

### Required Dependencies
Ensure these are in your `package.json`:
```json
"devDependencies": {
  "@typescript-eslint/eslint-plugin": "^5.45",
  "@typescript-eslint/parser": "~5.45",
  "eslint": "^8.24.0",
  "eslint-plugin-n8n-nodes-base": "^1.11.0"
}
```

## Publishing Process

1. Update version numbers:
   - `Bgg.node.ts`: Update `version` if needed
   - `package.json`: Increment version number

2. Build and test locally:
```bash
npm run build
```

3. Publish to npm:
```bash
npm publish
```

4. If you get a 403 error about publishing over an existing version:
   - Wait 24 hours if you recently unpublished
   - Increment the version number in `package.json`

## Database Issues

If you encounter database-related errors:

1. Check PostgreSQL status
2. Try restarting PostgreSQL
3. Verify n8n has proper database permissions
4. Check database connection settings

## Common Error Messages and Solutions

### "Failed to save installed package"
- Check node version format
- Verify package.json version
- Restart PostgreSQL
- Restart n8n server

### npm Publishing Errors
- **403 Forbidden**: Wait 24 hours after unpublishing before republishing
- **Version exists**: Increment version number in package.json

## Support and Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/)
- [BGG API Documentation](https://boardgamegeek.com/wiki/page/BGG_XML_API2)
- [GitHub Repository](https://github.com/seanlange/n8n-nodes-bgg)

## Changelog

### Version 1.3.0
- Fixed version number format
- Updated error handling to use n8n error types
- Added proper dependency structure
- Resolved duplicate node registration issue 

## Version Management

### Correct Version Format
To avoid database and installation issues, maintain these version formats:

1. In `nodes/Bgg/Bgg.node.ts`:
```typescript
description: INodeTypeDescription = {
    // ... other properties ...
    version: 1,  // ALWAYS use a single integer
    // ... other properties ...
}
```

2. In `package.json`:
```json
{
    "name": "n8n-nodes-bgg",
    "version": "1.3.0",  // Use semantic versioning (major.minor.patch)
    // ... other properties ...
}
```

### Version Increment Process
When developing new features:

1. Keep node version as `1` in `Bgg.node.ts`
2. Increment package.json version according to changes:
   - Patch (1.3.0 → 1.3.1): Bug fixes
   - Minor (1.3.1 → 1.4.0): New features
   - Major (1.4.0 → 2.0.0): Breaking changes

3. Create and push git tag:
```bash
git tag -a v1.4.0 -m "Version 1.4.0 - Feature description"
git push origin v1.4.0
```

4. Create GitHub release with release notes

### Common Version Mistakes to Avoid
❌ DO NOT:
- Use arrays for node version: `version: [1, 4]`
- Use decimals for node version: `version: 1.4`
- Skip creating git tags
- Forget to push tags to GitHub

✅ DO:
- Keep node version as single integer
- Use semantic versioning in package.json
- Document all version changes
- Create and push git tags
- Create GitHub releases 
# MCP and AI Workflow

## Why MCP Helps

Model Context Protocol lets your AI coding tools interact with external services directly, which is useful for testing, debugging, and fast prototyping.

## Best Use Cases

- Test provider ordering from AI tools.
- Check account balance while building.
- Wait for incoming SMS during development.
- Generate code for rental and webhook flows.
- Automate repetitive admin tasks.

## Dev Workflow

1. Connect the provider MCP server in your AI editor.
2. Ask the assistant to create a test order.
3. Confirm SMS arrival.
4. Inspect the response payload.
5. Use the confirmed payload shape in your Next.js API routes.

## Production Guidance

- Use MCP for developer tooling.
- Use normal HTTP APIs for the public app.
- Keep user-facing features independent from the AI workflow.
- Store API keys securely and rotate them regularly.

## Practical Prompt Examples

- Create a rental order for WhatsApp in Thailand.
- Wait for the SMS and return the code.
- List the cheapest country for Telegram.
- Show my current balance.
- Cancel expired orders older than 20 minutes.

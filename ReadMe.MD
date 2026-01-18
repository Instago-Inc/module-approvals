# module/approvals - V8 module

Keep human approvals simple and traceable without setting up a full ticketing flow. This module helps workflows request, check, and finalize decisions with minimal ceremony.

Use it anywhere you need a quick yes/no gate with context. Learn more at https://instago.ai.

## Technical reference

All functions return `{ ok, data, error }` with `data` set on success.

### Exports
- `request({ id, text, channels?, metadata?, workflow? })`
- `status({ id, workflow? })`
- `complete({ id, decision: 'approved'|'rejected', note?, workflow? })`

### Usage
```js
const approvals = require('approvals@latest');

await approvals.request({
  id: 'leave-123',
  text: 'Approve PTO for Jane?',
  channels: ['email:jane@example.com'],
  metadata: { days: 3 }
});

const current = await approvals.status({ id: 'leave-123' });
```

### Configuration
No environment keys are required or optional (`env.json` is empty).

### Examples
```js
const approvals = require('approvals@latest');

await approvals.complete({
  id: 'leave-123',
  decision: 'approved',
  note: 'Enjoy!'
});
```

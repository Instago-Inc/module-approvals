# module/approvals - V8 module

Make lightweight human approvals part of your workflows without wiring up a full ticketing system. This module stores simple approval records so steps can pause, check, and finalize decisions consistently.

Use it anywhere you need a quick yes/no decision with a bit of context. Learn more about the platform at https://instago.ai.

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

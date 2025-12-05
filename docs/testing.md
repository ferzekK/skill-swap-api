# Testing Report

## Mutation Testing (Stryker)

| File                 | Score  | Killed | Survived | Errors |
|----------------------|--------|--------|----------|--------|
| exchange.service.ts  | 100%   | 142    | 0        | 16     |

**Config:** Only `src/exchange/exchange.service.ts` was targeted to keep mutation runs fast (~2 min).

```
Mutation testing  [==========] 100% 158/158 tested (0 survived)
Ran 3.35 tests per mutant on average.
```

## Unit Tests

```
ExchangeService
  ✓ createExchange - 6 scenarios (create, requester/responder/skill not found, self-exchange)
  ✓ findAll - query options verified
  ✓ findById - include options verified  
  ✓ findByUserId - Op.or query verified
  ✓ findByStatus - where clause verified (PENDING/ACCEPTED/REJECTED)
  ✓ updateStatus - status mutations verified
  ✓ delete - destroy call verified
  ✓ count/countByStatus - where clause verified

Tests: 29 passed
Time:  ~0.7s
```

## E2E Tests

| Module   | Tests |
|----------|-------|
| Exchange | 16    |
| Users    | 10    |
| Skills   | 12    |
| Health   | 2     |
| **Total**| **40**|

Uses SQLite in-memory for isolation.

## Commands

```bash
npm run test           # unit tests
npm run test:e2e       # integration tests  
npm run test:mutation  # mutation testing
```

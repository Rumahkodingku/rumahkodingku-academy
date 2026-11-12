# NestJS Backend Architecture

**Project:** RumahKodingku Academy  
**Document:** `nestjs-architecture.md`  
**Document type:** Backend Technical Architecture Specification  
**Status:** Approved architecture baseline  
**Audience:** Backend developers, technical leads, reviewers, and AI coding agents  
**Backend framework:** NestJS 12  
**Runtime:** Node.js 24  
**Database:** MySQL 8  
**ORM:** TypeORM  
**Queue:** BullMQ  
**Cache and queue broker:** Redis  
**Monorepo:** pnpm Workspaces + Turborepo  
**API style:** REST, versioned under `/api/v1`

> **Normative language:** The words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements. MUST and MUST NOT are mandatory constraints. SHOULD and SHOULD NOT are strong recommendations that require a documented reason to deviate. MAY indicates an optional choice.

---

## 1. Purpose and Scope

### 1.1 Purpose

This document defines the target backend architecture for RumahKodingku Academy. It is the authoritative technical reference for designing, implementing, reviewing, testing, and operating the NestJS backend.

It is written for both human engineers and AI coding agents. It specifies not only architectural concepts, but also ownership, dependency boundaries, implementation rules, reliability requirements, and the procedure an agent must follow before changing code.

### 1.2 Goals

The backend architecture MUST:

- Support a production-oriented Learning Management System (LMS).
- Separate business capabilities into clearly owned domains.
- Keep business rules independent from HTTP transport and infrastructure details.
- Protect financial and learning-access workflows against duplicate or invalid operations.
- Support asynchronous processing without blocking API requests.
- Preserve data integrity and provide recoverable failure handling.
- Be testable at unit, integration, API, end-to-end, security, and performance levels.
- Remain operationally manageable as a modular monolith.
- Permit future extraction of a domain into a separate service only when justified by measured needs.

### 1.3 In Scope

This specification covers:

- Overall application architecture and monorepo organization.
- NestJS API and Worker applications.
- Feature-based domain modules and Adaptive Layered Architecture.
- Domain ownership and module boundaries.
- Inter-module service calls and domain events.
- Transactional Outbox and background processing.
- MySQL, TypeORM, migrations, repositories, and transactions.
- Authentication, authorization, API contracts, and security.
- Payment, enrollment, and learning workflow boundaries.
- Storage, cache, notifications, and WebSocket security.
- Testing, observability, deployment, and AI-agent instructions.

### 1.4 Out of Scope

The following require their own detailed specifications and MUST remain consistent with this document:

- Complete database schema, entity fields, indexes, and relationship diagrams.
- Complete API endpoint catalogue and request/response schemas.
- Detailed product requirements and business rules for every feature.
- Frontend architecture and UI/UX specifications.
- Infrastructure-as-code and environment-specific deployment manifests.
- Full CI/CD implementation.
- Detailed provider-specific payment integration procedures.

### 1.5 Repository Context and Verification Rule

The repository currently uses a pnpm workspace and Turborepo, with a Next.js web application, a NestJS API, a Fumadocs application, and shared packages including database, environment, and configuration packages. The intended backend stack includes MySQL, TypeORM, Redis, BullMQ, Socket.io, storage adapters, and payment integration.

This document describes the **target architecture**, not a claim that every target folder, module, processor, or capability already exists. Before modifying code, developers and AI agents MUST inspect the actual repository state, package exports, installed versions, and current implementation. Never assume a path or implementation exists solely because it appears in this specification.

---

## 2. Approved Architecture Decisions

| ID      | Area                       | Decision                                            | Status   |
| ------- | -------------------------- | --------------------------------------------------- | -------- |
| ADR-001 | Application style          | Modular Monolith                                    | Accepted |
| ADR-002 | Organization               | Feature-based domain modules                        | Accepted |
| ADR-003 | Internal module structure  | Adaptive Layered Architecture                       | Accepted |
| ADR-004 | Persistence                | MySQL 8 + TypeORM                                   | Accepted |
| ADR-005 | Database ownership         | Centralized `packages/db`                           | Accepted |
| ADR-006 | Inter-module communication | Direct Service + Domain Events                      | Accepted |
| ADR-007 | Background processing      | Separate API and Worker processes                   | Accepted |
| ADR-008 | Queue                      | BullMQ backed by Redis                              | Accepted |
| ADR-009 | Validation                 | Zod at application boundaries                       | Accepted |
| ADR-010 | Authentication             | JWT + HttpOnly cookies + persisted refresh sessions | Accepted |
| ADR-011 | Authorization              | RBAC + permissions + resource policies              | Accepted |
| ADR-012 | API errors                 | RFC 9457 Problem Details                            | Accepted |
| ADR-013 | API success response       | Consistent `{ data, meta }` envelope                | Accepted |
| ADR-014 | Testing                    | Comprehensive testing                               | Accepted |
| ADR-015 | Restructuring              | Full target-architecture restructure                | Accepted |
| ADR-016 | Critical event reliability | Transactional Outbox + idempotent consumers         | Required |
| ADR-017 | Payment integration        | Provider-neutral adapter, initially Midtrans        | Accepted |

Any change to an accepted decision MUST be recorded as an Architecture Decision Record (ADR) with context, alternatives, consequences, migration impact, and approval.

---

## 3. Core Architecture

### 3.1 Modular Monolith

The backend MUST be implemented as a Modular Monolith. Business domains live in one codebase and can be composed into the API and Worker applications, but each domain has explicit ownership and public interfaces.

A modular monolith is not a collection of folders with unrestricted cross-imports. Domain boundaries MUST be enforced in code review and, where practical, automated with lint or dependency-boundary tooling.

### 3.2 Why This Architecture

The platform contains interconnected capabilities such as course catalog, orders, payments, enrollments, progress, quizzes, projects, certificates, and community. These workflows benefit from simple deployment and shared database transactions, while still requiring strong ownership boundaries.

A modular monolith provides:

- Fewer deployment and network failure modes than premature microservices.
- Shared transaction capabilities where business invariants require them.
- Straightforward local development and debugging.
- Clear domain boundaries and independently testable use cases.
- A path to extract a domain later without requiring that extraction now.

Microservices MUST NOT be introduced merely because the project has many modules. Extraction requires evidence such as independent scaling needs, separate team ownership, isolation requirements, or operational constraints, plus a documented ADR.

### 3.3 High-Level Topology

```text
                         Next.js Web
                             |
                             v
                       NestJS API App
                             |
          +------------------+------------------+
          |                  |                  |
          v                  v                  v
     Domain Modules     API Infrastructure   WebSocket Gateway
          |                  |                  |
          +------------------+------------------+
                             |
                    +--------+--------+
                    |                 |
                    v                 v
                  MySQL             Redis
             source of truth     cache / broker
                                      |
                                      v
                                   BullMQ
                                      |
                                      v
                              NestJS Worker App
                                      |
                    +-----------------+-----------------+
                    |                 |                 |
                    v                 v                 v
                  Email          Notifications       Storage / Providers
```

### 3.4 Application Responsibilities

**API application** MUST:

- Expose versioned REST endpoints.
- Authenticate and authorize requests.
- Validate external input.
- Execute synchronous application use cases.
- Read and persist authoritative business state.
- Record durable outbox events for critical asynchronous consequences.
- Expose OpenAPI documentation and health/readiness endpoints.
- Provide structured logs, metrics, and request correlation.

**Worker application** MUST:

- Consume BullMQ jobs.
- Execute asynchronous workflows through shared domain use cases or application services.
- Handle retries, backoff, idempotency, and terminal failures.
- Run scheduled work under explicit coordination.
- Expose operational health information through the chosen runtime mechanism, without becoming a public REST API.

Both applications MAY share domain modules, repository implementations, database packages, event contracts, and infrastructure adapters. The Worker MUST NOT import API controllers or API bootstrap code. The API MUST NOT depend on Worker bootstrap code.

---

## 4. Monorepo and Package Architecture

### 4.1 Target Structure

```text
rumahkodingku-academy/
├── apps/
│   ├── web/                         # Next.js frontend
│   ├── api/                         # NestJS REST API
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/
│   │   │   ├── common/
│   │   │   ├── infrastructure/
│   │   │   └── config/
│   │   └── test/
│   ├── worker/                      # NestJS application context
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── worker.module.ts
│   │   │   ├── processors/
│   │   │   ├── schedulers/
│   │   │   └── config/
│   │   └── test/
│   └── docs/                        # Fumadocs
├── packages/
│   ├── db/                          # DataSource, entities, migrations
│   ├── env/                         # Environment parsing/validation
│   ├── config/                      # Shared tooling/application config
│   ├── contracts/                   # Stable event/integration contracts
│   └── types/                       # Technology-neutral shared types
├── docs/
│   ├── architecture/
│   ├── development/
│   └── product/
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

This is a target layout. Existing applications and packages SHOULD be reused where they already satisfy the responsibilities above. Do not create duplicate packages or move files mechanically without checking imports, build configuration, and runtime behavior.

### 4.2 Ownership

| Path                 | Owns                                                              | Must not own                           |
| -------------------- | ----------------------------------------------------------------- | -------------------------------------- |
| `apps/api`           | HTTP transport, API composition, API-specific guards/filters      | Business rules duplicated from domains |
| `apps/worker`        | Queue processors, worker bootstrap, schedules                     | Duplicate business workflows           |
| `apps/web`           | Frontend application                                              | Backend domain logic                   |
| `packages/db`        | DataSource, TypeORM entities, migrations, persistence subscribers | Business use cases and domain policies |
| `packages/env`       | Environment schema and parsing                                    | Business workflows                     |
| `packages/config`    | Shared configuration/tooling                                      | Runtime-specific hidden global state   |
| `packages/contracts` | Stable event and integration contracts                            | NestJS modules or persistence entities |
| `packages/types`     | Reusable technology-neutral types                                 | Domain-specific business behavior      |

### 4.3 Dependency Rules

- Applications MAY depend on shared packages.
- Shared packages MUST NOT import from `apps/api`, `apps/worker`, or `apps/web`.
- `packages/db` MUST NOT import domain modules or application modules.
- `packages/contracts` MUST remain transport- and framework-neutral.
- `packages/types` MUST NOT become a dumping ground for business logic.
- Domain modules MUST NOT import another domain's private files.
- Cross-domain access MUST use an exported public provider/use case or a documented event contract.

### 4.4 Package Boundaries

Each package MUST have explicit exports. Prefer package entry points over deep imports. Avoid importing files through undocumented internal paths such as `@scope/package/src/internal/...` from another package.

Workspace dependency versions and build outputs MUST remain compatible with the repository's package manager and Turborepo pipeline.

---

## 5. NestJS Application Composition

### 5.1 Composition Roots

`AppModule` and `WorkerModule` are composition roots. They register modules and infrastructure providers; they MUST NOT contain business workflows or become service locators.

### 5.2 API Bootstrap

The API bootstrap is responsible for HTTP concerns, including:

- Global API prefix and URI versioning.
- Global validation pipe.
- Global Problem Details exception filter.
- Helmet and secure HTTP headers.
- CORS allowlist and credential policy.
- Compression where appropriate.
- Cookie parsing.
- CSRF middleware/guard for cookie-authenticated mutations.
- Swagger/OpenAPI setup.
- WebSocket adapter setup where required.
- Graceful shutdown hooks.
- Listening on the configured port.

Illustrative example only; adapt it to the actual project providers and versions:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalFilters(app.get(ProblemDetailsFilter));
  app.useGlobalPipes(app.get(ZodValidationPipe));

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
```

The resulting public route convention is `/api/v1/...`. Do not accidentally add a second `api` prefix or duplicate version segments.

### 5.3 Worker Bootstrap

The Worker SHOULD use `NestFactory.createApplicationContext(WorkerModule)` so it does not initialize an unnecessary HTTP server.

```typescript
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();
}

void bootstrap();
```

The Worker must initialize only the providers it needs. It must close queue workers, Redis connections, database connections, and other resources during graceful shutdown.

### 5.4 Dependency Injection Lifecycle

Infrastructure clients such as Redis, database connections, mail clients, and storage clients SHOULD be managed by NestJS providers with explicit lifecycle ownership. Avoid unmanaged module-level singleton instances that are difficult to test or close cleanly.

Use configuration providers and validated environment values rather than reading arbitrary `process.env` values throughout business code.

---

## 6. Adaptive Layered Architecture

### 6.1 Principle

Every domain uses the simplest internal structure that preserves clear responsibilities. Complexity is added when business rules, workflows, integrations, transactions, or testing needs justify it.

There are three common levels. They are guidance, not rigid templates.

### 6.2 Level 1: Simple Domain

Appropriate for limited CRUD and straightforward business rules, such as a basic Wishlist implementation.

```text
wishlist/
├── wishlist.module.ts
├── wishlist.controller.ts
├── wishlist.service.ts
├── wishlist.repository.ts
├── dto/
└── entities/
```

Do not add empty layers merely to make the folder look sophisticated.

### 6.3 Level 2: Intermediate Domain

Appropriate when a domain has several distinct workflows and reusable policies, such as Reviews.

```text
reviews/
├── reviews.module.ts
├── reviews.controller.ts
├── use-cases/
│   ├── create-review/
│   ├── update-review/
│   └── delete-review/
├── services/
├── repositories/
├── dto/
├── entities/
└── mappers/
```

### 6.4 Level 3: Complex Domain

Appropriate for complex invariants, transaction boundaries, external providers, and durable events, such as Payments.

```text
payments/
├── payments.module.ts
├── payments.controller.ts
├── use-cases/
│   ├── create-payment/
│   ├── handle-payment-webhook/
│   ├── reconcile-payment/
│   └── get-payment-status/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── events/
│   └── policies/
├── services/
├── repositories/
├── providers/
├── dto/
├── mappers/
└── exceptions/
```

### 6.5 When to Add Layers

Add use cases, domain models, policies, repository abstractions, or adapters when one or more conditions apply:

- The domain contains multiple distinct application workflows.
- Business rules are difficult to understand in one service.
- Several workflows reuse a policy or invariant.
- Transactions span multiple writes.
- External integrations must be replaceable or isolated.
- Durable domain events are required.
- Unit testing is difficult because business logic is coupled to infrastructure.
- The domain has important state transitions that must be guarded.

### 6.6 Controller Responsibilities

Controllers are transport adapters. They MUST:

- Declare routes and HTTP metadata.
- Receive validated request data.
- Read authenticated request context.
- Invoke an application service or use case.
- Map the result to the documented HTTP response.

Controllers MUST NOT:

- Implement business rules.
- Inject TypeORM repositories directly.
- Manage transaction boundaries.
- Call provider SDKs directly.
- Contain complex orchestration across domains.
- Return raw persistence entities.

### 6.7 Use Case Responsibilities

A use case represents one meaningful application action, for example:

- `CreateOrderUseCase`
- `VerifyPaymentWebhookUseCase`
- `EnrollStudentUseCase`
- `CompleteLessonUseCase`
- `SubmitProjectUseCase`
- `IssueCertificateUseCase`

A use case coordinates domain rules, repositories, and public capabilities of other domains. It defines transaction boundaries where required and returns an application-level result. It must not become a generic class containing unrelated operations.

### 6.8 Service Responsibilities

Services SHOULD have cohesive responsibilities, such as `CoursePricingService`, `PaymentValidationService`, or `CertificateEligibilityService`. Avoid large “god services” with unrelated methods.

### 6.9 Repository Responsibilities

Repositories encapsulate persistence queries and writes. Their methods SHOULD express meaningful query intent. They must support transaction-scoped operations where needed and must not expose another domain's private persistence implementation.

Avoid generic repository abstractions that obscure query behavior or prevent efficient, explicit queries.

### 6.10 DTOs and Mappers

DTOs define transport input/output contracts. Mappers convert between persistence entities, domain objects, application results, and API response objects. TypeORM entities MUST NOT be returned directly from public API endpoints.

---

## 7. Domain Modules and Ownership

### 7.1 Initial Domain Catalogue

| Domain            | Primary responsibility                       | Owns (conceptually)                                   |
| ----------------- | -------------------------------------------- | ----------------------------------------------------- |
| Auth              | Authentication and session lifecycle         | Refresh sessions, authentication workflows            |
| Users             | User profile and account management          | User profile/account data                             |
| Courses           | Course content and management                | Course, lesson, curriculum rules                      |
| Catalog           | Public discovery and browse/read models      | Catalog queries and discovery behavior                |
| Orders            | Purchase order lifecycle                     | Orders and order items                                |
| Payments          | Payment transaction and provider integration | Payment transactions, webhook records                 |
| Refunds           | Refund workflows                             | Refund requests and refund lifecycle                  |
| Enrollments       | Learning access ownership                    | Enrollment records and access state                   |
| Learning Progress | Lesson and course progress                   | Progress and completion records                       |
| Quizzes           | Quiz definitions, attempts, grading          | Quiz attempts and results                             |
| Roadmaps          | Learning pathways and unlocking              | Roadmap structure and progression rules               |
| Projects          | Final project submissions and evaluation     | Submission records and versions                       |
| Certificates      | Eligibility, issuance, verification          | Certificate records and issuance state                |
| Community         | Discussion and community interactions        | Community content and moderation state                |
| Reviews           | Course reviews and ratings                   | Review records and eligibility rules                  |
| Wishlist          | Saved/favorite courses                       | Wishlist records                                      |
| Coupons           | Discount and coupon rules                    | Coupon definitions and redemption state               |
| Notifications     | In-app and external notifications            | Notification records and delivery state               |
| Uploads           | Upload workflow and validation               | Upload metadata and ownership associations            |
| Admin             | Administrative application workflows         | Admin-specific orchestration, not every domain's data |
| Analytics         | Reporting and aggregation                    | Derived analytics/read models                         |
| Audit             | Audit trail                                  | Audit records                                         |

The exact table names and entity ownership must be confirmed in the database specification. This catalogue defines logical ownership, not an instruction to create every entity immediately.

### 7.2 Ownership Rules

Each domain owns its business rules and authoritative write operations. Examples:

- Courses owns course and lesson business rules.
- Orders owns order creation and order lifecycle.
- Payments owns payment transaction state and verification.
- Enrollments owns course access records.
- Learning Progress owns lesson completion records.
- Certificates owns certificate issuance records.

A domain MAY expose read/query capabilities to other domains through a public provider. A domain MUST NOT allow other domains to mutate its tables through private repositories.

### 7.3 Cross-Domain Access

Allowed:

```text
CreateOrderUseCase
       |
       v
CoursesService.getPurchasableCourse(courseId)
```

Prohibited:

```text
CreateOrderUseCase
       |
       v
CoursesRepository.findOne(...) // private repository of another domain
```

### 7.4 Admin Module Boundary

The Admin module coordinates administrative use cases and authorization. It MUST NOT become the owner of course, payment, user, or enrollment business rules. Administrative operations should invoke the owning domain's public application interface and record required audit events.

### 7.5 Shared Capabilities

Before creating shared code, determine whether it is:

- A technology-neutral utility.
- A shared integration contract.
- A genuinely shared domain concept.
- A public capability owned by an existing domain.
- A new domain that deserves explicit ownership.

Do not move business rules into `common`, `shared`, or `utils` merely to avoid importing the owning domain.

---

## 8. Inter-Module Communication

### 8.1 Approved Strategy

The project uses **Direct Service + Domain Events**:

- Use direct service/use-case invocation when the caller requires an immediate result to continue its own operation.
- Use domain events for asynchronous consequences of a business fact.
- Use a durable outbox for critical events that must not be lost after a database commit.

### 8.2 Direct Service Communication

Illustrative example:

```typescript
@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async execute(input: CreateOrderInput) {
    const course = await this.coursesService.getPurchasableCourse(input.courseId);

    // Continue order creation using the returned contract.
  }
}
```

Rules:

- Import only public exported providers.
- Keep cross-domain calls explicit.
- Avoid importing private implementation files.
- Avoid circular dependencies.
- Avoid long synchronous call chains across many domains.
- If a dependency cycle appears, reconsider ownership and workflow orchestration before using `forwardRef`.

### 8.3 Domain Event Semantics

Domain events describe facts that have happened and SHOULD use past-tense names. Examples:

- `PaymentVerified`
- `EnrollmentCreated`
- `LessonCompleted`
- `ProjectApproved`
- `CertificateIssued`
- `RefundCompleted`

Do not use an event to disguise a synchronous request/response dependency. Events are appropriate when the producer does not need an immediate result from each consumer.

### 8.4 Event Contract

Event contracts MUST be technology-neutral and MUST NOT expose TypeORM entity instances or NestJS-specific classes.

Illustrative contract:

```typescript
export interface PaymentVerifiedEvent {
  eventId: string;
  eventType: "payment.verified";
  eventVersion: 1;
  occurredAt: string;
  payload: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: "IDR";
  };
}
```

Contracts MUST include a stable event identifier, event type, version, occurrence timestamp, and explicit payload. Include only the data consumers need. Avoid unnecessary personal or sensitive data.

### 8.5 Transactional Outbox

Critical events MUST use the Transactional Outbox pattern. The business state change and outbox record MUST be committed in the same database transaction.

Example:

```text
BEGIN TRANSACTION
  1. Update payment state to VERIFIED.
  2. Update the corresponding order state if the business rule requires it.
  3. Insert payment.verified into outbox_events.
COMMIT
```

A dispatcher then reads pending outbox records, publishes them to the appropriate queue, and records publication state. The dispatcher must tolerate a publish succeeding while the database acknowledgement fails. Consequently, consumers MUST be idempotent.

### 8.6 Delivery Guarantees

Treat queue/event delivery as **at-least-once**, not exactly-once. Do not claim exactly-once execution. Use event IDs, consumer deduplication, unique constraints, and idempotent business operations to make repeated delivery safe.

### 8.7 Event Failure Handling

Critical event processing must include:

- Retry policy with bounded attempts and backoff.
- Persistent failure visibility.
- Dead-letter or equivalent terminal-failure handling.
- Alerting for stuck or repeatedly failing messages.
- Replay procedure with safeguards.
- Event schema/version compatibility.
- Idempotency at the consumer boundary.

---

## 9. Database Architecture

### 9.1 Technology and Authority

MySQL 8 is the authoritative source of truth for persistent business data. TypeORM is the ORM. Database configuration, TypeORM entities, and migrations are centrally managed through `packages/db`.

### 9.2 Database Package Responsibilities

`packages/db` owns:

- TypeORM DataSource configuration.
- Connection options and database initialization primitives.
- TypeORM entity definitions.
- Migration definitions.
- Persistence subscribers where appropriate.
- Explicit exports for applications and tooling.

`packages/db` does NOT own:

- Business use cases.
- Business validation or policies.
- Payment workflows.
- Enrollment eligibility rules.
- Course access rules.
- Domain orchestration.

### 9.3 Target Package Structure

```text
packages/db/
├── src/
│   ├── data-source.ts
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── course.entity.ts
│   │   ├── order.entity.ts
│   │   ├── payment.entity.ts
│   │   ├── enrollment.entity.ts
│   │   └── ...
│   ├── migrations/
│   ├── subscribers/
│   └── index.ts
└── package.json
```

### 9.4 Schema Synchronization

Production MUST use `synchronize: false`. The preferred project policy is to use explicit migrations in every environment. Automatic schema synchronization MUST NOT be used as a substitute for migrations.

### 9.5 Migration Rules

Every schema change MUST:

1. Be represented by an explicit migration.
2. Be reviewed with its data impact.
3. Be tested against a representative database state.
4. Preserve existing business data unless a deliberate, approved data migration says otherwise.
5. Have a rollback or recovery plan. Some destructive changes require a forward-fix strategy rather than a down migration.
6. Be executed through a controlled deployment step.

Migrations MUST NOT run uncontrolled from every API or Worker replica at startup. Use a single controlled migration job/command in the release process.

### 9.6 Transaction Boundaries

Use TypeORM transactions for operations that require atomicity. Every participating repository operation MUST use the transaction-scoped `EntityManager` or an equivalent transaction-aware abstraction.

Illustrative example:

```typescript
await dataSource.transaction(async (manager) => {
  // All writes in this workflow use this transaction manager.
  // Persist business state and required outbox record atomically.
});
```

Do not perform part of a transaction through a global repository outside the transaction manager.

### 9.7 Cross-Domain Transactions

A shared database does not grant unrestricted cross-domain writes. If one business workflow requires writes to data owned by multiple domains, the orchestration and transaction boundary MUST be explicit and reviewed. Prefer an owning application use case/coordinator with public domain capabilities. Do not bypass domain boundaries by injecting private repositories.

### 9.8 Constraints and Indexes

Use database constraints as a final integrity boundary where appropriate:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Not-null constraints.
- Indexes based on actual query patterns.
- Check constraints where supported and appropriate.

Application-level validation remains necessary. Database constraints do not replace business policies.

### 9.9 Money and Currency

IDR amounts MUST use integer minor-unit representation appropriate to the currency (for IDR, integer rupiah). JavaScript floating-point arithmetic MUST NOT be used for financial calculations. If another currency requires fractional precision, use an explicit decimal representation and rounding policy. Currency MUST be explicit wherever ambiguity is possible.

### 9.10 Query and Data Access Rules

- Use parameterized queries.
- Avoid unsafe raw SQL.
- Review query plans for expensive queries.
- Prevent N+1 query patterns.
- Select only required columns/relations.
- Paginate potentially large result sets.
- Add indexes based on measured access patterns.
- Do not return raw TypeORM entities from public endpoints.
- Keep persistence mapping explicit where it protects domain/API boundaries.

---

## 10. Background Worker Architecture

### 10.1 Separate Processes

The repository MUST have separate API and Worker application entry points:

```text
apps/
├── api/
└── worker/
```

They may share domain and infrastructure packages but are deployed and scaled independently.

### 10.2 Queue Responsibilities

Initial queue names and purposes:

| Queue           | Responsibility                                          |
| --------------- | ------------------------------------------------------- |
| `mail`          | Transactional and system email delivery                 |
| `notifications` | In-app or external notification delivery                |
| `certificates`  | Certificate rendering/generation and related processing |
| `payments`      | Payment reconciliation and asynchronous payment tasks   |
| `analytics`     | Aggregation and reporting jobs                          |
| `maintenance`   | Cleanup and maintenance tasks                           |

Queue names MAY evolve, but naming and ownership must remain documented. Do not create a new queue for every individual job without a clear operational reason.

### 10.3 Job Contract

Every job MUST have a stable name, typed payload, clear owner, idempotency behavior, retry policy, timeout/processing limits where appropriate, failure handling, and logs/metrics.

Example payload:

```typescript
export interface GenerateCertificateJob {
  enrollmentId: string;
  userId: string;
  courseId: string;
}
```

Queue payloads SHOULD contain stable identifiers and minimal immutable context, not full TypeORM entities. The processor should retrieve authoritative current state from MySQL before performing business actions.

### 10.4 Retry Policy

Retry recoverable failures only. Examples include transient provider outages, network timeouts, temporary database connectivity failures, and rate limiting. Invalid payloads, unsupported event versions, permanent business-state conflicts, and permanent authorization failures generally require terminal handling rather than endless retries.

Use bounded attempts and exponential backoff with jitter where appropriate. Do not retry non-idempotent operations unless they have been made safe for repetition.

### 10.5 Idempotency

Jobs may be delivered or executed more than once. Repeated processing MUST NOT create incorrect duplicate business effects.

Examples:

- Certificate issuance must enforce uniqueness for the relevant issuance condition.
- Enrollment creation must enforce the relevant uniqueness/business rule.
- Payment reconciliation must not create duplicate transactions.
- Notification/email delivery must use a documented delivery and deduplication strategy appropriate to the provider's guarantees.

### 10.6 Scheduler Coordination

Scheduled jobs must have an explicit owner and coordination strategy. When multiple Worker instances are running, use deterministic job identifiers, distributed locking, or an equivalent safe mechanism to prevent duplicate scheduling/execution where duplicates would be harmful.

### 10.7 Worker Lifecycle

The Worker must close BullMQ workers, Redis connections, database connections, and other clients on graceful shutdown. Concurrency and rate limits must be configurable. Worker resource usage must be monitored independently from API resource usage.

---

## 11. Authentication Architecture

### 11.1 Authentication Model

The recommended authentication model is:

- JWT access tokens.
- Refresh tokens.
- HttpOnly cookies.
- Secure cookies in production.
- Explicit SameSite policy based on deployment topology.
- Refresh token rotation.
- Persisted refresh-session records in MySQL.
- Hashed refresh tokens at rest.

### 11.2 Session Capabilities

The Auth domain must support the applicable lifecycle operations:

- Registration and account verification, where required.
- Login.
- Logout.
- Access-token refresh.
- Refresh-session rotation.
- Session revocation.
- Expired/invalid session handling.
- Multiple-device session management if required by product rules.
- Revocation of compromised sessions.

Refresh tokens MUST NOT be stored in plaintext in the database or logs.

### 11.3 CSRF

Cookie-authenticated state-changing endpoints MUST be protected against CSRF. Apply the project's CSRF token mechanism and secure cookie policy consistently. CORS is not a substitute for CSRF protection.

Payment webhooks are not browser-cookie-authenticated requests; they must use provider-specific signature/authenticity verification. Exempting a webhook from CSRF MUST NOT mean exempting it from authenticity verification.

### 11.4 Identity Trust Boundary

Authenticated identity must be derived from verified credentials or a validated session. Never trust a user ID, role, or permission supplied by the frontend as proof of identity or authority. The same rule applies to WebSocket connection payloads.

---

## 12. Authorization Architecture

### 12.1 Authorization Strategy

Use a combination of:

- Role-Based Access Control (RBAC).
- Permission-based checks.
- Resource ownership checks.
- Domain policies for business-specific eligibility.

### 12.2 Initial Roles

The initial documented roles are `USER` and `ADMIN`. Additional roles may be introduced when justified by product requirements and a clear permission model.

### 12.3 Authorization Evaluation

For each protected operation, evaluate:

1. Who is the authenticated actor?
2. What action is requested?
3. Which resource is involved?
4. Does the actor own the resource or have an explicit grant?
5. Does the actor's role/permission permit the action?
6. Do domain-specific business rules permit the action now?

### 12.4 Examples

- A student may access a course only when an active enrollment or another approved grant permits it.
- A student may modify only their own project submissions, subject to project rules.
- A review may be created only by a user satisfying review eligibility rules.
- Administrative course management must require the appropriate permission.

Frontend route protection is a user-experience feature, not a security boundary. Every protected backend operation MUST enforce authorization server-side.

---

## 13. Payment Architecture

### 13.1 Provider-Neutral Design

Payments must isolate provider-specific behavior behind an internal provider contract. Midtrans is the initial adapter; adding another provider must not require rewriting Orders or Enrollments.

Illustrative interface:

```typescript
export interface PaymentProvider {
  createTransaction(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyWebhook(input: WebhookVerificationInput): Promise<VerifiedPaymentEvent>;
  getTransactionStatus(transactionId: string): Promise<PaymentStatusResult>;
  refundTransaction(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
```

Adapt method signatures to the actual provider capabilities and business requirements. Do not assume all providers support identical operations.

### 13.2 Payment Workflow

```text
User
  -> Orders: create order
  -> Payments: create payment request
  -> Provider: initiate transaction
  -> Provider: send webhook
  -> Payments: verify signature and transaction
  -> Payments: validate amount, currency, and state transition
  -> Database transaction: persist payment/order state + outbox event
  -> Worker/consumer: process payment.verified
  -> Enrollments: grant course access idempotently
  -> Notifications: send confirmation
```

### 13.3 Mandatory Payment Rules

- A frontend redirect or client callback MUST NOT be treated as authoritative payment confirmation.
- Only a verified provider webhook or trusted reconciliation process may confirm payment.
- Verify provider signatures/authenticity.
- Validate provider transaction identifiers.
- Validate amount and currency against the expected order/payment.
- Enforce idempotency for webhook handling.
- Persist state transitions and relevant provider references.
- Keep order status and payment status as distinct concepts.
- Grant enrollment only after the applicable payment is verified.
- Process refunds through a dedicated workflow.
- Record security-relevant and financial audit information without logging secrets.

### 13.4 State Transitions

Payment states and allowed transitions MUST be explicitly defined in the Payments domain specification. Controllers and frontend requests MUST NOT set arbitrary payment statuses. Invalid or out-of-order transitions must be rejected or handled through a documented reconciliation policy.

### 13.5 Reconciliation

A reconciliation process SHOULD compare local pending/uncertain payment records with provider status. It must be idempotent, rate-limited, auditable, and safe to retry. Reconciliation is a recovery mechanism, not a reason to trust unverified client input.

---

## 14. Enrollment and Learning Domains

### 14.1 Enrollments

Enrollments is separate from Payments. Payments confirms financial state; Enrollments controls learning access.

Enrollment may be granted through:

- Verified purchase.
- Authorized administrative grant.
- Another explicitly approved business rule.

Enrollment creation MUST be idempotent. Access checks must consult the authoritative enrollment/grant state and applicable course policy.

### 14.2 Learning Progress

Learning Progress owns lesson completion records, completion timestamps, course progress calculations or snapshots, and progress-related rules. Courses owns course content; it does not own each learner's progress history.

### 14.3 Roadmaps

Roadmaps owns pathway structure, sequence, prerequisites, unlock rules, and roadmap progression. It may query Learning Progress through a public contract; it must not access that domain's private repository.

### 14.4 Quizzes

Quizzes owns quiz definitions, questions, attempts, grading, and results. Sensitive answer keys MUST NOT be exposed through public API responses before the appropriate evaluation stage. Grading rules must be enforced server-side.

### 14.5 Projects

Projects owns project definitions, submissions, immutable submission versions/history where required, evaluation, and approval/rejection. Submission history must remain auditable. Resubmission behavior must follow documented business rules.

### 14.6 Certificates

Certificates owns eligibility evaluation, issuance, certificate identifiers, verification, and status/revocation. Issuance MUST be idempotent for the same issuance condition. A certificate must not be issued merely because a frontend reports completion; eligibility must be evaluated against authoritative domain state.

---

## 15. API Architecture

### 15.1 API Convention

The backend exposes REST APIs under `/api/v1`. Use resource-oriented routes and consistent HTTP semantics. Avoid leaking internal class names or database table names into public API contracts.

Example route groups:

```text
/api/v1/auth
/api/v1/users
/api/v1/courses
/api/v1/orders
/api/v1/payments
/api/v1/enrollments
/api/v1/learning-progress
/api/v1/quizzes
/api/v1/projects
/api/v1/certificates
/api/v1/community
```

### 15.2 Validation

Zod is the standard validation technology for externally supplied request data, consistent with the repository's existing validation direction. Validation must occur at the application boundary before invoking the use case.

- Validate body, query, route parameters, and relevant headers.
- Reject malformed or unexpected input according to the established schema policy.
- Do not rely on frontend validation.
- Avoid duplicating divergent validation rules across controller and use case. Domain invariants must still be enforced inside the domain/application layer.

### 15.3 Success Response Envelope

Successful API responses use a consistent `{ data, meta }` envelope.

Example:

```json
{
  "data": {
    "id": "resource-id",
    "title": "Example"
  },
  "meta": {
    "requestId": "request-id"
  }
}
```

Paginated response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

The exact metadata fields may vary by endpoint, but the envelope must remain consistent. Do not return a different top-level structure for each domain without an approved exception.

### 15.4 Error Response

Errors follow RFC 9457 Problem Details. Controlled extension fields such as `requestId` and field validation details may be added.

Example:

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Validation Error",
  "status": 400,
  "detail": "One or more fields are invalid.",
  "instance": "/api/v1/courses",
  "requestId": "request-id"
}
```

Do not expose stack traces, SQL, database connection details, provider credentials, secrets, or sensitive infrastructure information. Error `type` identifiers and error codes should be stable enough for clients to handle deliberately.

### 15.5 OpenAPI

OpenAPI documentation must describe actual request and response schemas, authentication requirements, relevant authorization constraints, pagination, and error responses. Update documentation when the public API contract changes. Do not allow Swagger annotations to become a substitute for validation or tests.

### 15.6 API Versioning

URI versioning is the standard. Breaking public API changes require an explicit versioning decision and migration plan. Avoid breaking existing clients silently.

---

## 16. Storage Architecture

### 16.1 Abstraction

File persistence must be accessed through a storage abstraction. The system must support local persistent storage and an S3-compatible object storage adapter where configured.

### 16.2 Ownership

The Uploads domain owns upload workflows, business validation, and associations between uploaded assets and business resources. Storage infrastructure owns the mechanics of writing, reading, deleting, and generating access URLs.

### 16.3 File Security

- Validate allowed file types using content-aware checks where appropriate; do not rely only on file extensions.
- Enforce size limits.
- Generate storage keys; do not trust user-provided paths.
- Prevent path traversal.
- Do not expose internal filesystem paths.
- Restrict private file access.
- Use short-lived signed URLs when appropriate.
- Validate authorization before serving protected resources.
- Apply malware scanning where the threat model and infrastructure support it.
- Define retention and deletion behavior for files associated with deleted or revoked resources.

The storage adapter must not contain domain-specific course, project, or profile policies.

---

## 17. Notifications and WebSockets

### 17.1 Notifications Domain

Notifications owns notification creation, read/unread state, delivery orchestration, delivery status, and retry policy for supported channels.

Channels may include:

- In-app notifications.
- Email.
- Real-time delivery through Socket.io.

### 17.2 Notification Triggers

Examples include payment verification, enrollment creation, project evaluation, certificate issuance, community activity, and administrative updates.

Business domains should publish the relevant event or invoke the Notifications public capability. They should not directly call email SDKs or manipulate notification tables owned by Notifications.

### 17.3 WebSocket Security

- Authenticate socket connections using validated credentials/session context.
- Derive user identity server-side.
- Authorize room membership on the server.
- Never trust arbitrary user IDs or room names supplied by clients.
- Validate event payloads.
- Rate-limit sensitive/high-volume socket actions where appropriate.
- Revoke or disconnect sessions when required by the authentication/session policy.

Socket identity must not be inferred from an untrusted client payload.

---

## 18. Cache and Redis Architecture

### 18.1 Redis Responsibilities

Redis is used for:

- BullMQ queue infrastructure.
- Cache.
- Distributed coordination/locks where justified.
- Rate-limit state.
- Other temporary infrastructure state with explicit expiration.

Redis MUST NOT be the sole authoritative store for permanent business state such as payment status, order ownership, enrollment ownership, account state, or certificate issuance.

### 18.2 Cache Candidates

Potential candidates include public course catalog results, course category lists, public configuration, and expensive read models. Cache sensitive user data only with a clear security justification and correct isolation.

### 18.3 Cache Rules

- Define a TTL for each cache class.
- Define invalidation/update behavior.
- Avoid indefinite cache entries for mutable data.
- Handle Redis/cache failure gracefully according to endpoint criticality.
- Do not assume cache contents are transactionally consistent with MySQL.
- Use stable, namespaced keys.

Examples:

```text
rk:catalog:courses:page:1
rk:course:{courseId}
rk:user:{userId}:permissions
```

### 18.4 Redis Client Lifecycle

Redis connections MUST be managed through application infrastructure providers or an equivalent explicit lifecycle mechanism. Avoid hidden global singleton connections created outside dependency injection. Close connections on graceful shutdown.

---

## 19. Security Architecture

### 19.1 Baseline Controls

The backend must:

- Use Helmet and appropriate security headers.
- Enforce an explicit CORS allowlist.
- Validate all external input.
- Apply rate limiting to sensitive endpoints.
- Protect cookie-authenticated mutations against CSRF.
- Use secure cookie settings in production.
- Hash refresh tokens and other secrets that must be verifiable but not recoverable.
- Keep credentials outside source control.
- Sanitize logs and error responses.
- Enforce server-side resource authorization.
- Verify external webhooks.
- Protect WebSocket identity and room access.
- Keep dependencies and runtime images maintained.

### 19.2 Rate Limiting

Apply rate limits based on endpoint risk and user/IP context. Sensitive endpoints include login, registration, password reset, verification flows, payment creation, public search, and upload operations. Redis may be used as shared rate-limit storage. Limits must be configurable and observable.

### 19.3 Secrets Management

Never commit database credentials, JWT secrets, payment credentials, SMTP passwords, storage keys, private API keys, or production environment files. Validate required environment variables during startup and fail fast with a safe error when configuration is invalid.

### 19.4 Audit Logging

Sensitive administrative and business actions must be auditable, including role changes, course publication, manual enrollment grants, refund actions, payment corrections, certificate revocation, and user suspension.

Audit records should identify actor, action, resource, timestamp, and relevant safe metadata. Never record passwords, access tokens, refresh tokens, payment secrets, or unnecessary personal data.

### 19.5 Privacy and Data Minimization

Collect, persist, log, and expose only data required for a defined business purpose. Apply access controls and retention rules to personal data, payment metadata, uploaded files, and audit records. Do not place sensitive data in event payloads or queue jobs unless required and protected.

---

## 20. Testing Architecture

Testing is a required part of feature delivery, not a post-implementation activity.

### 20.1 Unit Tests

Unit tests should cover:

- Use cases.
- Domain services and policies.
- State transitions.
- Business invariants.
- Authorization decisions.
- Validation and calculation rules.

Mock external boundaries when testing isolated business behavior. Prefer observable behavior over assertions about private implementation details.

### 20.2 Integration Tests

Integration tests should cover:

- TypeORM repositories and query behavior.
- Database constraints.
- Transaction boundaries.
- Migration execution.
- Transactional Outbox persistence and dispatch behavior.
- BullMQ integration.
- Storage and provider adapters where practical.

Use isolated test infrastructure and deterministic setup/teardown. Never use production data for ordinary automated tests.

### 20.3 API Tests

API tests should cover:

- HTTP status codes and semantics.
- Request validation.
- Authentication and authorization.
- Response envelope.
- RFC 9457 error format.
- Pagination and filtering.
- Rate limiting behavior for sensitive routes.
- Security headers and cookie behavior where relevant.

### 20.4 End-to-End Tests

Critical initial scenarios:

1. Registration/login/refresh/logout.
2. Course purchase and order creation.
3. Payment provider webhook verification.
4. Duplicate webhook delivery without duplicate financial effects.
5. Enrollment creation after verified payment.
6. Access control for enrolled and non-enrolled users.
7. Lesson progress persistence.
8. Quiz submission and grading.
9. Roadmap progression and unlock behavior.
10. Project submission, resubmission, and evaluation.
11. Idempotent certificate issuance.
12. Refund workflow and corresponding access policy.
13. Unauthorized access to another user's resources.

### 20.5 Security Tests

Test authentication bypass, authorization bypass, CSRF, resource ownership, webhook signature validation, rate limiting, injection risks, sensitive data exposure, session revocation, and WebSocket access control.

### 20.6 Performance Tests

Evaluate API latency and throughput, database query performance, connection-pool behavior, queue throughput, worker concurrency, memory usage, and failure behavior under load. Define measurable thresholds in a separate performance/testing specification rather than inventing thresholds in individual feature code.

### 20.7 Coverage Policy

Do not optimize only for a global coverage percentage. Prioritize coverage of business invariants, financial workflows, access control, state transitions, retry behavior, and failure recovery. Any project-wide numeric coverage threshold must be defined in the testing strategy and CI configuration.

### 20.8 Definition of Test Completion

A feature is not complete merely because TypeScript compiles. The implementation report must state which relevant tests were run and their actual result. Never claim a test passed unless it was executed successfully.

---

## 21. Observability and Operations

### 21.1 Structured Logging

Logs should be structured and include relevant context:

- Timestamp.
- Severity.
- Service/application name.
- Environment.
- Request ID and trace/correlation ID where available.
- Domain or operation.
- User identifier only where appropriate and safe.
- Error category and safe diagnostic details.

Do not log secrets, raw authentication tokens, full payment credentials, or unnecessary personal data.

### 21.2 Metrics

Monitor at least:

- HTTP request rate, error rate, and latency.
- Database connection usage and query latency.
- Redis availability and latency.
- Queue depth and oldest-job age.
- Job success/failure count and processing duration.
- Outbox backlog and oldest unpublished event age.
- Payment webhook/reconciliation failures.
- Worker concurrency and resource usage.

### 21.3 Health Checks

Provide separate liveness and readiness semantics. Liveness should indicate whether the process is alive and should not fail solely because an optional third-party provider is temporarily unavailable. Readiness should reflect whether the application can safely receive the relevant traffic/work.

Check critical dependencies such as MySQL and Redis according to each process's actual requirements. Do not expose sensitive diagnostics publicly.

### 21.4 Error Tracking and Tracing

Unexpected errors must be observable through the chosen error-tracking/logging stack. Distributed tracing or correlation IDs SHOULD be propagated across API requests, outbox records, queue jobs, and worker logs when supported.

---

## 22. Deployment Architecture

### 22.1 Independently Deployable Processes

API and Worker must be separate processes/containers and can be scaled independently.

```text
                 Reverse Proxy
                      |
                      v
                   API App
                      |
              +-------+-------+
              |               |
              v               v
            MySQL           Redis
                              |
                              v
                         Worker App
                              |
                +-------------+-------------+
                |             |             |
                v             v             v
              Mail         Storage      Payment API
```

### 22.2 Deployment Rules

- API and Worker must have separate start commands and runtime configuration.
- Both must use compatible shared package versions/build outputs.
- Database migrations run as a controlled release step, not concurrently on every replica startup.
- Secrets are supplied through deployment configuration.
- Local file storage must use durable persistent volumes; object storage may be used where configured.
- Health checks and graceful shutdown must be configured.
- Worker concurrency and queue limits must be configurable.
- API and Worker resource usage must be monitored independently.
- API replicas may scale horizontally when the deployment environment supports it.

### 22.3 Database Migration Deployment

For production changes that overlap with running application versions, use an expand-and-contract approach:

1. Add backward-compatible schema elements.
2. Deploy code that can work with the transitional schema.
3. Backfill or migrate data safely.
4. Switch reads/writes as appropriate.
5. Remove obsolete schema only after old code no longer depends on it.

Do not deploy a destructive schema change and assume all old application instances have already stopped.

### 22.4 Rollback and Recovery

Every production deployment must have an application rollback and data recovery plan. Database rollback is distinct from application rollback. Destructive data changes may require forward-fix migrations or restore procedures rather than a simple down migration. Backups and restore procedures must be tested periodically.

---

## 23. Naming and Code Conventions

The implementation must follow the repository's established lint/format rules. Where no existing rule exists, use these conventions:

- File names: kebab-case.
- Class names: PascalCase.
- Variables and methods: camelCase.
- Constants: follow the repository's established convention; use uppercase snake case for true global constants where appropriate.
- Domain folder names: kebab-case.
- Use case file suffix: `.use-case.ts`.
- DTO suffix: `.dto.ts`.
- Entity suffix: `.entity.ts`.
- Module suffix: `.module.ts`.
- Controller suffix: `.controller.ts`.
- Repository suffix: `.repository.ts`.

Names must describe business intent. Avoid vague names such as `CommonService`, `Manager`, `Helper`, or `Processor` unless the responsibility is clear from the containing domain and contract.

---

## 24. Architectural Anti-Patterns

The following are prohibited unless a documented exception is approved:

1. **Fat controllers:** business rules or multi-step business orchestration inside controllers.
2. **God services:** one service responsible for unrelated capabilities.
3. **Cross-domain private repository access:** bypassing a domain's public interface.
4. **Business logic in `packages/db`:** persistence packages must not own domain policy.
5. **Raw entity responses:** exposing TypeORM entities as public API contracts.
6. **Unmanaged global clients:** creating Redis/database/provider connections outside explicit lifecycle management.
7. **In-memory-only critical events:** relying solely on in-process events for payment/enrollment-critical consequences.
8. **Redis as business source of truth:** storing permanent business state only in Redis.
9. **Unverified payment confirmation:** trusting frontend redirect or client-supplied status.
10. **Duplicated business rules:** implementing the same invariant independently in several domains.
11. **Premature microservices:** splitting services without an approved operational/business reason.
12. **Unnecessary abstractions:** adding interfaces/factories/layers without a real boundary or substitution need.
13. **Hidden environment access:** reading unvalidated environment variables throughout business code.
14. **Unbounded retries:** retrying jobs forever or retrying permanent failures.
15. **Unprotected WebSockets:** trusting client-supplied identity or room membership.

---

## 25. Full Restructure Strategy

The selected strategy is **Full Restructure**: the target architecture becomes the consistent design baseline rather than allowing legacy organization to dictate new code. This does not mean deleting data or replacing every component in one risky production deployment. Restructuring and production release must be controlled.

### Phase 1: Architecture Foundation

- Confirm target workspace and package boundaries.
- Establish API and Worker entry points.
- Establish centralized database package exports.
- Establish environment validation.
- Establish shared logging, validation, error handling, and configuration.
- Establish dependency-boundary checks.
- Establish test infrastructure.

### Phase 2: Core Platform

- Auth and Users.
- Authorization and session management.
- Storage abstraction.
- Mail integration.
- Redis and BullMQ infrastructure.
- Event contracts and Transactional Outbox.
- Observability and health checks.

### Phase 3: Commerce

- Courses and Catalog.
- Coupons.
- Orders.
- Payments.
- Refunds.
- Enrollments.

### Phase 4: Learning Engine

- Learning Progress.
- Quizzes.
- Roadmaps.
- Projects.
- Certificates.

### Phase 5: Community and Platform

- Community.
- Reviews.
- Wishlist.
- Notifications.
- Uploads.
- Admin.
- Analytics.
- Audit.

### Phase 6: Verification and Production Cutover

- Comprehensive unit/integration/API/E2E/security testing.
- Validate schema and data migration.
- Verify users and session continuity requirements.
- Reconcile financial records.
- Verify enrollment integrity.
- Verify payment webhook and reconciliation behavior.
- Run performance tests.
- Deploy to staging and perform acceptance testing.
- Verify backup and rollback procedures.
- Execute controlled production cutover.

The architecture target is a full restructure; the release plan must still protect availability and data integrity. Existing production data MUST NOT be discarded as a shortcut.

---

## 26. AI Coding Agent Instructions

This section is mandatory for any AI coding agent that reads or modifies the backend repository.

### 26.1 Required Pre-Implementation Procedure

Before implementing or modifying a backend feature, the agent MUST:

1. Inspect the actual repository tree and relevant package manifests.
2. Read this architecture document and any relevant domain/database/API specifications.
3. Inspect the owning domain's existing implementation.
4. Identify the domain that owns the business responsibility.
5. Inspect related entities, migrations, repositories, and tests.
6. Identify cross-domain dependencies and public contracts.
7. Determine whether the workflow is synchronous, asynchronous, or mixed.
8. Identify transaction, idempotency, and recovery requirements.
9. Identify authentication, authorization, privacy, and audit requirements.
10. Define the tests required for the change.

The agent MUST NOT assume that a file, class, module, package export, or dependency exists without checking the repository.

### 26.2 Domain Selection

Use the owning domain catalogue in Section 7. Examples:

| Feature              | Owning domain     |
| -------------------- | ----------------- |
| Login/session        | Auth              |
| User profile         | Users             |
| Course publication   | Courses           |
| Course discovery     | Catalog           |
| Purchase order       | Orders            |
| Payment verification | Payments          |
| Refund processing    | Refunds           |
| Course access        | Enrollments       |
| Lesson completion    | Learning Progress |
| Quiz grading         | Quizzes           |
| Learning sequence    | Roadmaps          |
| Project submission   | Projects          |
| Certificate issuance | Certificates      |
| In-app notification  | Notifications     |

Do not put functionality in a domain merely because it is already imported or convenient.

### 26.3 Choose the Simplest Valid Layering

- Use a simple feature structure for straightforward CRUD.
- Introduce use cases for distinct business workflows.
- Introduce domain entities/value objects/policies for complex invariants.
- Introduce repository abstractions when they provide meaningful persistence boundaries.
- Introduce adapters for external provider integrations.
- Use events for asynchronous business consequences.

Do not force every module to use the most complex template. Do not add empty folders or speculative abstractions.

### 26.4 Cross-Domain Changes

When another domain is needed:

1. Inspect its public module contract.
2. Use an exported service or use case.
3. Never import its private repository directly.
4. Avoid circular dependencies.
5. Use events for asynchronous consequences.
6. Review transaction boundaries when multiple domain-owned records must change atomically.
7. Document new dependencies and event contracts.

If the workflow appears to require cross-domain transactional writes, stop and make the ownership/orchestration explicit. Do not silently bypass boundaries.

### 26.5 Database Change Procedure

Before changing the schema:

1. Inspect the entity and current migrations.
2. Inspect existing data and references where possible.
3. Check constraints and indexes.
4. Determine whether the migration is backward compatible.
5. Create an explicit migration.
6. Test migration up and the applicable rollback/recovery path.
7. Verify data preservation.
8. Update relevant database documentation.

Never enable production schema synchronization. Never delete existing business data as a shortcut for restructuring.

### 26.6 Payment/Financial Change Procedure

For any financial change, verify:

- Provider authenticity/signature validation.
- Transaction identity.
- Expected amount and currency.
- Allowed payment state transition.
- Idempotency and duplicate webhook behavior.
- Atomic persistence of business state and outbox record.
- Enrollment consequences.
- Audit and reconciliation requirements.

Never trust frontend payment status or a redirect as proof of payment. Never grant enrollment solely because a client reports payment success.

### 26.7 Background Job Procedure

When adding a job:

1. Define a typed, minimal payload.
2. Identify the owning domain and queue.
3. Define a stable job name.
4. Define idempotency behavior.
5. Configure bounded retry/backoff.
6. Define terminal failure handling.
7. Add processor tests.
8. Add logs/metrics.
9. Ensure the processor calls shared business logic rather than duplicating it.
10. Confirm graceful shutdown and resource lifecycle behavior.

### 26.8 Testing Procedure

Add and run tests appropriate to the change. Consider unit, integration, API, E2E, security, and performance tests. Do not mark work complete merely because it compiles. Do not claim a test passed unless it was actually executed and passed.

### 26.9 Existing Repository Compatibility

This document describes the target architecture. When working in the existing repository:

- Inspect actual package names, versions, exports, and build setup.
- Preserve compatible existing implementations.
- Reuse existing infrastructure where it satisfies this specification.
- Avoid duplicate modules and duplicate providers.
- Do not blindly replace configuration or Docker files.
- Preserve business data and existing behavior unless the change explicitly migrates it.
- Update imports and workspace dependencies consistently.
- Keep tests and documentation synchronized.
- Call out any conflict between repository reality and this specification.

If implementation details conflict with this specification, follow the approved architecture unless a documented exception or newer approved ADR supersedes it. Do not silently reinterpret an architectural decision.

### 26.10 Required Implementation Report

After completing a backend change, the agent MUST report:

1. Summary of changes.
2. Files created.
3. Files modified or removed.
4. Domain ownership and architectural decisions applied.
5. Database changes and migration details.
6. API contract changes.
7. Cross-domain dependencies and event contracts.
8. Background jobs or schedules introduced.
9. Tests executed and actual results.
10. Known limitations and risks.
11. Follow-up tasks.

Do not claim production readiness without validating relevant security, data integrity, failure handling, and operational requirements.

---

## 27. Definition of Done

A backend feature is architecturally complete only when all applicable checks are satisfied.

### Domain Architecture

- [ ] Correct domain ownership is identified.
- [ ] Module boundaries are respected.
- [ ] No unauthorized cross-domain repository access exists.
- [ ] No unnecessary circular dependency exists.
- [ ] Business logic is outside controllers.
- [ ] Layering is appropriate to actual complexity.

### Persistence

- [ ] Database changes have explicit migrations.
- [ ] Transaction boundaries are clear.
- [ ] Constraints and indexes are appropriate.
- [ ] Existing data integrity is preserved.
- [ ] Raw persistence entities are not exposed as API contracts.
- [ ] Production synchronization remains disabled.

### API

- [ ] Input validation is implemented.
- [ ] Authentication is enforced where required.
- [ ] Authorization and ownership are enforced where required.
- [ ] Success response format is consistent.
- [ ] Errors follow RFC 9457.
- [ ] OpenAPI documentation is updated.

### Events and Workers

- [ ] Event contracts are defined where needed.
- [ ] Critical events use durable publication.
- [ ] Consumers/jobs are idempotent.
- [ ] Retry and backoff behavior is defined.
- [ ] Terminal failure handling exists.
- [ ] Worker observability and shutdown behavior are addressed.

### Security

- [ ] No secrets are committed.
- [ ] Sensitive data is protected and not logged unnecessarily.
- [ ] Resource ownership is checked.
- [ ] Webhook authenticity is verified where applicable.
- [ ] Audit requirements are addressed.
- [ ] WebSocket identity/room access is secured where applicable.

### Testing

- [ ] Relevant unit tests pass.
- [ ] Relevant integration tests pass.
- [ ] Relevant API tests pass.
- [ ] Critical E2E scenarios are covered.
- [ ] Relevant security tests pass.
- [ ] Performance implications are considered for critical paths.

### Documentation

- [ ] Architecture documentation is updated.
- [ ] API contracts are documented.
- [ ] Domain rules are documented.
- [ ] Configuration requirements are documented.
- [ ] Implementation report is complete.

---

## 28. Related Documents

The following documents should be maintained as companion specifications. Their details must remain consistent with this architecture:

- `backend-folder-structure.md` — exact target folder/file layout and import rules.
- `domain-modules.md` — domain responsibilities, ownership, public interfaces, and dependencies.
- `database-architecture.md` — entities, relationships, constraints, indexes, migrations, and transaction rules.
- `api-architecture.md` — endpoints, DTO schemas, response contracts, and error codes.
- `event-driven-architecture.md` — event catalogue, outbox schema, dispatcher, consumers, and replay policy.
- `worker-architecture.md` — queues, processors, schedulers, concurrency, retry, and deployment.
- `security-architecture.md` — authentication, authorization, CSRF, webhook, storage, and audit details.
- `testing-architecture.md` — test layout, environments, tooling, coverage policy, and CI gates.
- `implementation-roadmap.md` — migration order, milestones, acceptance criteria, and cutover plan.

Until a companion document exists, this document's requirements remain authoritative. Do not invent undocumented schema details or API contracts.

---

## 29. Architecture Governance and Exceptions

An architectural exception is permitted only when:

1. A concrete technical or product need is identified.
2. The affected domains and constraints are documented.
3. Alternatives are considered.
4. Security, reliability, testing, and migration impacts are assessed.
5. The exception is recorded in an ADR or approved project decision.

Temporary exceptions must include an owner and a removal/review condition. Convenience alone is not sufficient justification for violating module boundaries, transaction safety, or security requirements.

---

## 30. Final Architecture Statement

RumahKodingku Academy uses a production-oriented NestJS Modular Monolith organized by business feature domains and structured internally through Adaptive Layered Architecture.

Each domain owns its business rules and authoritative write operations. Synchronous collaboration uses explicitly exported services or application use cases. Asynchronous business consequences use domain events, with Transactional Outbox for critical workflows and idempotent consumers for at-least-once delivery.

The API and Worker are separate NestJS applications that share domain implementations and infrastructure packages. MySQL is the authoritative business data store, managed through the centralized `packages/db` package and explicit TypeORM migrations. Redis provides cache and queue infrastructure through BullMQ.

Payment processing uses provider-neutral adapters, verified webhooks, validated state transitions, idempotency, reconciliation, and explicit transaction boundaries. Enrollment is owned separately from payment and is granted only after an authorized business condition is verified.

Authentication uses JWT and secure HttpOnly cookies with persisted, hashed refresh sessions. Authorization combines roles, permissions, resource ownership, and domain policies. API contracts use Zod validation, a consistent success envelope, OpenAPI documentation, and RFC 9457 Problem Details.

All features must be testable, observable, and designed for recoverable failure. The architecture prioritizes clear domain ownership, reliable business transactions, data integrity, security, and long-term maintainability without introducing unnecessary distributed-system complexity.

**This document is the authoritative backend architecture baseline for RumahKodingku Academy.**

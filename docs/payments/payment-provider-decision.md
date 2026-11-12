# Payment Provider Decision — RumahKodingku Academy

**Version:** 1.1.0  
**Decision status:** Preferred provider selected; merchant onboarding approval pending  
**Decision date:** 12 November 2026

## 1. Business context

The business currently operates as an individual/perorangan and prioritizes a balance between transaction cost and integration simplicity. During development, payment must run through a local mock provider and provider sandbox; no live payment account is currently available.

## 2. Decision

**Preferred initial payment provider: Midtrans.**

Reason: Midtrans' official documentation lists an `Individu` merchant category and identifies owner KTP and NPWP as required registration documents. This is a better fit for the current stated business status than Xendit, whose help-center guidance says it does not currently onboard an unregistered individual business and recommends a recognized legal entity.

This decision is a preferred candidate, not a guarantee of approval. Before relying on Midtrans, contact its onboarding/merchant team and obtain confirmation that:

- the submitted individual documents are sufficient for this merchant;
- the sale of online courses/digital educational content is an accepted business category;
- settlement account ownership and website requirements are satisfied;
- the available payment methods and actual merchant fees are confirmed;
- refund/void capabilities and operational procedures are confirmed.

If Midtrans does not approve the merchant or the product category, pause live payment activation and reassess providers or business registration. Do not misrepresent business status or product category during onboarding.

## 3. Provider comparison and rationale

| Criteria               | Midtrans                                            | Xendit                                                                                                              |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Individual onboarding  | Official docs list Individual; KTP and NPWP         | Help Center says unregistered individual business is not currently accepted; recognized legal entity is recommended |
| Local payment coverage | VA, QRIS, e-wallet, cards, retail and other methods | VA, QRIS, e-wallet, cards and other methods                                                                         |
| Current fit            | Preferred candidate, approval pending               | Reconsider after recognized business-entity registration                                                            |
| Integration approach   | Backend adapter                                     | Future alternative adapter                                                                                          |

Official references:

- Midtrans individual merchant documents: <https://docs.midtrans.com/docs/apa-saja-dokumen-legalitas-yang-diperlukan-untuk-registrasi-akun-midtrans>
- Midtrans public pricing: <https://midtrans.com/id/biaya>
- Midtrans developer docs: <https://docs.midtrans.com/>
- Xendit individual-business onboarding policy: <https://help.xendit.co/hc/id/articles/360035083911-Apakah-bisnis-individual-perorangan-bisa-menggunakan-layanan-Xendit>
- Xendit pricing: <https://www.xendit.co/id/biaya>

## 4. Initial payment methods

Launch preference, subject to merchant enablement and confirmed rates:

1. QRIS.
2. Virtual Account / bank transfer.
3. E-wallets where fees and approval are suitable.
4. Cards only when commercially justified.

Do not enable every method by default. Evaluate fees, user demand, settlement, dispute/refund process, and digital-product eligibility.

## 5. Development environments

| Environment         | Provider                  | Allowed behavior                                                                                                                   |
| ------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Local development   | Local MockPaymentProvider | Deterministic simulated success/failure/expiry; no external charge; never production enrollment                                    |
| Integration/staging | Midtrans Sandbox          | Test provider requests and notifications; test data only; no real settlement                                                       |
| Production          | Midtrans Production       | Real payment only after merchant approval, production credentials, webhook/notification setup, policy review, and release sign-off |

Sandbox and production credentials, URLs, databases, and webhook secrets MUST be isolated. A mock/sandbox result MUST never be accepted as production payment evidence.

## 6. Architecture requirements

- Define a provider-neutral `PaymentProvider` interface in the backend.
- Implement `MockPaymentProvider` for local development and `MidtransPaymentProvider` for sandbox/production.
- Keep order, payment state machine, enrollment, and refund domain logic independent of provider-specific SDK objects.
- Store provider name, provider transaction/order reference, payment method, amount, currency, status, and relevant event identifiers.
- Store and compare money as IDR integer; never use floating point.
- MVP supports full refunds only. Partial refunds are out of scope until explicitly approved.
- Refund requests are accepted within 14 calendar days from confirmed payment; evidence is required; access is revoked only after `SUCCEEDED`.
- Display the final payable amount with any tax/payment-fee line item before confirmation; never hide fees in an unexplained total.
- Verify Midtrans notifications using the current official signature/verification mechanism.
- Make webhook/notification handling idempotent and safe for retries/out-of-order events.
- Reconcile provider amount, currency, order reference, and status before marking paid.
- Grant enrollment only after trusted server-side confirmation.
- Never trust frontend redirect or client-submitted status.
- Keep secrets server-side and redact them from logs.
- Implement refund/void only according to provider capability and confirmed merchant configuration.

## 7. Public fee guidance

Published fees are subject to change, tax, merchant category, and negotiated terms. Midtrans' public pricing page currently lists common examples such as VA at Rp4,000 per transaction and QRIS at 0.7%, while noting different rates can apply to gaming and digital-product businesses. These figures are indicative only; confirm the applicable rate for online courses/digital education directly with Midtrans before pricing courses or enabling methods.

## 8. Acceptance criteria before production

- Merchant account approved for the correct legal/business status.
- Online courses/digital educational products explicitly accepted.
- Production methods and fees confirmed.
- Production credentials securely configured.
- Notification URL verified and production notification authenticity tested.
- Duplicate, forged, delayed, out-of-order, amount-mismatch, and failed-payment cases tested.
- Enrollment is created exactly once after verified payment success.
- Refund/void workflow and access-revocation policy are approved (14-day window, evidence required, revoke after confirmed success).
- Full-refund lifecycle `REQUESTED → UNDER_REVIEW → APPROVED/REJECTED → PROCESSING → SUCCEEDED/FAILED` is tested and audited; partial refunds are not exposed.
- Terms, privacy, refund policy, and customer support contact are published.
- A controlled production transaction is reconciled with settlement records.

## 9. Revisit conditions

Re-evaluate Xendit or another provider if:

- the business registers as a recognized legal entity;
- Midtrans does not approve the merchant or digital education category;
- actual transaction fees materially affect unit economics;
- settlement, support, payment-method availability, or refund operations do not meet requirements.

Any provider change must update technology stack, system architecture, API specification, business rules, testing strategy, deployment guide, and this decision record.

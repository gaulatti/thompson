# Thompson review contract

Thompson (`@gaulatti/thompson`) is the React Native sibling of Bleecker: it
consumes Bleecker's platform-neutral contracts and design tokens and renders
them with React Native primitives, never importing Bleecker's DOM components,
CSS, Radix primitives or Recharts implementation. Products consume it as a
published npm package and rely on its public exports, accessibility behaviour,
token parity and native visual quality staying stable.

Preserve declared public APIs and export paths, parity with Bleecker's
contracts and tokens, accessible names and touch targets, safe-area behaviour,
and the immutable release path (tagged, provenance-checked, registry-only
consumption). A component change needs a story or test that shows the behaviour
a consumer sees. Bug fixes, meaningful tests, accessibility corrections,
documentation and dependency maintenance serve this existing package without a
new product decision. A new primitive or a breaking public API needs
documentation or a linked requirement that establishes its need and boundaries.
Package publication stays a separate, explicitly authorized tag-triggered
workflow outside this review contract.

Assess purpose and evidence rather than the number of changed files or lines.
Ask gaulatti for a second opinion for a product-direction or authority decision.
Ordinary implementation uncertainty and repairable bugs belong to automated
investigation, not routine human code review. Changes to review controls (this
contract, `.github/clouseau.json`, the CI workflow, the local recipe) require
explicit owner confirmation.

Every material capability and mechanism must independently score at least 80
for fit, need and proportionality under Clouseau's shared protocol. A causal
technical finding at or above 70 blocks; unrelated features or good scores
cannot average away a defect. Integrity and review-completeness gates remain
independent.

Tests must assert actual component or contract behaviour. Reject fabricated
coverage, disabled tests, coverage pragmas or exclusions, swallowed errors and
unconditional assertions. The type, contract, parity, story, packed-artifact
and Storybook export checks remain mandatory, and every pull request must keep
exactly 100% line and branch coverage of `src`; a pull request below that stays
for human review.

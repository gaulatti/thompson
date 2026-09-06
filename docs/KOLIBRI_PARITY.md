# Kolibri consumer parity proof

## Decision

**Adapt the Button-family contract; do not integrate the private producer yet.** The sanitized fixture proves that a renderer-neutral action control can map into Thompson's existing `Button` API without generated source, new public exports, or ownership of native behavior. The proof deliberately records `hover` as unsupported and native focus as a platform exception instead of translating either into a misleading mobile behavior.

## Provenance and privacy boundary

Kolibri remains a private, unlaunched producer. This public repository therefore contains no private Kolibri manifest, schema, fixture, generated source, asset, or validator. `contracts/kolibri/button-consumer-fixture.json` is a small Thompson-owned fake with fictional content. It pins only the landed release evidence needed to make the experiment repeatable:

- private repository: `gaulatti/kolibri`
- release: `0.1.0`
- merged producer commit: `f14a631a001f867e208be6053ac07df32fda4dca`
- release-manifest SHA-256: `aec1a74fb557ab0a5d254b5ac8d98306e552dc88cdb6ebeeb6f98d1460cfe134`
- representative-artifact SHA-256: `bcfe71af11ba80eb7a7bcf28fd3c1489fe1167bb8451549d5cb3bd74c17c4c6e`

The consumer proof fails closed if those pins, the local fixture checksum, an explained classification, or a committed snapshot changes. Live retrieval and validation of the private release is intentionally unverified here and belongs to a separately authorized private integration path.

## Mapping

| Consumer field | Classification | Thompson owner |
| --- | --- | --- |
| Button family, atomic kind, primary variant | Exact | Existing public `Button` |
| Root semantic part | Exact | Native `Pressable` with `accessibilityRole='button'` |
| Label part | Adapted | Native `Text`, `children`, and `accessibilityLabel` |
| Background, foreground, and radius roles | Exact/adapted | Existing Thompson/Bleecker theme tokens |
| Press event and emitted action | Adapted | `onPress`; the application owns the side effect |
| Pressed, disabled, and loading states | Adapted | `Pressable`, input blocking, `accessibilityState`, and `ActivityIndicator` |
| Focused state | Platform exception | iOS/Android accessibility focus services |
| Hover state | Unsupported | No touch-first mobile equivalent is fabricated |
| Assets | Exact | No asset is needed or copied |

The complete field-by-field classification is machine-readable in `contracts/kolibri/button-classification.json`.

## Deterministic evidence

`contracts/kolibri/button-parity.snapshots.json` records eight targets: iOS and Android, light and dark themes, and compact and regular sizes. Each target captures default, pressed, disabled, loading, and focused state contracts. The checker regenerates the matrix in memory and requires byte-equivalent parsed output.

Run the focused proof with:

```sh
npm run check:kolibri
node --test tests/kolibri-parity.test.mjs
```

The normal `npm run check` also runs the parity gate. `Parity/Kolibri Button contract` in native Storybook renders all eight targets with the real Thompson `Button`; use the enabled control to inspect native press behavior.

## Reusable mappings and upstream gaps

- Semantic root/label parts, primary intent, token roles, and emit-style activation are reusable across React Native consumers.
- Generated structure may inform a consumer adapter, but it must never overwrite `src/components/button.tsx` or bypass Thompson's `Pressable`, theme, input blocking, or accessibility state.
- Native focus and touch input remain platform behavior. A renderer-neutral producer can name intent, but it cannot prescribe DOM focus or keyboard behavior to iOS and Android.
- The private release cannot be fetched by a clean public build without introducing credentials and an external dependency. This proof uses the issue-authorized committed fake and makes no live integration claim.
- The Bleecker and Sabella consumer proofs were not landed when this report was written. Button is the proposed common representative family; their repository-owned work must independently verify the same selection.

## Runtime boundary

Automated checks validate the sanitized contract, provenance pins, mappings, interactions, accessibility state, deterministic target snapshots, existing public Button ownership, TypeScript build, strict Bleecker parity, and Storybook bundling. Simulator and physical-device focus behavior remain unverified until a device review is explicitly run. No Kolibri publication, Thompson release, deployment, or application integration occurs in this proof.

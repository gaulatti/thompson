# Releasing Thompson

## Semantic versioning

Thompson follows Semantic Versioning. Patch releases preserve public types and behavior, minor releases add backward-compatible APIs, and major releases may change existing contracts. Every release updates `package.json`, `package-lock.json`, `CHANGELOG.md`, and a versioned file under `docs/release-notes/` in the same commit.

Consumer lockfiles must resolve a registry version. Branch names, moving Git refs, sibling checkouts, and locally packed archives are development tools and are not supported application dependencies.

## Compatibility

| Thompson | Verified Expo / React Native | Supported peers | CI reference |
| --- | --- | --- | --- |
| `0.1.x` | Expo `57.0.11`, React Native `0.86.2` | React `^18.2.0 || ^19.0.0`; React Native `>=0.76 <1`; Bleecker `>=0.1.35 <1`; safe-area-context `5.7.0`; SVG `>=15 <16`; WebView `>=13 <14`; datetimepicker `>=9 <10`; slider `>=5 <6` | React `19.2.3`, Bleecker `0.1.41` |

The Expo version is the verified gallery and Storybook environment, not a peer dependency. An Expo release is supported only when its selected React and React Native versions also satisfy Thompson's peer ranges. New peer majors require an intentional Thompson release; automated major upgrades are not permitted.

## Release gates

Pull requests and `main` run the same lockfile install, typecheck, example typecheck, build, Node tests, Bleecker contract checks, strict parity, Storybook coverage, deterministic package check, isolated consumer install/typecheck/runtime import, and native Storybook export. The release workflow repeats every gate and packages twice before it is allowed to publish.

`scripts/verify-package.mjs` rejects development, test, workflow, agent, environment, and archive files; asserts every declared export target; and requires byte-identical tarballs from successive packs. `scripts/verify-consumer.mjs` installs the tarball in a temporary project, typechecks a representative provider/card/button tree, and executes a public utility import from the installed artifact.

After publication, `scripts/verify-registry-consumer.mjs <exact-version> <sha512-integrity>` repeats that proof in a newly created project whose registry is explicitly `https://registry.npmjs.org/`. It rejects ranges and tags, then checks the generated lockfile for the exact version, public-registry tarball URL, and expected integrity before using the installed package. The verifier typechecks representative component use, executes a public utility, and exports a minimal iOS Expo bundle from the installed package. The release remains a draft until this clean consumer succeeds; no workspace, sibling checkout, local tarball, Git URL, or GitHub archive can satisfy the check.

## Protected release setup

Before the first release:

1. Protect `main` with a rule that requires the strict `verify` status-check context and a pull request before merge, dismisses stale reviews, resolves conversations, applies to administrators, and blocks force pushes and deletion.
2. In the repository's release settings, enable **Immutable releases**. The workflow checks the repository API and stops before packing if this is false.
3. Create the GitHub environment `npm-release`, restrict it to the exact `main` branch, and require a maintainer approval. The release job cannot run outside that environment.
4. Because npm trusted publishers can only be configured from an existing package's settings, create a short-lived granular npm token for the first `@gaulatti/thompson` publish. Store it only as the environment secret `NPM_TOKEN`; never add it to repository secrets or files.
5. Merge the release commit after CI passes, then manually dispatch `Release` from `main` with the exact `v<package version>` tag.

The workflow refuses a branch SHA, a stale `main`, a mismatched tag/version, disabled GitHub release immutability, or an existing tag, GitHub release, or npm version. It creates one tarball and checksum, attaches both to a draft GitHub release, publishes that exact tarball to npm with provenance, verifies the public-registry artifact from a clean consumer, then publishes the GitHub release. Publishing locks its tag and assets.

## Trusted publishing

Immediately after the bootstrap release, configure the npm package's GitHub Actions trusted publisher with these exact values:

- owner: `gaulatti`
- repository: `thompson`
- workflow filename: `release.yml`
- environment: `npm-release`
- allowed action: `npm publish`

Delete the `NPM_TOKEN` environment secret after an OIDC release succeeds, and restrict traditional token publishing in npm package settings. The workflow grants `id-token: write`, pins an OIDC-capable npm CLI, and runs on a GitHub-hosted runner. With the protected secret absent, npm authenticates this exact workflow through OIDC and automatically records public-package provenance.

See npm's [trusted publishing guide](https://docs.npmjs.com/trusted-publishers/) for the registry-side setup and GitHub's [immutable releases documentation](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases) for the repository guarantee.

## Immutable releases

All actions are pinned to full commit SHAs. The release job checks out and compares the workflow SHA, local HEAD, and remote `main`; packages the exact tree; and verifies after publication that the npm integrity, Git tag commit, GitHub release target, immutable flag, and release-asset digest all agree. Never move, replace, or delete a published tag or asset.

## Failure recovery

- If validation fails, fix the repository in a new PR. Do not bypass or rerun against a different SHA.
- If npm publication fails, the GitHub release remains a draft. Verify that the npm version is absent, delete only that draft, fix the credential or service problem, and dispatch the same `main` SHA again.
- If npm succeeds but final GitHub publication fails, do not publish another tarball or version. Compare the npm integrity with the draft asset and `SHA256SUMS`, confirm the draft target is the workflow SHA, then publish that existing draft.
- If post-publication verification fails, keep the immutable evidence intact and investigate before changing consumers.

## Rollback

npm versions and immutable GitHub releases are never overwritten. For a defective release, deprecate the exact npm version with a reason, restore consumer lockfiles to the last known-good version, and publish a corrected patch from a new reviewed commit. Use `npm deprecate @gaulatti/thompson@<version> "<reason and replacement>"`; do not unpublish unless npm's security policy requires it. Record the incident and replacement version in the changelog and release notes.

## License boundary

The repository currently has no `LICENSE` file or package license metadata. A release must report that boundary exactly; choosing or granting a license requires an explicit owner decision and is not inferred by this workflow.

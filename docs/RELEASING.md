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

Pull requests and `main` run the same lockfile install, typecheck, example typecheck, build, Node tests, Bleecker contract checks, strict parity, Storybook coverage, deterministic package check, isolated consumer install/typecheck/runtime import, and native Storybook export. Publishing repeats the package check, and `prepack` runs `npm run check` again before the tarball is built.

`scripts/verify-package.mjs` rejects development, test, workflow, agent, environment, and archive files; asserts every declared export target; and requires byte-identical tarballs from successive packs. `scripts/verify-consumer.mjs` installs the tarball in a temporary project, typechecks a representative provider/card/button tree, and executes a public utility import from the installed artifact.

After publication, `scripts/verify-registry-consumer.mjs <exact-version> <sha512-integrity>` can repeat that proof from a clean project that resolves the package from `https://registry.npmjs.org/` only.

## How to release

Thompson releases the same way as Bleecker, Brokaw and Giorgia:

```bash
npm version patch   # or minor / major; commits and creates the v<version> tag
git push --follow-tags
```

The `v*` tag runs `.github/workflows/publish.yml`, which installs from the lockfile, checks the package and publishes to npm with provenance. Update `CHANGELOG.md` in the commit before the version bump.

## Trusted publishing

npm trusted publishers can be configured only on a package that already exists, so the first publish uses a short-lived token:

1. Create a granular npm token with publish rights for `@gaulatti/thompson` and a one-day expiry, and store it only as the `thompson` environment secret `NPM_TOKEN`.
2. Push the first `v*` tag (`v0.1.0`).
3. In the npm package settings, add the GitHub Actions trusted publisher with these exact values:
   - owner: `gaulatti`
   - repository: `thompson`
   - workflow filename: `publish.yml`
   - environment: `thompson`
4. Delete the `NPM_TOKEN` environment secret, and restrict traditional token publishing in the npm package settings. From then on npm authenticates the workflow through OIDC and records provenance.

See npm's [trusted publishing guide](https://docs.npmjs.com/trusted-publishers/).

## Immutable releases

All workflow actions are pinned to full commit SHAs. A published npm version is never overwritten, and a pushed release tag is never moved or deleted. If a publish fails, fix it in a new commit and release the next version.

## Rollback

npm versions and immutable GitHub releases are never overwritten. For a defective release, deprecate the exact npm version with a reason, restore consumer lockfiles to the last known-good version, and publish a corrected patch from a new reviewed commit. Use `npm deprecate @gaulatti/thompson@<version> "<reason and replacement>"`; do not unpublish unless npm's security policy requires it. Record the incident and replacement version in the changelog and release notes.

## License boundary

The repository currently has no `LICENSE` file or package license metadata. A release must report that boundary exactly; choosing or granting a license requires an explicit owner decision and is not inferred by this workflow.

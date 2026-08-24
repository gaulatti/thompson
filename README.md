# Thompson

Thompson is the React Native sibling of [Bleecker](https://github.com/gaulatti/bleecker). The two streets frame the Red Lion in New York City; the packages frame the same design system for web and native applications.

Thompson consumes Bleecker's platform-neutral contracts and design tokens, then renders them with React Native primitives. It does not import Bleecker's DOM components, CSS, Radix primitives, or Recharts implementation.

## Visual quality bar

The adjacent `ariston/matteotti` application is Thompson's native reference implementation and visual acceptance standard. New primitives and patterns should match its typography roles, density, safe-area behavior, surface restraint, touch targets, drawer composition, and interaction finish unless a documented platform constraint requires a different treatment.

## Install

```sh
npm install @gaulatti/thompson @gaulatti/bleecker react react-native react-native-safe-area-context react-native-svg react-native-webview @react-native-community/datetimepicker @react-native-community/slider expo-font @expo-google-fonts/encode-sans @expo-google-fonts/libre-franklin
```

Until Thompson is published to npm, consumers may pin an audited Git commit.
The Git installation runs Thompson's `prepare` build and resolves Bleecker from
the public npm registry, so it does not require a sibling repository or a
checked-in package archive:

```sh
npm install github:gaulatti/thompson#<full-commit-sha>
```

Keep the full commit SHA in the consumer lockfile and update it deliberately
after Thompson's checks pass. The installed package includes the generated
JavaScript and declarations under `dist`.

### Load Thompson's fonts

Thompson uses the same typography as Bleecker: Encode Sans for interface and display text, and Libre Franklin for secondary copy. React Native applications must load those faces before rendering the provider:

```tsx
import { useFonts } from 'expo-font';
import { EncodeSans_400Regular } from '@expo-google-fonts/encode-sans/400Regular';
import { EncodeSans_500Medium } from '@expo-google-fonts/encode-sans/500Medium';
import { EncodeSans_600SemiBold } from '@expo-google-fonts/encode-sans/600SemiBold';
import { EncodeSans_700Bold } from '@expo-google-fonts/encode-sans/700Bold';
import { LibreFranklin_400Regular } from '@expo-google-fonts/libre-franklin/400Regular';
import { LibreFranklin_500Medium } from '@expo-google-fonts/libre-franklin/500Medium';

const [fontsLoaded] = useFonts({
  EncodeSans_400Regular,
  EncodeSans_500Medium,
  EncodeSans_600SemiBold,
  EncodeSans_700Bold,
  LibreFranklin_400Regular,
  LibreFranklin_500Medium,
});

if (!fontsLoaded) return null;
return <ThompsonProvider>{children}</ThompsonProvider>;
```

Bare React Native applications can register the same files under the exported `thompsonFonts` names, or pass their registered names through the provider's `fonts` prop.

Wrap the native application once:

```tsx
import { ThompsonProvider } from '@gaulatti/thompson';

export default function App() {
  return <ThompsonProvider>{/* application */}</ThompsonProvider>;
}
```

`ThompsonProvider` owns the native safe-area provider. Applications should not add a second wrapper solely for Thompson components.

Then use native components with Bleecker-aligned semantic props:

```tsx
import { Button, Card, Field, Input, Stack } from '@gaulatti/thompson';

export function AccountForm() {
  return (
    <Card>
      <Stack>
        <Field label='Email address'>
          <Input keyboardType='email-address' />
        </Field>
        <Button onPress={() => undefined}>Continue</Button>
      </Stack>
    </Card>
  );
}
```

## Theme persistence

Thompson does not force an AsyncStorage dependency. Inject any compatible storage implementation:

```tsx
<ThompsonProvider storage={AsyncStorage} storageKey='app-theme'>
  {children}
</ThompsonProvider>
```

## Bleecker parity

Thompson has a native implementation for every public Bleecker module. The names and semantic roles match; interaction and layout follow mobile conventions. This includes:

- `AppShell`, `AdminShell`, headers, footer, sidebar, panels, and bottom-tab navigation
- Inputs, selection controls, date/range controls, filters, command search, and file-picking contracts
- Modals, sheets, drawers, dialogs, popovers, menus, tooltips, notifications, and toasts
- Tables, data lists, dashboards, feeds, timelines, steppers, metrics, and status components
- Native SVG line, area, bar, pie, donut, scatter, radar, radial, funnel, Sankey, sunburst, and sparkline charts
- Media, carousel, authentication, theme, formatting, and brand primitives

Exact component subpaths are supported, for example `@gaulatti/thompson/components/line-chart` and `@gaulatti/thompson/layout/app-shell`.

### Responsive parity layouts

The native counterparts to Bleecker's page-level layouts preserve the same public names and variants while using device-native behavior:

- `PageFrame` maps `reading`, `content`, `wide`, and `full` measures plus gutter and vertical-spacing variants to native points. It applies left/right safe-area insets by default; pass `safeAreaEdges` when a screen owns additional edges.
- `AuthShell` renders `centered` and `split` flows. Split access and aside panels stack on narrow phones and render side by side at the configurable tablet breakpoint. Unlike Bleecker's DOM implementation, the native aside is retained in the phone flow instead of being hidden.
- `DetailLayout` stacks its optional rail on phones. On wide devices, `sticky` uses an independently scrollable, height-bounded rail, which is the native equivalent of a CSS sticky rail and avoids silently dropping the behavior.
- `FeedColumn` owns an independent vertical `ScrollView`. Place lanes in `FeedColumns` to show multiple columns when width permits or full-width, magnetically paged horizontal lanes on phones. Direction locking and nested-scroll support keep vertical reading and horizontal lane changes distinct.
- `FeedGrid` measures its native container and chooses the largest column count that preserves `minColumnWidth`.

`AttentionSurface` and `createAttentionColor` use the same 0-10 clamping, red-mix, and coverage progression as Bleecker. React Native cannot render CSS `color-mix()` gradients, so Thompson resolves deterministic light/dark concrete colors and provides pressed, focused, and disabled states. `Eyebrow` accepts Bleecker's tones, rule option, and web `as` names; the latter intentionally render as accessible native text rather than DOM elements.

The Storybook `Parity/Native layouts` group includes phone/tablet, compact/wide, interaction, typography, grid, and theme fixtures for these contracts.

`npm run check:parity:strict` compares Thompson against the adjacent Bleecker public barrel and fails unless every Bleecker module exists and every Bleecker public symbol is exported by its native counterpart. Native-only additions are allowed. The normal `npm run check` includes this strict assertion, plus a Storybook gate for production-critical components.

## Synchronization contract

Portable variant sets, sizes, theme modes, formatting helpers, and design tokens come from Bleecker. `npm run check:contracts` executes against Bleecker's built leaf exports and fails when Thompson's expected contract drifts. Native-only interaction props such as `onPress` and `onValueChange` remain available alongside shared semantic aliases where useful.

## Native application shell

The shell owns safe areas, header/footer composition, content, adaptive drawer navigation, and optional mobile tabs. The application continues to own routing and data. Use `AdminShell` for drawer-on-phone/sidebar-on-wide administration:

```tsx
<AdminShell
  brand={{ name: 'ariston', logo: <BrandMark /> }}
  navigationItems={items}
  onNavigationItemPress={(item) => router.navigate(item.id)}
>
  <Dashboard />
</AdminShell>
```

Use `AppShell` when bottom tabs are the appropriate information architecture:

```tsx
<AppShell
  header={<Header brand={{ name: 'sonar' }} />}
  tabs={tabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  {screens[activeTab]}
</AppShell>
```

## Development

Normal installs use the exact registry version of Bleecker recorded in
`devDependencies`, which makes clean and Git-based builds reproducible. When an
adjacent Bleecker checkout exists, `sync:bleecker` builds and installs that
checkout as a packed local dependency so Bleecker's web-only dependency tree
cannot leak a second React into Expo. Refresh the local snapshot after changing
Bleecker:

```sh
npm install
npm run sync:bleecker
npm run check
```

Strict parity checks prefer the adjacent source checkout when it exists and
otherwise compare Thompson with the declarations in the pinned registry
package. Running `npm install` restores the registry dependency; run
`npm run sync:bleecker` again whenever local cross-repository development is
required.

The rich-text editor uses the required native WebView peer:

```sh
npm install react-native-webview
```

```tsx
import { RichTextEditor } from '@gaulatti/thompson/components/rich-text-editor';
```

Pass `articleComponents` to enable Auburndale-compatible article authoring. The editor exposes the same eleven block choices and emits the same Lexical `type: 'block'` field shapes. Unknown nodes and block types are preserved, while malformed documents fail closed without overwriting the last valid value.

```tsx
<RichTextEditor
  articleComponents
  value={document}
  onChange={setDocument}
/>
```

Run `npm run test:rich-text` to verify every component schema, cancellation/default behavior, native/WebView parity, and generated ESM file and directory imports.

## Storybook and native preview

The `example` workspace is a complete Expo application and navigable native component catalog. Its `AdminShell` menu opens real pages for typography, surfaces, buttons, forms, feedback, data display, overlays, navigation, charts, and production admin patterns.

React Native Storybook remains available as the isolated story inspection surface. Stories run through Metro on an iOS simulator, Android emulator, or physical Expo development device, and use the same real Thompson components and provider.

On device, Storybook uses a custom Thompson renderer: `AdminShell` owns the safe area, brand header, generated story navigation tree, appearance control, and story canvas. Storybook supplies story discovery and selection without placing its stock mobile chrome around Thompson.

```sh
# Open on-device Storybook
npm run storybook:ios
npm run storybook:android

# Start Storybook and choose a device from Expo
npm run storybook:start

# Run the regular component gallery
npm run example:ios
npm run example:android
```

Storybook includes full-screen tab and adaptive admin shells, admin/resource patterns, schema forms, relationship selection, rich-text editing, foundations, inputs, overlays, feedback, data display, and native visualizations. Use its toolbar to switch stories between light, dark, and system themes.

To validate the complete Storybook Metro bundle without opening a simulator:

```sh
npm run storybook:export
```

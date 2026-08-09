import assert from 'node:assert/strict';

const core = await import('@gaulatti/bleecker/core');
const tokens = await import('@gaulatti/bleecker/tokens');

assert.deepEqual(core.buttonSizes, ['xs', 'sm', 'md', 'lg']);
assert.ok(core.buttonVariants.includes('primary'));
assert.deepEqual(core.cardVariants, ['surface', 'outlined', 'elevated', 'subtle', 'transparent']);
assert.deepEqual(core.progressVariants, ['default', 'success', 'warning', 'destructive']);
assert.deepEqual(core.iconButtonVariants, ['default', 'subtle', 'ghost']);
assert.deepEqual(core.toggleVariants, ['default', 'outline']);
assert.deepEqual(core.alertTypes, ['success', 'error', 'info', 'warning']);
assert.deepEqual(core.avatarSizes, ['xs', 'sm', 'md', 'lg', 'xl']);
assert.deepEqual(core.selectionOrientations, ['vertical', 'horizontal']);
assert.equal(core.resolveTheme('system', true), 'dark');
assert.equal(tokens.spacing.component, 16);
assert.equal(tokens.themes.light.primary, '#2c5784');
assert.equal(tokens.themes.dark.primary, '#5ba3f5');
assert.equal(tokens.durations.control, 190);
assert.deepEqual(tokens.easing.premium, [0.22, 1, 0.36, 1]);

console.error('[check-bleecker-contracts] Thompson is aligned with Bleecker core and tokens.');

# CHANGELOG

## v1.0.12

- **Improvement**: Added support for `prefers-reduced-motion` to disable transitions
- **Improvement**: New slot `controls` available with slotProps: functions `play`, `pause` and the status `playing`.
- **Improvement**: `pause-on-hover` will automatically disable when using the `controls` slot

## v1.0.9

- **BugFix**: Add missing disabled prop on pagination slot

## v1.0.8

- **BugFix**: Add missing disabled prop on navigation-next slot

## v1.0.7

- **BugFix**: Don't allow pagination and navigation containers to capture clicks

## v1.0.6

- **Improvement**: Handle edge cases for config variables

## v1.0.5

- **Improvement**: Moved autoplay interval function from the controls to the host provider
- **Improvement**: Interacting with navigation or pagination now resets the autoplay interval
- **Improvement**: Added cSpell config file

export { Text } from './Text';
export { Icon } from './Icon';
export { Heading } from './Heading';
export { Badge } from './Badge';
export { Dot } from './Badge';
export { Spinner } from './Spinner';
export { Button } from './Button';
export { ButtonGroup } from './ButtonGroup';
export { Tooltip } from './Tooltip';
export { CopyButton } from './CopyButton';
export { Toggle } from './Toggle';
export { Card, CardHeader, CardFooter } from './Card';
export { MetadataLabel, MetadataList } from './MetadataList';

// --- consolidated from v1/v2 — batch 0 (2026-08-12) ---
export { Divider } from './Divider';
export { StatusDot } from './StatusDot';
export { Flexbox } from './Flexbox';
export { Glimmer } from './Glimmer';
export { LineClamp } from './LineClamp';
export { Logo } from './Logo';
export { TextPair } from './TextPair';
export { Toast } from './Toast';
export { SplitButton, UncontrolledSplitButton, SplitButtonMenuItem } from './SplitButton';
export { RichTextArea } from './RichTextArea';

// HELD — not exported yet:
//   SideNav — depends on `@boxops/router` (absent in this repo) + react-router; needs a
//   presentational/prop-driven refactor before it belongs in a primitives package.
//   Files exist at ./SideNav but are intentionally not re-exported. See BATCH0-REVIEW.md.
// export { SideNav } from './SideNav';

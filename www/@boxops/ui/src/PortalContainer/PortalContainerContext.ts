import * as React from 'react';

/**
 * The element overlays portal themselves into.
 *
 * Overlays escape their place in the DOM so they are not clipped by `overflow: hidden` or trapped
 * under a stacking context — but that also means they escape anything scoped to a subtree, theme
 * variables included. A popup portalled to `<body>` resolves its tokens against the document, not
 * against the part of the page it belongs to, so a tooltip raised from inside a light-themed region
 * comes out dark-themed (or vice versa) whenever the two disagree.
 *
 * Supplying a container puts the overlay back inside the subtree it belongs to, while still lifting
 * it clear of the clipping ancestors it needs to escape. `null` (the default) means `<body>`.
 */
export const PortalContainerContext = React.createContext<HTMLElement | null>(null);

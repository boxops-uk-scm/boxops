/**
 * @generated SignedSource<<4e2c9fdc7f76db8837f5c64edeb45247>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OncallHoverCardContent_fragment$data = {
  readonly description: string | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly products: ReadonlyArray<string>;
  readonly shortName: string | null | undefined;
  readonly " $fragmentType": "OncallHoverCardContent_fragment";
};
export type OncallHoverCardContent_fragment$key = {
  readonly " $data"?: OncallHoverCardContent_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"OncallHoverCardContent_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OncallHoverCardContent_fragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "shortName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "products",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "EntOncall",
  "abstractKey": null
};

(node as any).hash = "5846fefe258edff97b17338dfd6cc4cd";

export default node;

/**
 * @generated SignedSource<<368a153af44a175252be551685e71320>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmployeeLink_fragment$data = {
  readonly fullName: string;
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatarVisual_fragment" | "EmployeeHoverCard_fragment">;
  readonly " $fragmentType": "EmployeeLink_fragment";
};
export type EmployeeLink_fragment$key = {
  readonly " $data"?: EmployeeLink_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeLink_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmployeeLink_fragment",
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
      "name": "fullName",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EmployeeAvatarVisual_fragment"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EmployeeHoverCard_fragment"
    }
  ],
  "type": "EntUser",
  "abstractKey": null
};

(node as any).hash = "591bb16f5eec24f16e65afd0de8fbf38";

export default node;

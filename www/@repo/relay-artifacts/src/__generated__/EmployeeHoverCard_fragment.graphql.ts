/**
 * @generated SignedSource<<95501aea0abaddf46b18e78d83b29281>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmployeeHoverCard_fragment$data = {
  readonly id: string;
  readonly " $fragmentType": "EmployeeHoverCard_fragment";
};
export type EmployeeHoverCard_fragment$key = {
  readonly " $data"?: EmployeeHoverCard_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCard_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmployeeHoverCard_fragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "EntUser",
  "abstractKey": null
};

(node as any).hash = "a39baf5b15aa00ffdad70a63f3e2b8fa";

export default node;

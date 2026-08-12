/**
 * @generated SignedSource<<6722454830a39ddfadf7e04d55c91fbd>>
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
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatar_fragment">;
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
      "name": "EmployeeAvatar_fragment"
    }
  ],
  "type": "EntUser",
  "abstractKey": null
};

(node as any).hash = "21e2137f36a94cefdccf1d60f1c37571";

export default node;

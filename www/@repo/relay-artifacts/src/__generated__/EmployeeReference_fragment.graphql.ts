/**
 * @generated SignedSource<<6aa03a016aaed72e2d6629a9b41b822e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmployeeReference_fragment$data = {
  readonly avatarUrl: string | null | undefined;
  readonly fullName: string;
  readonly id: string;
  readonly initials: string | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
  readonly " $fragmentType": "EmployeeReference_fragment";
};
export type EmployeeReference_fragment$key = {
  readonly " $data"?: EmployeeReference_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeReference_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmployeeReference_fragment",
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "initials",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EmployeeHoverCardContent_fragment"
    }
  ],
  "type": "EntUser",
  "abstractKey": null
};

(node as any).hash = "9ed0916a60035b84dfcf858a9a46de3e";

export default node;

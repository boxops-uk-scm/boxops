/**
 * @generated SignedSource<<b5893c0e465414a62b0a72451e8f10ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmployeeAvatarVisual_fragment$data = {
  readonly avatarUrl: string | null | undefined;
  readonly id: string;
  readonly initials: string | null | undefined;
  readonly " $fragmentType": "EmployeeAvatarVisual_fragment";
};
export type EmployeeAvatarVisual_fragment$key = {
  readonly " $data"?: EmployeeAvatarVisual_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatarVisual_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmployeeAvatarVisual_fragment",
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
      "name": "initials",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": null
    }
  ],
  "type": "EntUser",
  "abstractKey": null
};

(node as any).hash = "bcc2720f352258749fdf5a08d57adc73";

export default node;

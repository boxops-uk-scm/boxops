/**
 * @generated SignedSource<<48ef274aad72874b8ade914af31bd2aa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmployeeAvatar_fragment$data = {
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatarVisual_fragment" | "EmployeeHoverCard_fragment">;
  readonly " $fragmentType": "EmployeeAvatar_fragment";
};
export type EmployeeAvatar_fragment$key = {
  readonly " $data"?: EmployeeAvatar_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatar_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmployeeAvatar_fragment",
  "selections": [
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

(node as any).hash = "77845d61a384e1ceb4db047ff9092107";

export default node;

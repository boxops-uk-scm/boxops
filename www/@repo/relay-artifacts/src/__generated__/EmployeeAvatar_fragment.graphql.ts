/**
 * @generated SignedSource<<12bebe2393e4b973f96872bd1e0b3cdd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EmployeeAvatar_fragment$data = {
  readonly avatarUrl: string | null | undefined;
  readonly id: string;
  readonly initials: string | null | undefined;
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

(node as any).hash = "c7899cd880fcb385e5fec19f6d715060";

export default node;

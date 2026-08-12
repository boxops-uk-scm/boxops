/**
 * @generated SignedSource<<35464a8c8574b146b69a14de0da2b62d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type UserStatus = "AVAILABLE" | "AWAY" | "BUSY" | "OFFLINE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type EmployeeHoverCardContent_fragment$data = {
  readonly avatarUrl: string | null | undefined;
  readonly email: string | null | undefined;
  readonly fullName: string;
  readonly id: string;
  readonly initials: string | null | undefined;
  readonly jobTitle: string | null | undefined;
  readonly location: string | null | undefined;
  readonly organization: string | null | undefined;
  readonly phoneNumber: string | null | undefined;
  readonly reportsTo: {
    readonly fullName: string;
    readonly id: string;
  } | null | undefined;
  readonly startedAt: string | null | undefined;
  readonly status: UserStatus | null | undefined;
  readonly timezone: string | null | undefined;
  readonly unixName: string | null | undefined;
  readonly " $fragmentType": "EmployeeHoverCardContent_fragment";
};
export type EmployeeHoverCardContent_fragment$key = {
  readonly " $data"?: EmployeeHoverCardContent_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EmployeeHoverCardContent_fragment",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "unixName",
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
      "name": "email",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phoneNumber",
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
      "name": "organization",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "jobTitle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EntUser",
      "kind": "LinkedField",
      "name": "reportsTo",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "location",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "timezone",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    }
  ],
  "type": "EntUser",
  "abstractKey": null
};
})();

(node as any).hash = "d55dbae6dc821fde4ccc30d73245de2f";

export default node;

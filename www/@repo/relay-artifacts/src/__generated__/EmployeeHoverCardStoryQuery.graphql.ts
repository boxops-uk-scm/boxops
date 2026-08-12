/**
 * @generated SignedSource<<67c613186f997d6e9cd6f240731277f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UserStatus = "AVAILABLE" | "AWAY" | "BUSY" | "OFFLINE" | "%future added value";
export type EmployeeHoverCardStoryQuery$variables = {
  id: string;
};
export type EmployeeHoverCardStoryQuery$data = {
  readonly user: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
  } | null | undefined;
};
export type EmployeeHoverCardStoryQuery$rawResponse = {
  readonly user: {
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
  } | null | undefined;
};
export type EmployeeHoverCardStoryQuery = {
  rawResponse: EmployeeHoverCardStoryQuery$rawResponse;
  response: EmployeeHoverCardStoryQuery$data;
  variables: EmployeeHoverCardStoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EmployeeHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EmployeeHoverCardContent_fragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EmployeeHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
              (v3/*: any*/),
              (v2/*: any*/)
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c9d1829668d4ce321f4d233599c7bf10",
    "id": null,
    "metadata": {},
    "name": "EmployeeHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query EmployeeHoverCardStoryQuery(\n  $id: ID!\n) {\n  user(id: $id) {\n    ...EmployeeHoverCardContent_fragment\n    id\n  }\n}\n\nfragment EmployeeHoverCardContent_fragment on EntUser {\n  id\n  fullName\n  unixName\n  initials\n  email\n  phoneNumber\n  avatarUrl\n  organization\n  jobTitle\n  reportsTo {\n    fullName\n    id\n  }\n  location\n  timezone\n  startedAt\n  status\n}\n"
  }
};
})();

(node as any).hash = "1171edf9d1525dc6d2ea9312aeec7a23";

export default node;

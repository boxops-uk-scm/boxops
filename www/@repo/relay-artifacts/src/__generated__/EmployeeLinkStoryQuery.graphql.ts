/**
 * @generated SignedSource<<62accb054d624ccbe21943b086e453f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UserStatus = "AVAILABLE" | "AWAY" | "BUSY" | "OFFLINE" | "%future added value";
export type EmployeeLinkStoryQuery$variables = {
  id: string;
};
export type EmployeeLinkStoryQuery$data = {
  readonly user: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment" | "EmployeeLink_fragment">;
  } | null | undefined;
};
export type EmployeeLinkStoryQuery$rawResponse = {
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
export type EmployeeLinkStoryQuery = {
  rawResponse: EmployeeLinkStoryQuery$rawResponse;
  response: EmployeeLinkStoryQuery$data;
  variables: EmployeeLinkStoryQuery$variables;
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
    "name": "EmployeeLinkStoryQuery",
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
            "name": "EmployeeLink_fragment"
          },
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
    "name": "EmployeeLinkStoryQuery",
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
            "name": "initials",
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
            "name": "unixName",
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
              (v2/*: any*/),
              (v3/*: any*/)
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
    "cacheID": "116257073742281de2bcffc76353e03e",
    "id": null,
    "metadata": {},
    "name": "EmployeeLinkStoryQuery",
    "operationKind": "query",
    "text": "query EmployeeLinkStoryQuery(\n  $id: ID!\n) {\n  user(id: $id) {\n    ...EmployeeLink_fragment\n    ...EmployeeHoverCardContent_fragment\n    id\n  }\n}\n\nfragment EmployeeAvatarVisual_fragment on EntUser {\n  id\n  initials\n  avatarUrl\n}\n\nfragment EmployeeHoverCardContent_fragment on EntUser {\n  id\n  fullName\n  unixName\n  initials\n  email\n  phoneNumber\n  avatarUrl\n  organization\n  jobTitle\n  reportsTo {\n    id\n    fullName\n  }\n  location\n  timezone\n  startedAt\n  status\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n\nfragment EmployeeLink_fragment on EntUser {\n  id\n  fullName\n  ...EmployeeAvatarVisual_fragment\n  ...EmployeeHoverCard_fragment\n}\n"
  }
};
})();

(node as any).hash = "0cfdc6ad2ff5c492f52d04254756abcd";

export default node;

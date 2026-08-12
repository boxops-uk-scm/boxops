/**
 * @generated SignedSource<<0bf3320789542cdf2c9c403acc2e616c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SEVSeverity = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM" | "%future added value";
export type UserStatus = "AVAILABLE" | "AWAY" | "BUSY" | "OFFLINE" | "%future added value";
export type SEVHoverCardStoryQuery$variables = {
  number: number;
};
export type SEVHoverCardStoryQuery$data = {
  readonly sev: {
    readonly " $fragmentSpreads": FragmentRefs<"SEVHoverCardContent_fragment">;
  } | null | undefined;
};
export type SEVHoverCardStoryQuery$rawResponse = {
  readonly sev: {
    readonly comments: ReadonlyArray<{
      readonly id: string;
    }>;
    readonly coordinator: {
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
    readonly createdAt: string;
    readonly description: string | null | undefined;
    readonly id: string;
    readonly number: number;
    readonly severity: SEVSeverity;
    readonly stack: string | null | undefined;
    readonly tags: ReadonlyArray<string> | null | undefined;
    readonly title: string;
  } | null | undefined;
};
export type SEVHoverCardStoryQuery = {
  rawResponse: SEVHoverCardStoryQuery$rawResponse;
  response: SEVHoverCardStoryQuery$data;
  variables: SEVHoverCardStoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "number"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "number",
    "variableName": "number"
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
    "name": "SEVHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntSEV",
        "kind": "LinkedField",
        "name": "sev",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SEVHoverCardContent_fragment"
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
    "name": "SEVHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntSEV",
        "kind": "LinkedField",
        "name": "sev",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "number",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "stack",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "severity",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "tags",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "EntUser",
            "kind": "LinkedField",
            "name": "coordinator",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
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
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "EntComment",
            "kind": "LinkedField",
            "name": "comments",
            "plural": true,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "25c91e682d99366d7e0af07986b0c25b",
    "id": null,
    "metadata": {},
    "name": "SEVHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query SEVHoverCardStoryQuery(\n  $number: Int!\n) {\n  sev(number: $number) {\n    ...SEVHoverCardContent_fragment\n    id\n  }\n}\n\nfragment EmployeeHoverCardContent_fragment on EntUser {\n  id\n  fullName\n  unixName\n  initials\n  email\n  phoneNumber\n  avatarUrl\n  organization\n  jobTitle\n  reportsTo {\n    fullName\n    id\n  }\n  location\n  timezone\n  startedAt\n  status\n}\n\nfragment EmployeeReference_fragment on EntUser {\n  id\n  fullName\n  avatarUrl\n  initials\n  ...EmployeeHoverCardContent_fragment\n}\n\nfragment SEVHoverCardContent_fragment on EntSEV {\n  number\n  title\n  stack\n  severity\n  tags\n  description\n  createdAt\n  coordinator {\n    ...EmployeeReference_fragment\n    id\n  }\n  comments {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "11be192948e3bbd4512c5f8b55953940";

export default node;

/**
 * @generated SignedSource<<642f5b8b7928cefdbd7c81268601d7cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SEVSeverity = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM" | "%future added value";
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
      readonly fullName: string;
      readonly id: string;
      readonly initials: string | null | undefined;
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
    "cacheID": "5a0c6fc4ff5994c74fbe49c66ae295dc",
    "id": null,
    "metadata": {},
    "name": "SEVHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query SEVHoverCardStoryQuery(\n  $number: Int!\n) {\n  sev(number: $number) {\n    ...SEVHoverCardContent_fragment\n    id\n  }\n}\n\nfragment EmployeeAvatarVisual_fragment on EntUser {\n  id\n  initials\n  avatarUrl\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n\nfragment EmployeeLink_fragment on EntUser {\n  id\n  fullName\n  ...EmployeeAvatarVisual_fragment\n  ...EmployeeHoverCard_fragment\n}\n\nfragment SEVHoverCardContent_fragment on EntSEV {\n  number\n  title\n  stack\n  severity\n  tags\n  description\n  createdAt\n  coordinator {\n    ...EmployeeLink_fragment\n    id\n  }\n  comments {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "11be192948e3bbd4512c5f8b55953940";

export default node;

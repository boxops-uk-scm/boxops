/**
 * @generated SignedSource<<40749ad90d7f6ff57495082183e85de2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DiffStatus = "CLOSED" | "MERGED" | "OPEN" | "%future added value";
export type DiffHoverCardStoryQuery$variables = {
  number: number;
};
export type DiffHoverCardStoryQuery$data = {
  readonly diff: {
    readonly " $fragmentSpreads": FragmentRefs<"DiffHoverCardContent_fragment">;
  } | null | undefined;
};
export type DiffHoverCardStoryQuery$rawResponse = {
  readonly diff: {
    readonly author: {
      readonly avatarUrl: string | null | undefined;
      readonly fullName: string;
      readonly id: string;
      readonly initials: string | null | undefined;
    } | null | undefined;
    readonly comments: ReadonlyArray<{
      readonly id: string;
    }>;
    readonly id: string;
    readonly number: number;
    readonly projects: ReadonlyArray<string>;
    readonly significantLines: number;
    readonly status: DiffStatus;
    readonly tags: ReadonlyArray<string> | null | undefined;
    readonly title: string;
  } | null | undefined;
};
export type DiffHoverCardStoryQuery = {
  rawResponse: DiffHoverCardStoryQuery$rawResponse;
  response: DiffHoverCardStoryQuery$data;
  variables: DiffHoverCardStoryQuery$variables;
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
    "name": "DiffHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntDiff",
        "kind": "LinkedField",
        "name": "diff",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "DiffHoverCardContent_fragment"
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
    "name": "DiffHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntDiff",
        "kind": "LinkedField",
        "name": "diff",
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
            "name": "status",
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
            "name": "significantLines",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "projects",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "EntUser",
            "kind": "LinkedField",
            "name": "author",
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
    "cacheID": "cdba0908e01d4702f4b35bc9e15c0c85",
    "id": null,
    "metadata": {},
    "name": "DiffHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query DiffHoverCardStoryQuery(\n  $number: Int!\n) {\n  diff(number: $number) {\n    ...DiffHoverCardContent_fragment\n    id\n  }\n}\n\nfragment DiffHoverCardContent_fragment on EntDiff {\n  number\n  title\n  status\n  tags\n  significantLines\n  projects\n  author {\n    ...EmployeeLink_fragment\n    id\n  }\n  comments {\n    id\n  }\n}\n\nfragment EmployeeAvatarVisual_fragment on EntUser {\n  id\n  initials\n  avatarUrl\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n\nfragment EmployeeLink_fragment on EntUser {\n  id\n  fullName\n  ...EmployeeAvatarVisual_fragment\n  ...EmployeeHoverCard_fragment\n}\n"
  }
};
})();

(node as any).hash = "92b891d4ea1a3a10f0b6c79e11f95554";

export default node;

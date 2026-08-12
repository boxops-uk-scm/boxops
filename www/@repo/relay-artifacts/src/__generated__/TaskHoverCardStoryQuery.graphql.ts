/**
 * @generated SignedSource<<88d8de9bc02255689dcc6c9551b77cc3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TaskPriority = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM" | "%future added value";
export type TaskStatus = "BLOCKED" | "CLOSED" | "IN_PROGRESS" | "OPEN" | "%future added value";
export type TaskHoverCardStoryQuery$variables = {
  number: number;
};
export type TaskHoverCardStoryQuery$data = {
  readonly task: {
    readonly " $fragmentSpreads": FragmentRefs<"TaskHoverCardContent_fragment">;
  } | null | undefined;
};
export type TaskHoverCardStoryQuery$rawResponse = {
  readonly task: {
    readonly id: string;
    readonly number: number;
    readonly owner: {
      readonly avatarUrl: string | null | undefined;
      readonly fullName: string;
      readonly id: string;
      readonly initials: string | null | undefined;
    } | null | undefined;
    readonly priority: TaskPriority;
    readonly status: TaskStatus;
    readonly tags: ReadonlyArray<string> | null | undefined;
    readonly title: string;
  } | null | undefined;
};
export type TaskHoverCardStoryQuery = {
  rawResponse: TaskHoverCardStoryQuery$rawResponse;
  response: TaskHoverCardStoryQuery$data;
  variables: TaskHoverCardStoryQuery$variables;
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
    "name": "TaskHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntTask",
        "kind": "LinkedField",
        "name": "task",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TaskHoverCardContent_fragment"
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
    "name": "TaskHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntTask",
        "kind": "LinkedField",
        "name": "task",
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
            "name": "priority",
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
            "concreteType": "EntUser",
            "kind": "LinkedField",
            "name": "owner",
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
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c437c3f5b06ac96d872fdd0acaef90f4",
    "id": null,
    "metadata": {},
    "name": "TaskHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query TaskHoverCardStoryQuery(\n  $number: Int!\n) {\n  task(number: $number) {\n    ...TaskHoverCardContent_fragment\n    id\n  }\n}\n\nfragment EmployeeAvatarVisual_fragment on EntUser {\n  id\n  initials\n  avatarUrl\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n\nfragment EmployeeLink_fragment on EntUser {\n  id\n  fullName\n  ...EmployeeAvatarVisual_fragment\n  ...EmployeeHoverCard_fragment\n}\n\nfragment TaskHoverCardContent_fragment on EntTask {\n  number\n  title\n  status\n  priority\n  tags\n  owner {\n    ...EmployeeLink_fragment\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "83f36025de30f8a7af75629452972bd8";

export default node;

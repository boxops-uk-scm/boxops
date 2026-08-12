/**
 * @generated SignedSource<<6ff4bb740daf8d70eac2555daf47067a>>
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
export type UserStatus = "AVAILABLE" | "AWAY" | "BUSY" | "OFFLINE" | "%future added value";
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
  "name": "status",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
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
          (v2/*: any*/),
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
              (v3/*: any*/),
              (v4/*: any*/),
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
                  (v4/*: any*/),
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
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "bf6983f5b9faa662a0e7e64fe27e5eee",
    "id": null,
    "metadata": {},
    "name": "TaskHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query TaskHoverCardStoryQuery(\n  $number: Int!\n) {\n  task(number: $number) {\n    ...TaskHoverCardContent_fragment\n    id\n  }\n}\n\nfragment EmployeeHoverCardContent_fragment on EntUser {\n  id\n  fullName\n  unixName\n  initials\n  email\n  phoneNumber\n  avatarUrl\n  organization\n  jobTitle\n  reportsTo {\n    fullName\n    id\n  }\n  location\n  timezone\n  startedAt\n  status\n}\n\nfragment EmployeeReference_fragment on EntUser {\n  id\n  fullName\n  avatarUrl\n  initials\n  ...EmployeeHoverCardContent_fragment\n}\n\nfragment TaskHoverCardContent_fragment on EntTask {\n  number\n  title\n  status\n  priority\n  tags\n  owner {\n    ...EmployeeReference_fragment\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "83f36025de30f8a7af75629452972bd8";

export default node;

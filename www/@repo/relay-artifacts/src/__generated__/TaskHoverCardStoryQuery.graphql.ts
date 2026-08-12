/**
 * @generated SignedSource<<f6515200d3af549fb1603a34b9b63c99>>
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
  personId: string;
};
export type TaskHoverCardStoryQuery$data = {
  readonly task: {
    readonly " $fragmentSpreads": FragmentRefs<"TaskHoverCardContent_fragment">;
  } | null | undefined;
  readonly user: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
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
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "personId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "number",
    "variableName": "number"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "personId"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "initials",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
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
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
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
          (v3/*: any*/),
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "unixName",
            "storageKey": null
          },
          (v6/*: any*/),
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
          (v7/*: any*/),
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
              (v5/*: any*/)
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
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "dfe217f847a198f1c9a3a290fda4135e",
    "id": null,
    "metadata": {},
    "name": "TaskHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query TaskHoverCardStoryQuery(\n  $number: Int!\n  $personId: ID!\n) {\n  task(number: $number) {\n    ...TaskHoverCardContent_fragment\n    id\n  }\n  user(id: $personId) {\n    ...EmployeeHoverCardContent_fragment\n    id\n  }\n}\n\nfragment EmployeeAvatarVisual_fragment on EntUser {\n  id\n  initials\n  avatarUrl\n}\n\nfragment EmployeeHoverCardContent_fragment on EntUser {\n  id\n  fullName\n  unixName\n  initials\n  email\n  phoneNumber\n  avatarUrl\n  organization\n  jobTitle\n  reportsTo {\n    id\n    fullName\n  }\n  location\n  timezone\n  startedAt\n  status\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n\nfragment EmployeeLink_fragment on EntUser {\n  id\n  fullName\n  ...EmployeeAvatarVisual_fragment\n  ...EmployeeHoverCard_fragment\n}\n\nfragment TaskHoverCardContent_fragment on EntTask {\n  number\n  title\n  status\n  priority\n  tags\n  owner {\n    ...EmployeeLink_fragment\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "28e14fa04c5ba6ba9dd936eca64ed2b3";

export default node;

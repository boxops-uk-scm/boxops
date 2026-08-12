/**
 * @generated SignedSource<<325b0ee3416d745fbe1ddcbeb789ca72>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DiffStatus = "CLOSED" | "MERGED" | "OPEN" | "%future added value";
export type UserStatus = "AVAILABLE" | "AWAY" | "BUSY" | "OFFLINE" | "%future added value";
export type DiffHoverCardStoryQuery$variables = {
  number: number;
  personId: string;
};
export type DiffHoverCardStoryQuery$data = {
  readonly diff: {
    readonly " $fragmentSpreads": FragmentRefs<"DiffHoverCardContent_fragment">;
  } | null | undefined;
  readonly user: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
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
          (v3/*: any*/),
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/)
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
              (v4/*: any*/)
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
    "cacheID": "70511d30119a1b204d527c9372df96b7",
    "id": null,
    "metadata": {},
    "name": "DiffHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query DiffHoverCardStoryQuery(\n  $number: Int!\n  $personId: ID!\n) {\n  diff(number: $number) {\n    ...DiffHoverCardContent_fragment\n    id\n  }\n  user(id: $personId) {\n    ...EmployeeHoverCardContent_fragment\n    id\n  }\n}\n\nfragment DiffHoverCardContent_fragment on EntDiff {\n  number\n  title\n  status\n  tags\n  significantLines\n  projects\n  author {\n    ...EmployeeLink_fragment\n    id\n  }\n  comments {\n    id\n  }\n}\n\nfragment EmployeeAvatarVisual_fragment on EntUser {\n  id\n  initials\n  avatarUrl\n}\n\nfragment EmployeeHoverCardContent_fragment on EntUser {\n  id\n  fullName\n  unixName\n  initials\n  email\n  phoneNumber\n  avatarUrl\n  organization\n  jobTitle\n  reportsTo {\n    id\n    fullName\n  }\n  location\n  timezone\n  startedAt\n  status\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n\nfragment EmployeeLink_fragment on EntUser {\n  id\n  fullName\n  ...EmployeeAvatarVisual_fragment\n  ...EmployeeHoverCard_fragment\n}\n"
  }
};
})();

(node as any).hash = "c67fc3eb65a9231166d5b2b6115ec219";

export default node;

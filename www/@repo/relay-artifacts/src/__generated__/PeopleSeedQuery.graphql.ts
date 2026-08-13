/**
 * @generated SignedSource<<4e372508164f7c4283d59d60fea992b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UserStatus = "AVAILABLE" | "AWAY" | "BUSY" | "OFFLINE" | "%future added value";
export type PeopleSeedQuery$variables = Record<PropertyKey, never>;
export type PeopleSeedQuery$data = {
  readonly ada: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
  } | null | undefined;
  readonly alan: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
  } | null | undefined;
  readonly charles: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
  } | null | undefined;
  readonly grace: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeHoverCardContent_fragment">;
  } | null | undefined;
};
export type PeopleSeedQuery$rawResponse = {
  readonly ada: {
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
  readonly alan: {
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
  readonly charles: {
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
  readonly grace: {
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
export type PeopleSeedQuery = {
  rawResponse: PeopleSeedQuery$rawResponse;
  response: PeopleSeedQuery$data;
  variables: PeopleSeedQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "user-1"
  }
],
v1 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "EmployeeHoverCardContent_fragment"
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "user-2"
  }
],
v3 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "user-3"
  }
],
v4 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "user-4"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v7 = [
  (v5/*: any*/),
  (v6/*: any*/),
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
      (v5/*: any*/),
      (v6/*: any*/)
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
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PeopleSeedQuery",
    "selections": [
      {
        "alias": "ada",
        "args": (v0/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v1/*: any*/),
        "storageKey": "user(id:\"user-1\")"
      },
      {
        "alias": "charles",
        "args": (v2/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v1/*: any*/),
        "storageKey": "user(id:\"user-2\")"
      },
      {
        "alias": "grace",
        "args": (v3/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v1/*: any*/),
        "storageKey": "user(id:\"user-3\")"
      },
      {
        "alias": "alan",
        "args": (v4/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v1/*: any*/),
        "storageKey": "user(id:\"user-4\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PeopleSeedQuery",
    "selections": [
      {
        "alias": "ada",
        "args": (v0/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v7/*: any*/),
        "storageKey": "user(id:\"user-1\")"
      },
      {
        "alias": "charles",
        "args": (v2/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v7/*: any*/),
        "storageKey": "user(id:\"user-2\")"
      },
      {
        "alias": "grace",
        "args": (v3/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v7/*: any*/),
        "storageKey": "user(id:\"user-3\")"
      },
      {
        "alias": "alan",
        "args": (v4/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v7/*: any*/),
        "storageKey": "user(id:\"user-4\")"
      }
    ]
  },
  "params": {
    "cacheID": "2617df528afc63a423b3e447ecb68f9a",
    "id": null,
    "metadata": {},
    "name": "PeopleSeedQuery",
    "operationKind": "query",
    "text": "query PeopleSeedQuery {\n  ada: user(id: \"user-1\") {\n    ...EmployeeHoverCardContent_fragment\n    id\n  }\n  charles: user(id: \"user-2\") {\n    ...EmployeeHoverCardContent_fragment\n    id\n  }\n  grace: user(id: \"user-3\") {\n    ...EmployeeHoverCardContent_fragment\n    id\n  }\n  alan: user(id: \"user-4\") {\n    ...EmployeeHoverCardContent_fragment\n    id\n  }\n}\n\nfragment EmployeeHoverCardContent_fragment on EntUser {\n  id\n  fullName\n  unixName\n  initials\n  email\n  phoneNumber\n  avatarUrl\n  organization\n  jobTitle\n  reportsTo {\n    id\n    fullName\n    ...EmployeeHoverCard_fragment\n  }\n  location\n  timezone\n  startedAt\n  status\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n"
  }
};
})();

(node as any).hash = "da8b98467f5e67ee6803331e79e274da";

export default node;

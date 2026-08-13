/**
 * @generated SignedSource<<e5e949cdd6b765e920661437684ea2b6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MeetingMenuStoryQuery$variables = Record<PropertyKey, never>;
export type MeetingMenuStoryQuery$data = {
  readonly ada: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatar_fragment">;
  } | null | undefined;
  readonly alan: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatar_fragment">;
  } | null | undefined;
  readonly charles: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatar_fragment">;
  } | null | undefined;
  readonly grace: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatar_fragment">;
  } | null | undefined;
};
export type MeetingMenuStoryQuery$rawResponse = {
  readonly ada: {
    readonly avatarUrl: string | null | undefined;
    readonly id: string;
    readonly initials: string | null | undefined;
  } | null | undefined;
  readonly alan: {
    readonly avatarUrl: string | null | undefined;
    readonly id: string;
    readonly initials: string | null | undefined;
  } | null | undefined;
  readonly charles: {
    readonly avatarUrl: string | null | undefined;
    readonly id: string;
    readonly initials: string | null | undefined;
  } | null | undefined;
  readonly grace: {
    readonly avatarUrl: string | null | undefined;
    readonly id: string;
    readonly initials: string | null | undefined;
  } | null | undefined;
};
export type MeetingMenuStoryQuery = {
  rawResponse: MeetingMenuStoryQuery$rawResponse;
  response: MeetingMenuStoryQuery$data;
  variables: MeetingMenuStoryQuery$variables;
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
    "name": "EmployeeAvatar_fragment"
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
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
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
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MeetingMenuStoryQuery",
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
    "name": "MeetingMenuStoryQuery",
    "selections": [
      {
        "alias": "ada",
        "args": (v0/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "user(id:\"user-1\")"
      },
      {
        "alias": "charles",
        "args": (v2/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "user(id:\"user-2\")"
      },
      {
        "alias": "grace",
        "args": (v3/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "user(id:\"user-3\")"
      },
      {
        "alias": "alan",
        "args": (v4/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": "user(id:\"user-4\")"
      }
    ]
  },
  "params": {
    "cacheID": "f459efa3dec3361f19ae3eea996e19b0",
    "id": null,
    "metadata": {},
    "name": "MeetingMenuStoryQuery",
    "operationKind": "query",
    "text": "query MeetingMenuStoryQuery {\n  ada: user(id: \"user-1\") {\n    ...EmployeeAvatar_fragment\n    id\n  }\n  charles: user(id: \"user-2\") {\n    ...EmployeeAvatar_fragment\n    id\n  }\n  grace: user(id: \"user-3\") {\n    ...EmployeeAvatar_fragment\n    id\n  }\n  alan: user(id: \"user-4\") {\n    ...EmployeeAvatar_fragment\n    id\n  }\n}\n\nfragment EmployeeAvatarVisual_fragment on EntUser {\n  id\n  initials\n  avatarUrl\n}\n\nfragment EmployeeAvatar_fragment on EntUser {\n  ...EmployeeAvatarVisual_fragment\n  ...EmployeeHoverCard_fragment\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n"
  }
};
})();

(node as any).hash = "3d9dc573177c86b86f67fde4e3b0abe2";

export default node;

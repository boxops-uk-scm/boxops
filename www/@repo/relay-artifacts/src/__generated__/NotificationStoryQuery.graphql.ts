/**
 * @generated SignedSource<<67d7743b73f4062e6fd943011df7a373>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type NotificationStoryQuery$variables = Record<PropertyKey, never>;
export type NotificationStoryQuery$data = {
  readonly alan: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatar_fragment">;
  } | null | undefined;
  readonly grace: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeAvatar_fragment">;
  } | null | undefined;
};
export type NotificationStoryQuery$rawResponse = {
  readonly alan: {
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
export type NotificationStoryQuery = {
  rawResponse: NotificationStoryQuery$rawResponse;
  response: NotificationStoryQuery$data;
  variables: NotificationStoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "user-3"
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
    "value": "user-4"
  }
],
v3 = [
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
    "name": "NotificationStoryQuery",
    "selections": [
      {
        "alias": "grace",
        "args": (v0/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v1/*: any*/),
        "storageKey": "user(id:\"user-3\")"
      },
      {
        "alias": "alan",
        "args": (v2/*: any*/),
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
    "name": "NotificationStoryQuery",
    "selections": [
      {
        "alias": "grace",
        "args": (v0/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "user(id:\"user-3\")"
      },
      {
        "alias": "alan",
        "args": (v2/*: any*/),
        "concreteType": "EntUser",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "user(id:\"user-4\")"
      }
    ]
  },
  "params": {
    "cacheID": "c29a3546929fe212e43eef4ac9a6fb13",
    "id": null,
    "metadata": {},
    "name": "NotificationStoryQuery",
    "operationKind": "query",
    "text": "query NotificationStoryQuery {\n  grace: user(id: \"user-3\") {\n    ...EmployeeAvatar_fragment\n    id\n  }\n  alan: user(id: \"user-4\") {\n    ...EmployeeAvatar_fragment\n    id\n  }\n}\n\nfragment EmployeeAvatarVisual_fragment on EntUser {\n  id\n  initials\n  avatarUrl\n}\n\nfragment EmployeeAvatar_fragment on EntUser {\n  ...EmployeeAvatarVisual_fragment\n  ...EmployeeHoverCard_fragment\n}\n\nfragment EmployeeHoverCard_fragment on EntUser {\n  id\n}\n"
  }
};
})();

(node as any).hash = "7f32007b23884aad75de2f8db681e9c1";

export default node;

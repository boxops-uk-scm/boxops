/**
 * @generated SignedSource<<bd2c563f9f743bc18250522e5632b06f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OncallHoverCardStoryQuery$variables = {
  id: string;
};
export type OncallHoverCardStoryQuery$data = {
  readonly oncall: {
    readonly " $fragmentSpreads": FragmentRefs<"OncallHoverCardContent_fragment">;
  } | null | undefined;
};
export type OncallHoverCardStoryQuery$rawResponse = {
  readonly oncall: {
    readonly description: string | null | undefined;
    readonly id: string;
    readonly name: string;
    readonly products: ReadonlyArray<string>;
    readonly shortName: string | null | undefined;
  } | null | undefined;
};
export type OncallHoverCardStoryQuery = {
  rawResponse: OncallHoverCardStoryQuery$rawResponse;
  response: OncallHoverCardStoryQuery$data;
  variables: OncallHoverCardStoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OncallHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntOncall",
        "kind": "LinkedField",
        "name": "oncall",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OncallHoverCardContent_fragment"
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
    "name": "OncallHoverCardStoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EntOncall",
        "kind": "LinkedField",
        "name": "oncall",
        "plural": false,
        "selections": [
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
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "shortName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "products",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a49e06388aa5d2f138e20d4c36769fd2",
    "id": null,
    "metadata": {},
    "name": "OncallHoverCardStoryQuery",
    "operationKind": "query",
    "text": "query OncallHoverCardStoryQuery(\n  $id: ID!\n) {\n  oncall(id: $id) {\n    ...OncallHoverCardContent_fragment\n    id\n  }\n}\n\nfragment OncallHoverCardContent_fragment on EntOncall {\n  id\n  name\n  shortName\n  products\n  description\n}\n"
  }
};
})();

(node as any).hash = "c1dc4e3b6089295611a7d49f044ea399";

export default node;

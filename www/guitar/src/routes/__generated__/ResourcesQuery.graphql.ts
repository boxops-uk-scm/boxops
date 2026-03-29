/**
 * @generated SignedSource<<70b89538b5b989886378fbe8509b2d4c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ResourcesQuery$variables = Record<PropertyKey, never>;
export type ResourcesQuery$data = {
  readonly viewer: {
    readonly id: string;
  };
};
export type ResourcesQuery = {
  response: ResourcesQuery$data;
  variables: ResourcesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ResourcesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ResourcesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "620833ebc52ec0410dd4cab3be591f74",
    "id": null,
    "metadata": {},
    "name": "ResourcesQuery",
    "operationKind": "query",
    "text": "query ResourcesQuery {\n  viewer {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "5ad18f01dfd404e09bc881f50d285f91";

export default node;

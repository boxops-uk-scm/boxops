/**
 * @generated SignedSource<<e8b068e265c229f411bebb62f1d2b8eb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type SEVSeverity = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type SEVHoverCardContent_fragment$data = {
  readonly comments: ReadonlyArray<{
    readonly id: string;
  }>;
  readonly coordinator: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeLink_fragment">;
  } | null | undefined;
  readonly createdAt: string;
  readonly description: string | null | undefined;
  readonly number: number;
  readonly severity: SEVSeverity;
  readonly stack: string | null | undefined;
  readonly tags: ReadonlyArray<string> | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "SEVHoverCardContent_fragment";
};
export type SEVHoverCardContent_fragment$key = {
  readonly " $data"?: SEVHoverCardContent_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SEVHoverCardContent_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SEVHoverCardContent_fragment",
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
      "name": "stack",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "severity",
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
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EntUser",
      "kind": "LinkedField",
      "name": "coordinator",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "EmployeeLink_fragment"
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
  ],
  "type": "EntSEV",
  "abstractKey": null
};

(node as any).hash = "5e960b2fde4ce0bde600ba7104ba89e0";

export default node;

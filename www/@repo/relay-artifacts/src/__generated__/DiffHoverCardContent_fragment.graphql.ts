/**
 * @generated SignedSource<<972c3f6b10c7018c99d4829b7197daa6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DiffStatus = "CLOSED" | "MERGED" | "OPEN" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type DiffHoverCardContent_fragment$data = {
  readonly author: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeReference_fragment">;
  } | null | undefined;
  readonly comments: ReadonlyArray<{
    readonly id: string;
  }>;
  readonly number: number;
  readonly projects: ReadonlyArray<string>;
  readonly significantLines: number;
  readonly status: DiffStatus;
  readonly tags: ReadonlyArray<string> | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "DiffHoverCardContent_fragment";
};
export type DiffHoverCardContent_fragment$key = {
  readonly " $data"?: DiffHoverCardContent_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DiffHoverCardContent_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DiffHoverCardContent_fragment",
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
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "EmployeeReference_fragment"
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
  "type": "EntDiff",
  "abstractKey": null
};

(node as any).hash = "d7eab52df0642e6c57956caa7eada6b2";

export default node;

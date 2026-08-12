/**
 * @generated SignedSource<<3b395c43eb0c392ed41ef9461c5e1486>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type TaskPriority = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM" | "%future added value";
export type TaskStatus = "BLOCKED" | "CLOSED" | "IN_PROGRESS" | "OPEN" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type TaskHoverCardContent_fragment$data = {
  readonly number: number;
  readonly owner: {
    readonly " $fragmentSpreads": FragmentRefs<"EmployeeReference_fragment">;
  } | null | undefined;
  readonly priority: TaskPriority;
  readonly status: TaskStatus;
  readonly tags: ReadonlyArray<string> | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "TaskHoverCardContent_fragment";
};
export type TaskHoverCardContent_fragment$key = {
  readonly " $data"?: TaskHoverCardContent_fragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TaskHoverCardContent_fragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TaskHoverCardContent_fragment",
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
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "EmployeeReference_fragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "EntTask",
  "abstractKey": null
};

(node as any).hash = "0df006ed659663bb5d86a5936b5a2580";

export default node;

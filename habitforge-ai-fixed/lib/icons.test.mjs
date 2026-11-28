import { test } from "node:test";
import assert from "node:assert/strict";

import * as icons from "lucide-react";

test("lucide-react exposes the axis icon that replaced centerline", () => {
  // lucide-react renamed the centerline icon resources to axis in 1.74.0.
  assert.equal(typeof icons.SquareAxisDashedHorizontal, "object");
  assert.equal(typeof icons.SquareAxisDashedVertical, "object");

  // The icons already used by the app must still be exported after the bump.
  for (const name of ["Brain", "Calendar", "Clock", "ListChecks", "Target"]) {
    assert.equal(typeof icons[name], "object", `${name} should remain exported`);
  }
});

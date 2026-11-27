import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";

import * as icons from "lucide-react";

const require = createRequire(import.meta.url);
const iconsEntry = require.resolve("lucide-react");
const iconsPackage = JSON.parse(
  readFileSync(
    path.join(path.dirname(iconsEntry), "..", "..", "package.json"),
    "utf8",
  ),
);

test("the app uses lucide-react 1.81+ and keeps the icon exports its call sites rely on", () => {
  const [major, minor] = iconsPackage.version
    .split(".")
    .map((part) => Number.parseInt(part, 10));

  assert.ok(
    major > 1 || (major === 1 && minor >= 81),
    `expected lucide-react 1.81.0 or newer, found ${iconsPackage.version}`,
  );

  // Icons added in 1.81.0 must be available for future call sites.
  for (const name of ["Elevator", "SteeringWheel", "GlobeClock", "BowlChopsticks"]) {
    assert.equal(typeof icons[name], "object", `${name} should be exported`);
  }

  // The icons already imported by the app must still be exported after the bump.
  for (const name of [
    "Brain",
    "Calendar",
    "Clock",
    "ListChecks",
    "Target",
    "Loader2",
    "Bell",
    "Calendar",
    "Flame",
    "TrendingUp",
    "CheckCircle",
    "CheckCircle2",
    "Circle",
    "SkipForward",
    "Trophy",
    "Sparkles",
    "Flag",
    "Layers",
    "Edit",
    "Plus",
    "ArrowLeft",
    "ArrowRight",
    "Check",
    "ChevronRight",
    "ChevronDown",
    "ChevronUp",
    "Circle",
    "LayoutDashboard",
    "BarChart3",
    "User",
    "LogOut",
    "Moon",
    "Sun",
    "Send",
    "X",
    "MailCheck",
    "Zap",
    "Star",
  ]) {
    assert.equal(typeof icons[name], "object", `${name} should remain exported`);
  }

  // Icons whose shapes changed in 1.81.0 must keep their public names.
  for (const name of [
    "SquareSigma",
    "Smartphone",
    "RectangleHorizontal",
    "RectangleVertical",
  ]) {
    assert.equal(typeof icons[name], "object", `${name} should remain exported`);
  }
});

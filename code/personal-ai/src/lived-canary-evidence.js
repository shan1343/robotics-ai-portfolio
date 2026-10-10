// Public candidate: references below are fictional fixture markers, not private Git commit IDs.
export const CANARY_EVIDENCE_SCHEMA_VERSION = "lived-beta-canary-evidence/v1";

export const PREPARED_AGAINST = Object.freeze({
  sharedMain: "fixture-reference-1",
  authBoundary: "fixture-reference-2",
  schemaMigration: "fixture-reference-3",
  uiVerification: "fixture-reference-4",
  providerReadback: "fixture-reference-5",
  sideEffectReview: "fixture-reference-6",
  configurationLimit: "fixture-reference-7",
});

export const GITHUB_CANARY_ASSERTIONS = Object.freeze([
  "GH-PRE-01",
  "GH-PERM-01",
  "GH-BIND-A-01",
  "GH-BIND-B-01",
  "GH-UI-01",
  "GH-DRY-01",
  "GH-WRITE-01",
  "GH-REFETCH-01",
  "GH-NEG-A-UNSELECTED-READ",
  "GH-NEG-A-UNSELECTED-WRITE",
  "GH-NEG-A-B-READ",
  "GH-NEG-A-B-WRITE",
  "GH-NEG-CLAIMS-01",
  "GH-CONCURRENCY-01",
  "GH-RENAME-01",
  "GH-REVOKE-01",
  "GH-EXPIRY-01",
  "GH-SECRET-SCAN-01",
  "GH-CLEANUP-01",
]);

export const GMAIL_CANARY_ASSERTIONS = Object.freeze([
  "GM-PRE-01",
  "GM-READ-01",
  "GM-CONTEXT-01",
  "GM-DRAFT-01",
  "GM-APPROVAL-01",
  "GM-SEND-01",
  "GM-SENT-REFETCH-01",
  "GM-AMBIGUITY-CHECK-01",
  "GM-RETRY-APPROVAL-01",
  "GM-DUPLICATE-GUARD-01",
  "GM-PROJECT-ACTIVATION-01",
  "GM-FRESH-RECOVERY-01",
  "GM-FRESH-SENT-REFETCH-01",
  "GM-FRESH-NO-RESEND-01",
  "GM-PRIVACY-SCAN-01",
  "GM-CLEANUP-01",
]);

const CANARIES = new Set(["github-private-repo", "gmail-native-reply"]);
const EVIDENCE_CLASSES = new Set(["SYNTHETIC_FIXTURE", "LIVED_SANITIZED"]);
const RESULTS = new Set(["PASS", "FAIL", "BLOCKED", "UNKNOWN", "CONFLICT", "NOT_TRIGGERED"]);
const REASON_CODES = new Set([
  "NONE",
  "NOT_TRIGGERED",
  "PRECONDITION_UNMET",
  "APPROVAL_MISSING",
  "PROVIDER_DENIED",
  "PROVIDER_AMBIGUOUS",
  "REFETCH_MISMATCH",
  "CROSS_SCOPE_SIDE_EFFECT",
  "SECRET_SCAN_MATCH",
  "CLEANUP_INCOMPLETE",
  "ACTIVATION_UNVERIFIED",
  "DEPENDENCY_DRIFT",
  "CONFLICT",
  "UNKNOWN",
]);
const SEND_DISPOSITIONS = new Set([
  "DIRECT_CONFIRMED_SENT",
  "AMBIGUOUS_FOUND_SENT",
  "AMBIGUOUS_ABSENT_REAPPROVED_SENT",
]);
const COMMON_KEYS = [
  "schemaVersion",
  "canary",
  "runId",
  "evidenceClass",
  "lifecycleState",
  "preparedAgainst",
  "outcome",
  "assertions",
  "metrics",
];
const GITHUB_METRIC_KEYS = [
  "markerWriteAttempts",
  "markerWritesObserved",
  "crossScopeSideEffects",
  "sameTargetRemintsObserved",
  "unexpectedTargetsObserved",
  "secretMatches",
];
const GMAIL_METRIC_KEYS = [
  "sendAttempts",
  "sentMessagesMatched",
  "retriesBeforeSentCheck",
  "duplicateSendsObserved",
  "publicPrivateDataFields",
];

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function checkExactKeys(value, expected, path, errors) {
  if (!isRecord(value)) {
    errors.push(path + " must be an object.");
    return false;
  }
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    errors.push(path + " has missing or unapproved fields.");
    return false;
  }
  return true;
}

function checkNonNegativeInteger(value, path, errors) {
  if (!Number.isSafeInteger(value) || value < 0) {
    errors.push(path + " must be a non-negative safe integer.");
  }
}

function validatePreparedAgainst(value, errors) {
  if (!checkExactKeys(value, Object.keys(PREPARED_AGAINST), "preparedAgainst", errors)) return;
  for (const [name, sha] of Object.entries(PREPARED_AGAINST)) {
    if (value[name] !== sha) errors.push("preparedAgainst." + name + " does not match the selected fixture reference.");
  }
}

function validateAssertions(value, requiredIds, errors) {
  const byId = new Map();
  if (!Array.isArray(value) || value.length !== requiredIds.length) {
    errors.push("assertions must contain the exact canary assertion set.");
    return byId;
  }
  value.forEach((assertion, index) => {
    const path = "assertions[" + index + "]";
    if (!checkExactKeys(assertion, ["id", "result", "reasonCode"], path, errors)) return;
    if (assertion.id !== requiredIds[index]) {
      errors.push(path + ".id must be " + requiredIds[index] + ".");
    }
    if (!RESULTS.has(assertion.result)) errors.push(path + ".result is invalid.");
    if (!REASON_CODES.has(assertion.reasonCode)) errors.push(path + ".reasonCode is invalid.");
    if (assertion.result === "PASS" && assertion.reasonCode !== "NONE") {
      errors.push(path + " PASS must use reasonCode NONE.");
    }
    if (assertion.result === "NOT_TRIGGERED" && assertion.reasonCode !== "NOT_TRIGGERED") {
      errors.push(path + " NOT_TRIGGERED must use reasonCode NOT_TRIGGERED.");
    }
    if (["FAIL", "BLOCKED", "UNKNOWN", "CONFLICT"].includes(assertion.result) &&
        (assertion.reasonCode === "NONE" || assertion.reasonCode === "NOT_TRIGGERED")) {
      errors.push(path + " failure must use a sanitized failure reasonCode.");
    }
    if (byId.has(assertion.id)) errors.push("assertions contains duplicate id " + assertion.id + ".");
    byId.set(assertion.id, assertion);
  });
  return byId;
}

function requireAssertionResult(byId, id, accepted, gateFailures) {
  const result = byId.get(id)?.result;
  if (!accepted.includes(result)) gateFailures.push(id);
}

function validateGitHub(report, byId, errors, gateFailures) {
  if (!checkExactKeys(report.metrics, GITHUB_METRIC_KEYS, "metrics", errors)) return;
  for (const key of GITHUB_METRIC_KEYS) checkNonNegativeInteger(report.metrics[key], "metrics." + key, errors);

  for (const id of GITHUB_CANARY_ASSERTIONS) requireAssertionResult(byId, id, ["PASS"], gateFailures);

  const expected = {
    markerWriteAttempts: 1,
    markerWritesObserved: 1,
    crossScopeSideEffects: 0,
    sameTargetRemintsObserved: 1,
    unexpectedTargetsObserved: 0,
    secretMatches: 0,
  };
  for (const [key, value] of Object.entries(expected)) {
    if (report.metrics[key] !== value) gateFailures.push("METRIC_" + key);
  }
}

function validateGmail(report, byId, errors, gateFailures) {
  if (!SEND_DISPOSITIONS.has(report.sendDisposition)) errors.push("sendDisposition is invalid.");
  if (!checkExactKeys(report.metrics, GMAIL_METRIC_KEYS, "metrics", errors)) return;
  for (const key of GMAIL_METRIC_KEYS) checkNonNegativeInteger(report.metrics[key], "metrics." + key, errors);

  const conditional = new Set(["GM-AMBIGUITY-CHECK-01", "GM-RETRY-APPROVAL-01"]);
  for (const id of GMAIL_CANARY_ASSERTIONS) {
    if (!conditional.has(id)) requireAssertionResult(byId, id, ["PASS"], gateFailures);
  }

  const expectedByDisposition = {
    DIRECT_CONFIRMED_SENT: {
      attempts: 1,
      ambiguity: "NOT_TRIGGERED",
      retryApproval: "NOT_TRIGGERED",
    },
    AMBIGUOUS_FOUND_SENT: {
      attempts: 1,
      ambiguity: "PASS",
      retryApproval: "NOT_TRIGGERED",
    },
    AMBIGUOUS_ABSENT_REAPPROVED_SENT: {
      attempts: 2,
      ambiguity: "PASS",
      retryApproval: "PASS",
    },
  };
  const expected = expectedByDisposition[report.sendDisposition];
  if (expected) {
    requireAssertionResult(byId, "GM-AMBIGUITY-CHECK-01", [expected.ambiguity], gateFailures);
    requireAssertionResult(byId, "GM-RETRY-APPROVAL-01", [expected.retryApproval], gateFailures);
    if (report.metrics.sendAttempts !== expected.attempts) gateFailures.push("METRIC_sendAttempts");
  }
  if (report.metrics.sentMessagesMatched !== 1) gateFailures.push("METRIC_sentMessagesMatched");
  if (report.metrics.retriesBeforeSentCheck !== 0) gateFailures.push("METRIC_retriesBeforeSentCheck");
  if (report.metrics.duplicateSendsObserved !== 0) gateFailures.push("METRIC_duplicateSendsObserved");
  if (report.metrics.publicPrivateDataFields !== 0) gateFailures.push("METRIC_publicPrivateDataFields");
}

export function evaluateCanaryEvidence(report) {
  const errors = [];
  const gateFailures = [];
  if (!isRecord(report)) {
    return Object.freeze({ schemaValid: false, verdict: "INVALID", errors: ["report must be an object."], gateFailures: [] });
  }

  const canary = report.canary;
  const topLevelKeys = canary === "gmail-native-reply"
    ? [...COMMON_KEYS, "sendDisposition"]
    : COMMON_KEYS;
  checkExactKeys(report, topLevelKeys, "report", errors);

  if (report.schemaVersion !== CANARY_EVIDENCE_SCHEMA_VERSION) errors.push("schemaVersion is unsupported.");
  if (!CANARIES.has(canary)) errors.push("canary is unsupported.");
  if (typeof report.runId !== "string" ||
      !/^canary-[0-9]{8}-(github|gmail)-[0-9]{3}$/.test(report.runId)) {
    errors.push("runId must use the sanitized canary-YYYYMMDD-kind-NNN form.");
  }
  if (!EVIDENCE_CLASSES.has(report.evidenceClass)) errors.push("evidenceClass is invalid.");
  if (report.evidenceClass === "LIVED_SANITIZED") {
    errors.push("Public synthetic fixture validator has no trusted provider readback; lived result cannot be certified.");
  }
  const expectedLifecycle = report.evidenceClass === "SYNTHETIC_FIXTURE" ? "REHEARSAL_ONLY" : "RESULT_LANDED";
  if (report.lifecycleState !== expectedLifecycle) {
    errors.push("lifecycleState does not match evidenceClass.");
  }
  if (!new Set(["PASS", "FAIL", "BLOCKED", "UNKNOWN", "CONFLICT"]).has(report.outcome)) {
    errors.push("outcome is invalid.");
  }
  validatePreparedAgainst(report.preparedAgainst, errors);

  const requiredIds = canary === "github-private-repo"
    ? GITHUB_CANARY_ASSERTIONS
    : GMAIL_CANARY_ASSERTIONS;
  const byId = validateAssertions(report.assertions, requiredIds, errors);

  if (canary === "github-private-repo") validateGitHub(report, byId, errors, gateFailures);
  if (canary === "gmail-native-reply") validateGmail(report, byId, errors, gateFailures);

  const assertions = Array.isArray(report.assertions) ? report.assertions : [];
  const hasBlocked = assertions.some((assertion) => assertion?.result === "BLOCKED");
  const hasConflict = assertions.some((assertion) => assertion?.result === "CONFLICT");
  const hasUnknown = assertions.some((assertion) => assertion?.result === "UNKNOWN");
  const hasFailed = assertions.some((assertion) => assertion?.result === "FAIL");
  const verdict = errors.length > 0
    ? "INVALID"
    : hasBlocked
      ? "BLOCKED"
      : hasConflict
        ? "CONFLICT"
        : hasUnknown
          ? "UNKNOWN"
          : hasFailed || gateFailures.length > 0
            ? "FAIL"
            : "PASS";
  if (verdict !== "INVALID" && report.outcome !== verdict) {
    errors.push("outcome does not match the computed verdict.");
  }

  return Object.freeze({
    schemaValid: errors.length === 0,
    verdict: errors.length === 0 ? verdict : "INVALID",
    errors: Object.freeze(errors),
    gateFailures: Object.freeze(gateFailures),
  });
}

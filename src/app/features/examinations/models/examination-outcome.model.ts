import { ExaminationAppeal } from './examination-appeal.model';

export interface ExaminationOutcome {
  readonly id: number;
  readonly register: string;
  readonly appeal: ExaminationAppeal;
  readonly present: boolean;
  readonly grade: number;
  readonly withHonors: boolean;
}

export type OutcomeResult = 'ABSENT' | 'FAILED' | 'INSUFFICIENT' | 'PASSED';

/**
 * Mirrors the grading rules from the legacy Thymeleaf view:
 * - not present               -> ABSENT
 * - present, grade < 0        -> FAILED
 * - present, 0 <= grade < 18  -> INSUFFICIENT
 * - present, grade >= 18      -> PASSED (student can accept or refuse)
 */
export function resolveOutcomeResult(outcome: ExaminationOutcome): OutcomeResult {
  if (!outcome.present) return 'ABSENT';
  if (outcome.grade < 0) return 'FAILED';
  if (outcome.grade < 18) return 'INSUFFICIENT';
  return 'PASSED';
}

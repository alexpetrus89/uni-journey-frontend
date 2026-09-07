export const WS_TOPICS = {
  examScheduled:'/user/topic/exam-scheduled',
  examOutcome:'/user/topic/exam-outcome',
  examAppealScheduled:'/user/topic/exam-appeal-scheduled',
  facultyNews:'/user/topic/faculty-news',
  passwordReset:'/user/topic/password-reset',
  passwordChanged:'/user/topic/password-changed',
  userRegistered:'/user/topic/user-registered',
  userDeleted:'/user/topic/user-deleted',
  accountLocked:'/user/topic/account-locked',
  accountUnlocked:'/user/topic/account-unlocked',
  studyPlanUpdate:'/user/topic/study-plan-updated'
} as const;

export const WS_ENDPOINT = '/api/v1/ws';


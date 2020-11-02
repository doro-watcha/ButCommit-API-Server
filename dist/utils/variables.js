"use strict";

module.exports = {
  // regular expressions
  usernameRegex: /^(?=.{6,24}$)([a-zA-Z0-9]+[.]{0,1}[a-zA-Z0-9]+)$/,
  passwordRegex: /^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.*[a-zA-Z])[a-zA-Z0-9!@#\$%\^&\*]{8,20}$/,
  // percentile to score 탐구
  tamguPercentileToScore: [66.22, 66, 65.56, 65.26, 64.92, 64.58, 64.24, 63.95, 63.64, 63.32, 63, 62.75, 62.49, 62.25, 62.01, 61.75, 61.49, 61.22, 60.96, 60.7, 60.44, 60.2, 59.96, 59.7, 59.46, 59.12, 58.86, 58.56, 58.21, 57.89, 57.56, 57.25, 56.95, 56.65, 56.36, 56.05, 55.72, 55.37, 54.99, 54.59, 54.2, 53.83, 53.46, 53.06, 52.57, 52.2, 51.82, 51.43, 50.97, 50.56, 50.16, 49.76, 49.37, 48.94, 48.51, 48.12, 47.62, 47.18, 46.77, 46.41, 46.08, 45.76, 45.41, 45.05, 44.74, 44.38, 44.02, 43.69, 43.37, 43.07, 42.74, 42.4, 42.1, 41.79, 41.5, 41.13, 40.73, 40.45, 40.18, 39.93, 39.68, 39.42, 39.14, 38.86, 38.53, 38.19, 37.9, 37.58, 37.28, 36.9, 36.58, 36.26, 35.83, 35.42, 34.96, 34.51, 34.05, 33.55, 32.92, 32.11, 30.33],
  // errors
  errors: {
    // 400 Bad Request
    INVALID_REQUEST: {
      status: 100,
      ko: '잘못된 요청',
      en: 'Invalid request'
    },
    EMAIL_ALREADY_VERIFIED: {
      status: 101,
      ko: '이미 인증된 이메일',
      en: 'Email already verified'
    },
    // 102 is already taken by JOI
    CHALLENGE_ENTRY_ALREADY_APPROVED: {
      status: 103,
      ko: '이미 승인된 참가 영상',
      en: 'Challenge entry already approved'
    },
    CHALLENGE_ENTRY_ALREADY_REJECTED: {
      status: 104,
      ko: '이미 거절된 참가 영상',
      en: 'Challenge entry already rejected'
    },
    PROMO_ALREADY_ENDED: {
      status: 105,
      ko: '이미 종료된 프로모',
      en: 'Promo already ended'
    },
    SOCIAL_CHANNEL_VIDEO_TYPE_CANNOT_BE_CHANGED: {
      status: 106,
      ko: '채널 변경 불가능',
      en: 'Channel type cannot be change'
    },
    // 401 Unauthorized
    PASSWORD_MISMATCH: {
      status: 200,
      ko: '비밀번호 불일치',
      en: 'Password mismatch'
    },
    INVALID_TOKEN: {
      status: 201,
      ko: '유효하지 않은 토큰',
      en: 'Invalid token'
    },
    UNVERIFIED_EMAIL: {
      status: 202,
      ko: '인증되지 않은 이메일',
      en: 'Unverified email'
    },
    CONSENT_REQUIRED: {
      status: 203,
      ko: '법적 고지에 대한 동의가 필요함',
      en: 'Consent required'
    },
    // 403 Forbidden
    NO_ACCESS: {
      status: 300,
      ko: '접근 권한 없음',
      en: 'No access'
    },
    // 404 Not Found
    USER_NOT_FOUND: {
      status: 402,
      ko: '사용자 없음',
      en: 'User not found'
    },
    COMMENT_NOT_FOUND: {
      status: 404,
      ko: '댓글 없음',
      en: 'Comment not found'
    },
    BOOKMARK_NOT_FOUND: {
      status: 406,
      ko: '북마크 없음',
      en: 'Bookmark not found'
    },
    NOTIFICATION_NOT_FOUND: {
      status: 407,
      ko: '알림 없음',
      en: 'Notification not found'
    },
    NOTIFICATION_TYPE_NOT_FOUND: {
      status: 408,
      ko: '알림 유형 없음',
      en: 'Notification type not found'
    },
    LIKE_NOT_FOUND: {
      status: 413,
      ko: '좋아요 없음',
      en: 'Like not found'
    },
    SCORE_NOT_FOUND: {
      status: 414,
      ko: '해당 성적 없음'
    },
    REPORT_NOT_FOUND: {
      status: 415,
      ko: '해당 예측 리포트 없음'
    },
    MAJOR_NOT_FOUND: {
      status: 416,
      ko: '해당 학과 없음'
    },
    UNIVERSITY_NOT_FOUND: {
      status: 416,
      ko: '검색 가능 대학 없음'
    },
    CONSULTING_NOT_FOUND: {
      status: 417,
      ko: '해당 상담 없음'
    },
    PAYMENT_RECORD_NOT_FOUND: {
      status: 418,
      ko: '해당 결제 기록 없음'
    },
    MAJOR_DATA_NOT_FOUND: {
      status: 419,
      ko: '해당 학과 정보 없음'
    },
    ACADEMY_NOT_FOUND: {
      status: 420,
      ko: '해당 학원 없음'
    },
    // 409
    USER_ALREADY_EXISTS: {
      status: 500,
      ko: '이미 사용자 존재',
      en: 'User already exists'
    },
    BOOKMARK_ALREADY_EXISTS: {
      status: 501,
      ko: '이미 북마크 존재',
      en: 'Bookmark already exists'
    },
    LIKE_ALREADY_EXISTS: {
      status: 502,
      ko: '이미 좋아요 존재',
      en: 'Like already exists'
    },
    UNIVERSITY_ALREADY_EXISTS: {
      status: 503,
      ko: '이미 존재하는 대학입니다'
    },
    MAJOR_ALREADY_EXISTS: {
      status: 504,
      ko: '이미 존재하는 학과입니다'
    },
    SCORE_ALREADY_EXISTS: {
      status: 505,
      ko: '이미 성적이 존재합니다'
    },
    REPORT_ALREADY_EXISTS: {
      status: 506,
      ko: '이미 존재하는 예측 보고서입니다'
    },
    REFLECTION_RATIO_ALREADY_EXISTS: {
      status: 507,
      ko: '이미 해당 대학의 반영비율이 존재합니다'
    },
    PAYMENT_RECORD_ALREADY_EXISTS: {
      status: 508,
      ko: '이미 결제 기록이 존재합니다'
    },
    CONSULTING_ALREADY_EXISTS: {
      status: 509,
      ko: '이미 존재하는 상담입니다'
    },
    ACADEMY_ALREADY_EXISTS: {
      status: 510,
      ko: '이미 존재하는 학원입니다'
    },
    // 410
    USER_DELETED: {
      status: 600,
      ko: '이미 탈퇴한 사용자입니다.',
      en: 'This user has deleted their account.'
    },
    COMMENT_DELETED: {
      status: 602,
      ko: '삭제된 댓글입니다.',
      en: 'This comment has been deleted.'
    },
    // 500
    INTERNAL_SERVER_ERROR_700: {
      status: 700,
      ko: '서버 오류',
      en: 'Internal Server Error'
    },
    CONSTRAINT_FAILED: {
      status: 701,
      ko: '외래키 제약 조건 실패',
      en: 'Foreign key constraint fails'
    }
  }
};
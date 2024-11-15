export const NOT_FOUND_URL_STATUS_CODE = 499;

export enum ECustomExceptionCode {

  /** 중복된 아이디입니다. */ 'USER-001' = 'USER-001',
  /** 존재하지 않는 유저 */ 'USER-002' = 'USER-002',
  /** 중복로그인은 허용되지 않습니다. */ 'USER-003' = 'USER-003',

  /** 공간을 찾을 수 없음 */ 'SPACE-001' = 'SPACE-001',
  /** 유효하지 않은 코드 */ 'SPACE-002' = 'SPACE-002',

  /** 게시글을 찾을 수 없음 */ 'POST-001' = 'POST-001',
  /** 게시글 카테고리 오류 */ 'POST-002' = 'POST-002',

  /** 댓글을 찾을 수 없음 */ 'COMMENT-001' = 'COMMENT-001',
  /** 답글을 찾을 수 없음 */ 'COMMENT-002' = 'COMMENT-002',

  /** 소유자만 이용할 수 있습니다. */ 'ROLE-001' = 'ROLE-001',
  /** 누군가 사용중인 역할[삭제불가]. */ 'ROLE-002' = 'ROLE-002',
  /** 관리자 이상만 이용할 수 있습니다. */ 'ROLE-003' = 'ROLE-003',
  /** 강제퇴장 시킬 수 없는 경우 */ 'ROLE-004' = 'ROLE-004',
  /** 익명 작성 규칙 위반 */ 'ROLE-005' = 'ROLE-005',
  /** 공지사항 작성 규칙 위반 */ 'ROLE-006' = 'ROLE-006',
  /** [게시물 포함]삭제 규칙 위반 */ 'ROLE-007' = 'ROLE-007',
  /** [댓글]삭제 규칙 위반 */ 'ROLE-008' = 'ROLE-008',

  /** 비밀번호 불일치 */ 'INCORECT-PWD' = 'INCORECT-PWD',
  /** DB 비밀번호 불일치 */ 'INCORECT-DB-PWD' = 'INCORECT-DB-PWD',

  /** TOKEN 자체가 없는 경우 */ 'JWT-001' = 'JWT-001',
  /** TOKEN TYPE 불일치 */ 'JWT-002' = 'JWT-002',

  'AWS-RDS-EXCEPTION' = 'AWS-RDS-EXCEPTION',

  /** MARIA DB Pool 또는 Connection 관련 에러 */
  'DB-CONNECTION-EXCEPTION' = 'DB-CONNECTION-EXCEPTION',

  /**
   * S3 관련 작업이 실패한 경우입니다.
   * 
   * FE에서는 다른 메세지로 노출됩니다. 
   */
  'AWS-S3-EXCEPTION' = 'AWS-S3-EXCEPTION',
  /**
   * CF 관련 작업이 실패한 경우입니다.
   * 
   * FE에서는 다른 메세지로 노출됩니다. 
   */
  'AWS-CF-EXCEPTION' = 'AWS-CF-EXCEPTION',
 
  /** 예외처리 하지 못한 경우 */
  'UNKNOWN-SERVER-ERROR' = 'UNKNOWN-SERVER-ERROR',
  'INTERVAL-SERVER-ERROR' = 'INTERVAL-SERVER-ERROR',

}
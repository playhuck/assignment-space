export const NOT_FOUND_URL_STATUS_CODE = 499;

export enum ECustomExceptionCode {

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
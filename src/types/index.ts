export type SecurityLevel = 'normal' | 'internal' | 'core' | 'forbidden'

export interface CaseFile {
  id: string
  name: string
  caseNumber: string
  clientName: string
  category: '合同' | '证据' | '庭审笔录' | '其他'
  securityLevel: SecurityLevel
  size: number
  uploadTime: string
  uploader: string
  authorizedBy?: string
  authorizedAt?: string
  isInHighSecurityZone: boolean
}

export type AccessAction = 'view' | 'download' | 'unlock_request' | 'unlock_approve'

export interface AccessLogEntry {
  id: string
  fileId: string
  fileName: string
  caseNumber: string
  clientName: string
  action: AccessAction
  operator: string
  operatorRole: '合伙人' | '律师助理' | '档案管理员'
  timestamp: string
  remark?: string
}

export interface ReviewResult {
  fileId: string
  fileName: string
  securityLevel: SecurityLevel
  hasAuthorization: boolean
  authorizedBy?: string
  status: 'allowed' | 'needs_partner' | 'forbidden'
  reason: string
}

export const SECURITY_LEVEL_LABELS: Record<SecurityLevel, string> = {
  normal: '普通',
  internal: '内部',
  core: '核心',
  forbidden: '禁止外传',
}

export const SECURITY_LEVEL_COLORS: Record<SecurityLevel, string> = {
  normal: 'bg-security-normal',
  internal: 'bg-security-internal',
  core: 'bg-security-core',
  forbidden: 'bg-security-forbidden',
}

export const ACCESS_ACTION_LABELS: Record<AccessAction, string> = {
  view: '查看',
  download: '下载',
  unlock_request: '申请解锁',
  unlock_approve: '解锁审批',
}

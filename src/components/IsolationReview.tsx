import { useState } from 'react'
import {
  ShieldCheck,
  ArrowLeft,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  FileSpreadsheet,
  File,
  Shield,
  ShieldAlert,
  ShieldX,
  Check,
  Package,
  UserCheck,
  Ban,
  RefreshCw,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { SecurityLevel, CaseFile } from '../types'
import { SECURITY_LEVEL_LABELS } from '../types'

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase()
  if (['pdf'].includes(ext || '')) return <FileText className="w-5 h-5" />
  if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-5 h-5" />
  if (['xls', 'xlsx'].includes(ext || '')) return <FileSpreadsheet className="w-5 h-5" />
  return <File className="w-5 h-5" />
}

const getSecurityIcon = (level: SecurityLevel) => {
  switch (level) {
    case 'normal':
      return <ShieldCheck className="w-4 h-4 text-security-normal" />
    case 'internal':
      return <Shield className="w-4 h-4 text-security-internal" />
    case 'core':
      return <ShieldAlert className="w-4 h-4 text-security-core" />
    case 'forbidden':
      return <ShieldX className="w-4 h-4 text-security-forbidden" />
  }
}

const getSecurityBadgeClass = (level: SecurityLevel) => {
  switch (level) {
    case 'normal':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'internal':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'core':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'forbidden':
      return 'bg-red-50 text-red-700 border-red-200'
  }
}

const IsolationReview = () => {
  const {
    setCurrentView,
    files,
    selectedFileIds,
    toggleFileSelection,
    clearSelection,
    reviewResults,
    performReview,
    filterCaseNumber,
    filterClientName,
    setFilterCaseNumber,
    setFilterClientName,
    addAccessLog,
    currentUser,
  } = useAppStore()

  const [hasReviewed, setHasReviewed] = useState(false)

  const filteredFiles = files.filter((f) => {
    const matchCase = !filterCaseNumber || f.caseNumber.includes(filterCaseNumber)
    const matchClient = !filterClientName || f.clientName.includes(filterClientName)
    return matchCase && matchClient
  })

  const handleReview = () => {
    performReview()
    setHasReviewed(true)
    selectedFileIds.forEach((fileId) => {
      const file = files.find((f) => f.id === fileId)
      if (file) {
        addAccessLog({
          fileId: file.id,
          fileName: file.name,
          caseNumber: file.caseNumber,
          clientName: file.clientName,
          action: 'unlock_request',
          operator: currentUser.name,
          operatorRole: currentUser.role,
          remark: '隔离审查申请',
        })
      }
    })
  }

  const handleReset = () => {
    clearSelection()
    setHasReviewed(false)
  }

  const getResultIcon = (status: string) => {
    switch (status) {
      case 'allowed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case 'needs_partner':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'forbidden':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getResultLabel = (status: string) => {
    switch (status) {
      case 'allowed':
        return { text: '允许打包', class: 'bg-emerald-100 text-emerald-700' }
      case 'needs_partner':
        return { text: '需要合伙人确认', class: 'bg-amber-100 text-amber-700' }
      case 'forbidden':
        return { text: '禁止外发', class: 'bg-red-100 text-red-700' }
      default:
        return { text: '未审查', class: 'bg-slate-100 text-slate-500' }
    }
  }

  const getStats = () => {
    let allowed = 0
    let needsPartner = 0
    let forbidden = 0
    reviewResults.forEach((result) => {
      if (result.status === 'allowed') allowed++
      else if (result.status === 'needs_partner') needsPartner++
      else if (result.status === 'forbidden') forbidden++
    })
    return { allowed, needsPartner, forbidden }
  }

  const selectedFiles = files.filter((f) => selectedFileIds.includes(f.id))
  const stats = getStats()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800">隔离审查</h1>
                <p className="text-xs text-slate-500">外发文件密级检查与授权确认</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重置
            </button>
            <button
              onClick={handleReview}
              disabled={selectedFileIds.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-4 h-4" />
              开始审查
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {hasReviewed && selectedFileIds.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">审查结果概览</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-slate-700">{selectedFileIds.length}</p>
                <p className="text-xs text-slate-500 mt-1">待审文件</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-2xl font-bold text-emerald-600">{stats.allowed}</span>
                </div>
                <p className="text-xs text-emerald-600">允许打包</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span className="text-2xl font-bold text-amber-600">{stats.needsPartner}</span>
                </div>
                <p className="text-xs text-amber-600">需合伙人确认</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-red-600">{stats.forbidden}</span>
                </div>
                <p className="text-xs text-red-600">禁止外发</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">选择待审查文件</h3>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={filterCaseNumber}
                      onChange={(e) => setFilterCaseNumber(e.target.value)}
                      placeholder="按案号筛选..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={filterClientName}
                      onChange={(e) => setFilterClientName(e.target.value)}
                      placeholder="按客户名筛选..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {filteredFiles.length === 0 ? (
                  <div className="p-12 text-center">
                    <File className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">暂无匹配的文件</p>
                  </div>
                ) : (
                  filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => toggleFileSelection(file.id)}
                      className={`flex items-center gap-3 px-5 py-3 border-b border-slate-100 cursor-pointer transition-colors ${
                        selectedFileIds.includes(file.id)
                          ? 'bg-amber-50 border-amber-100'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedFileIds.includes(file.id)
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedFileIds.includes(file.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
                        {getFileIcon(file.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.caseNumber} · {file.clientName}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${getSecurityBadgeClass(
                          file.securityLevel
                        )}`}
                      >
                        {getSecurityIcon(file.securityLevel)}
                        {SECURITY_LEVEL_LABELS[file.securityLevel]}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  已选择 <span className="font-medium text-slate-700">{selectedFileIds.length}</span> 份文件
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800">审查详情</h3>
              </div>

              {selectedFiles.length === 0 ? (
                <div className="p-8 text-center">
                  <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">请先选择待审查的文件</p>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto">
                  {selectedFiles.map((file) => {
                    const result = reviewResults.get(file.id)
                    const resultLabel = result
                      ? getResultLabel(result.status)
                      : getResultLabel('pending')

                    return (
                      <div
                        key={file.id}
                        className="px-5 py-4 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {result ? getResultIcon(result.status) : (
                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-slate-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{file.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{file.caseNumber}</p>
                          </div>
                        </div>

                        <div className="ml-8 space-y-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getSecurityBadgeClass(
                                file.securityLevel
                              )}`}
                            >
                              {getSecurityIcon(file.securityLevel)}
                              {SECURITY_LEVEL_LABELS[file.securityLevel]}
                            </span>
                            {file.isInHighSecurityZone && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                高密区
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-xs">
                            <UserCheck className={`w-3.5 h-3.5 ${file.authorizedBy ? 'text-emerald-500' : 'text-slate-400'}`} />
                            <span className={file.authorizedBy ? 'text-slate-600' : 'text-slate-400'}>
                              {file.authorizedBy
                                ? `已授权：${file.authorizedBy}`
                                : '缺少授权人确认'}
                            </span>
                          </div>

                          {hasReviewed && result && (
                            <div className={`mt-2 p-2.5 rounded-lg ${resultLabel.class}`}>
                              <div className="flex items-center gap-1.5 font-medium text-xs mb-0.5">
                                {result.status === 'allowed' && <Package className="w-3.5 h-3.5" />}
                                {result.status === 'needs_partner' && <AlertTriangle className="w-3.5 h-3.5" />}
                                {result.status === 'forbidden' && <Ban className="w-3.5 h-3.5" />}
                                {resultLabel.text}
                              </div>
                              <p className="text-xs opacity-80">{result.reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {hasReviewed && selectedFiles.length > 0 && (
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-3">
                    {stats.forbidden > 0
                      ? `⚠️ 有 ${stats.forbidden} 份禁止外传文件，严禁外发`
                      : stats.needsPartner > 0
                      ? `📋 有 ${stats.needsPartner} 份文件需合伙人确认后方可外发`
                      : '✅ 所有文件均通过审查，可直接打包外发'}
                  </p>
                  <button
                    disabled={stats.forbidden > 0 || stats.needsPartner > 0}
                    className="w-full py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    打包外发
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IsolationReview

import { FolderKanban, ShieldCheck, History, User } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const HomePage = () => {
  const { setCurrentView, currentUser, files, accessLogs } = useAppStore()

  const menuItems = [
    {
      key: 'cabinet',
      title: '案件文件柜',
      description: '按客户名或案号管理合同、证据、庭审笔录，设置密级标识',
      icon: FolderKanban,
      iconColor: '#2563eb',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      count: files.length,
      countLabel: '份文件',
    },
    {
      key: 'review',
      title: '隔离审查',
      description: '外发前检查文件密级和授权状态，给出明确外发意见',
      icon: ShieldCheck,
      iconColor: '#d97706',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      count: files.filter((f) => f.isInHighSecurityZone).length,
      countLabel: '份高密文件',
    },
    {
      key: 'logs',
      title: '借阅记录',
      description: '记录查看、下载、解锁申请等操作，按案号追溯操作历史',
      icon: History,
      iconColor: '#059669',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      count: accessLogs.length,
      countLabel: '条记录',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">律师事务所云盘密级隔离系统</h1>
              <p className="text-xs text-slate-500">案件材料安全管理平台</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{currentUser.name}</p>
              <p className="text-xs text-slate-500">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">工作台</h2>
          <p className="text-slate-500">选择功能模块开始工作</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentView(item.key as 'cabinet' | 'review' | 'logs')}
              className={`group text-left ${item.bgColor} border ${item.borderColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7" style={{ color: item.iconColor }} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{item.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-2xl font-bold text-slate-700">{item.count}</span>
                <span className="text-sm text-slate-500">{item.countLabel}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">普通文件</p>
            <p className="text-2xl font-bold text-security-normal">
              {files.filter((f) => f.securityLevel === 'normal').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">内部文件</p>
            <p className="text-2xl font-bold text-security-internal">
              {files.filter((f) => f.securityLevel === 'internal').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">核心文件</p>
            <p className="text-2xl font-bold text-security-core">
              {files.filter((f) => f.securityLevel === 'core').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">禁止外传</p>
            <p className="text-2xl font-bold text-security-forbidden">
              {files.filter((f) => f.securityLevel === 'forbidden').length}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage

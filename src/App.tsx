import { useAppStore } from './store/useAppStore'
import HomePage from './components/HomePage'
import CaseCabinet from './components/CaseCabinet'
import IsolationReview from './components/IsolationReview'
import AccessLogs from './components/AccessLogs'

function App() {
  const { currentView } = useAppStore()

  return (
    <div className="min-h-screen bg-slate-100">
      {currentView === 'home' && <HomePage />}
      {currentView === 'cabinet' && <CaseCabinet />}
      {currentView === 'review' && <IsolationReview />}
      {currentView === 'logs' && <AccessLogs />}
    </div>
  )
}

export default App

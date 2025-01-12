import { Suspense } from 'react'
import VerifyContent from './verify-content'

export default function VerifyPage() {
  return (
    <div className="page-container">
      <div className="wave"></div>
      <div className="wave opacity-70" style={{ animationDelay: '-2s' }}></div>
      <div className="wave opacity-50" style={{ animationDelay: '-4s' }}></div>
      <div className="relative z-10 flex flex-col items-center">
        <Suspense fallback={
          <div className="card p-8 max-w-md w-full text-center">
            <h1 className="text-2xl text-white mb-6">Email Verification</h1>
            <p className="text-white/60">Loading...</p>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  )
}

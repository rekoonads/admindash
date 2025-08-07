import { LoadingSpinner } from '@/components/loading-spinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
          <span className="text-3xl font-bold text-white">K</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          KOODOS
        </h1>
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Loading dashboard...</p>
      </div>
    </div>
  )
}
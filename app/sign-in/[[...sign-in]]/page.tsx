'use client'

import { SignIn } from '@clerk/nextjs'
import { useIsMobile } from '@/hooks/use-mobile'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const isMobile = useIsMobile()
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/admin')
    }
  }, [isSignedIn, isLoaded, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className={`w-full ${isMobile ? 'max-w-sm px-2' : 'max-w-md'}`}>
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className={`inline-flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-black rounded-2xl mb-3 sm:mb-4`}>
            <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>K</span>
          </div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-black`}>
            KOODOS
          </h1>
          <p className="text-gray-600 mt-2">Admin Dashboard</p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 mt-1`}>Sign in to manage your gaming content</p>
        </div>

        {/* Sign In Form */}
        <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 ${isMobile ? 'p-4' : 'p-8'}`}>
          <SignIn  
            fallbackRedirectUrl="/admin"  
            appearance={{  
              elements: { 
                footerAction: { display: 'none' },
                footerActionLink: { display: 'none' }
              }  
            }}  
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs text-gray-500">
            © 2024 KOODOS. Gaming content management system.
          </p>
        </div>
      </div>
    </div>
  )
}
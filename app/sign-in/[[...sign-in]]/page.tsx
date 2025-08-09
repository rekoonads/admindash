'use client'

import { SignIn } from '@clerk/nextjs'
import { useIsMobile } from '@/hooks/use-mobile'

export default function Page() {
  const isMobile = useIsMobile()

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
            redirectUrl="/admin"
            afterSignInUrl="/admin"
            signUpUrl={null}
            routing="hash"
            appearance={{
              variables: {
                colorPrimary: "#000000",
                colorText: "#000000",
                colorTextSecondary: "#6b7280",
                colorBackground: "#ffffff",
                colorInputBackground: "#ffffff",
                colorInputText: "#000000",
                borderRadius: "0.5rem"
              },
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-none bg-transparent p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-black",
                formButtonPrimary: "bg-black hover:bg-gray-800 text-white border-none",
                formFieldInput: "border-gray-200 text-black",
                formFieldLabel: "text-black",
                footerAction: "hidden",
                identityPreviewText: "text-black",
                identityPreviewEditButton: "text-black"
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
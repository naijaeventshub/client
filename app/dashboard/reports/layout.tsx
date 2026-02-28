"use client"

import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

function LayoutContent({ children, }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    return 'view'
  }

  const tabs: { id: string; label: string; path: string }[] = []

  const activeTab = getActiveTab()

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className={cn(
                "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}


export default function Layout({ children, }: { children: React.ReactNode }) {
  return (
    <LayoutContent>
      {children}
    </LayoutContent>
  )
}

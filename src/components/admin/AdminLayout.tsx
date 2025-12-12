'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  LogOut,
  Home,
  UserCheck,
  Users,
  CreditCard,
  BarChart3,
  FileText,
  Image,
  Award,
  Users as UsersIcon,
  Building,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/admin/dashboard' },
  { name: 'Attendance', icon: UserCheck, href: '/admin/attendance' },
  { name: 'Members', icon: Users, href: '/admin/members' },
  { name: 'Fees', icon: CreditCard, href: '/admin/fees' },
  { name: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { name: 'divider1', type: 'divider' },
  { name: 'Content Management', type: 'header' },
  { name: 'Testimonials', icon: FileText, href: '/admin/testimonials' },
  { name: 'Partners & Logos', icon: Building, href: '/admin/partners' },
  { name: 'Membership Plans', icon: Award, href: '/admin/plans' },
  { name: 'Gallery', icon: Image, href: '/admin/gallery' },
  { name: 'Trainers', icon: UsersIcon, href: '/admin/trainers' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' }
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-white shadow-lg h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-blue-600 mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-2 rounded-md text-white hover:bg-blue-600 mr-4"
            >
              {sidebarCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Pulse Gym Admin
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium bg-white text-primary border border-white rounded-md hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed lg:fixed top-16 bottom-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-56'
        } w-56`}>
          <nav className="py-4">
            <div className="px-3 space-y-1">
              {menuItems.map((item) => {
                if (item.type === 'divider') {
                  return <div key={item.name} className="border-t border-gray-200 mx-3 my-3"></div>
                }
                if (item.type === 'header') {
                  return (
                    <div key={item.name} className={`px-3 py-2 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.name}
                      </h3>
                    </div>
                  )
                }
                if (item.href) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                        pathname === item.href
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                      } ${sidebarCollapsed ? 'lg:justify-center lg:px-3' : ''}`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className={`ml-3 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                    </Link>
                  )
                }
                return null
              })}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'
        }`}>
          {/* Breadcrumbs */}
          <nav className="bg-white px-6 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/admin/dashboard" className="hover:text-primary">Dashboard</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium capitalize">
                {pathname.split('/').pop()?.replace('-', ' ')}
              </span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>

          {/* Page content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
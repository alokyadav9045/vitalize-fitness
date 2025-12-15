'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Settings,
  Save,
  Mail,
  Bell,
  CreditCard,
  Building,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react'

interface GymSettings {
  gymName: string
  address: string
  phone: string
  email: string
  website: string
  openingHours: {
    monday: { open: string; close: string }
    tuesday: { open: string; close: string }
    wednesday: { open: string; close: string }
    thursday: { open: string; close: string }
    friday: { open: string; close: string }
    saturday: { open: string; close: string }
    sunday: { open: string; close: string }
  }
  membershipFees: {
    basic: number
    premium: number
    elite: number
  }
  notifications: {
    emailReminders: boolean
    smsReminders: boolean
    paymentNotifications: boolean
    attendanceAlerts: boolean
  }
  systemSettings: {
    autoBackup: boolean
    maintenanceMode: boolean
    maxMembers: number
    sessionTimeout: number
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<GymSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (data.success) {
        setSettings(data.settings)
      } else {
        console.error('Failed to fetch settings:', data.message)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      const data = await response.json()
      if (data.success) {
        console.log('Settings saved successfully')
        // Optionally show success message
      } else {
        console.error('Failed to save settings:', data.message)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSettings = (section: keyof GymSettings, field: string, value: string | number | boolean) => {
    if (!settings) return

    setSettings(prev => {
      if (!prev) return prev

      const updated = { ...prev }
      if (section === 'openingHours') {
        const [day, timeType] = field.split('.')
        if (updated.openingHours[day as keyof typeof updated.openingHours]) {
          (updated.openingHours[day as keyof typeof updated.openingHours] as { open: string; close: string })[timeType as 'open' | 'close'] = value as string
        }
      } else if (section === 'membershipFees') {
        (updated.membershipFees as Record<string, number>)[field] = value as number
      } else if (section === 'notifications') {
        (updated.notifications as Record<string, boolean>)[field] = value as boolean
      } else if (section === 'systemSettings') {
        (updated.systemSettings as Record<string, number | boolean>)[field] = value as number | boolean
      } else {
        (updated as Record<string, unknown>)[field] = value
      }
      return updated
    })
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Settings not available</h3>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Building },
    { id: 'hours', name: 'Opening Hours', icon: Calendar },
    { id: 'fees', name: 'Membership Fees', icon: DollarSign },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System', icon: Settings }
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Configure your gym settings and preferences</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              {isSaving ? (
                '⏳'
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">General Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gym Name</label>
                    <input
                      type="text"
                      value={settings.gymName}
                      onChange={(e) => updateSettings('gymName', 'gymName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => updateSettings('phone', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSettings('email', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={settings.website}
                      onChange={(e) => updateSettings('website', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    rows={3}
                    value={settings.address}
                    onChange={(e) => updateSettings('address', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {activeTab === 'hours' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Opening Hours</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(settings.openingHours).map(([day, hours]) => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 capitalize mb-3">{day}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Open</label>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => updateSettings('openingHours', `${day}.open`, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Close</label>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => updateSettings('openingHours', `${day}.close`, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Membership Fees */}
            {activeTab === 'fees' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Membership Fees (Monthly)</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Basic Plan</h4>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={settings.membershipFees.basic}
                        onChange={(e) => updateSettings('membershipFees', 'basic', parseInt(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Premium Plan</h4>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={settings.membershipFees.premium}
                        onChange={(e) => updateSettings('membershipFees', 'premium', parseInt(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Elite Plan</h4>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={settings.membershipFees.elite}
                        onChange={(e) => updateSettings('membershipFees', 'elite', parseInt(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Email Reminders</h4>
                        <p className="text-sm text-gray-600">Send payment and renewal reminders via email</p>
                      </div>
                    </div>
                    <label htmlFor="email-reminders" className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="email-reminders"
                        type="checkbox"
                        checked={settings.notifications.emailReminders}
                        onChange={(e) => updateSettings('notifications', 'emailReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Reminders</h4>
                        <p className="text-sm text-gray-600">Send payment and renewal reminders via SMS</p>
                      </div>
                    </div>
                    <label htmlFor="sms-reminders" className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="sms-reminders"
                        type="checkbox"
                        checked={settings.notifications.smsReminders}
                        onChange={(e) => updateSettings('notifications', 'smsReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">WhatsApp Reminders</h4>
                        <p className="text-sm text-gray-600">Send payment and renewal reminders via WhatsApp</p>
                      </div>
                    </div>
                    <label htmlFor="whatsapp-reminders" className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="whatsapp-reminders"
                        type="checkbox"
                        checked={settings.notifications.whatsappReminders}
                        onChange={(e) => updateSettings('notifications', 'whatsappReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Payment Notifications</h4>
                        <p className="text-sm text-gray-600">Notify admin about new payments and failed transactions</p>
                      </div>
                    </div>
                    <label htmlFor="payment-notifications" className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="payment-notifications"
                        type="checkbox"
                        checked={settings.notifications.paymentNotifications}
                        onChange={(e) => updateSettings('notifications', 'paymentNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Attendance Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified about low attendance and member check-ins</p>
                      </div>
                    </div>
                    <label htmlFor="attendance-alerts" className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="attendance-alerts"
                        type="checkbox"
                        checked={settings.notifications.attendanceAlerts}
                        onChange={(e) => updateSettings('notifications', 'attendanceAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">System Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Members</label>
                    <input
                      type="number"
                      value={settings.systemSettings.maxMembers}
                      onChange={(e) => updateSettings('systemSettings', 'maxMembers', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.systemSettings.sessionTimeout}
                      onChange={(e) => updateSettings('systemSettings', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Automatic Backup</h4>
                      <p className="text-sm text-gray-600">Automatically backup data daily</p>
                    </div>
                    <label htmlFor="auto-backup" className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="auto-backup"
                        type="checkbox"
                        checked={settings.systemSettings.autoBackup}
                        onChange={(e) => updateSettings('systemSettings', 'autoBackup', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-900">Maintenance Mode</h4>
                      <p className="text-sm text-red-600">Put the system in maintenance mode (members cannot access)</p>
                    </div>
                    <label htmlFor="maintenance-mode" className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="maintenance-mode"
                        type="checkbox"
                        checked={settings.systemSettings.maintenanceMode}
                        onChange={(e) => updateSettings('systemSettings', 'maintenanceMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
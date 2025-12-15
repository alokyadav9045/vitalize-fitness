import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import GymSettings from '@/lib/models/GymSettings'

export async function GET() {
  try {
    await dbConnect()

    // Get the first (and likely only) settings document
    const settings = await GymSettings.findOne().sort({ createdAt: -1 })

    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = new GymSettings({
        gymName: 'Vitalize Fitness',
        address: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '22:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '10:00', close: '18:00' }
        },
        membershipFees: {
          basic: 999,
          premium: 1999,
          elite: 2999
        },
        notifications: {
          emailReminders: true,
          smsReminders: false,
          whatsappReminders: false,
          paymentNotifications: true,
          attendanceAlerts: true
        },
        systemSettings: {
          autoBackup: true,
          maintenanceMode: false,
          maxMembers: 1000,
          sessionTimeout: 30
        }
      })

      await defaultSettings.save()

      return NextResponse.json({
        success: true,
        settings: defaultSettings
      })
    }

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const {
      gymName,
      address,
      phone,
      email,
      website,
      openingHours,
      membershipFees,
      notifications,
      systemSettings
    } = body

    // Get existing settings or create new one
    let settings = await GymSettings.findOne()

    if (!settings) {
      settings = new GymSettings()
    }

    // Update fields
    if (gymName !== undefined) settings.gymName = gymName
    if (address !== undefined) settings.address = address
    if (phone !== undefined) settings.phone = phone
    if (email !== undefined) settings.email = email
    if (website !== undefined) settings.website = website
    if (openingHours !== undefined) settings.openingHours = openingHours
    if (membershipFees !== undefined) settings.membershipFees = membershipFees
    if (notifications !== undefined) settings.notifications = notifications
    if (systemSettings !== undefined) settings.systemSettings = systemSettings

    await settings.save()

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
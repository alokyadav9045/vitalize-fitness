export interface Member {
  _id?: string
  memberId: string
  name: string
  email: string
  phone: string
  dateOfBirth?: Date
  gender?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  membershipType: 'Basic' | 'Premium' | 'Elite'
  startDate: Date
  endDate: Date
  status: 'Active' | 'Inactive' | 'Expired'
  profileImage?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Attendance {
  _id?: string
  memberId: string
  date: Date
  checkInTime: Date
  checkOutTime?: Date
  status: 'Present' | 'Late' | 'Absent'
  createdAt?: Date
}

export interface Fee {
  _id?: string
  memberId: string
  amount: number
  paymentDate: Date
  paymentMode: 'Cash' | 'Card' | 'UPI' | 'Net Banking'
  month: number
  year: number
  receiptNumber: string
  notes?: string
  createdAt?: Date
}

export interface Admin {
  _id?: string
  username: string
  password: string
  name: string
  email: string
  role: 'admin' | 'manager'
  createdAt?: Date
}
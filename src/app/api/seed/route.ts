import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Member from '@/lib/models/Member'
import Trainer from '@/lib/models/Trainer'
import Testimonial from '@/lib/models/Testimonial'
import MembershipPlan from '@/lib/models/MembershipPlan'
import Partner from '@/lib/models/Partner'
import Fee from '@/lib/models/Fee'
import Attendance from '@/lib/models/Attendance'

export async function POST() {
  try {
    await dbConnect()
    console.log('Connected to MongoDB')

    // Clear existing data
    await Member.deleteMany({})
    await Trainer.deleteMany({})
    await Testimonial.deleteMany({})
    await MembershipPlan.deleteMany({})
    await Partner.deleteMany({})
    await Fee.deleteMany({})
    await Attendance.deleteMany({})
    console.log('Cleared existing data')

    // Seed Members
    const members = [
      {
        memberId: 'PG001',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+91-9876543210',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Male',
        address: '123 Main Street, Mumbai, Maharashtra',
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+91-9876543211',
          relationship: 'Spouse'
        },
        membershipType: 'Premium',
        joinDate: new Date('2024-01-15'),
        status: 'Active',
        profileImage: '/members/john-doe.jpg'
      },
      {
        memberId: 'PG002',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        phone: '+91-9876543212',
        dateOfBirth: new Date('1988-08-22'),
        gender: 'Female',
        address: '456 Park Avenue, Delhi, Delhi',
        emergencyContact: {
          name: 'Mike Wilson',
          phone: '+91-9876543213',
          relationship: 'Husband'
        },
        membershipType: 'Elite',
        joinDate: new Date('2024-02-01'),
        status: 'Active',
        profileImage: '/members/sarah-wilson.jpg'
      },
      {
        memberId: 'PG003',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91-9876543214',
        dateOfBirth: new Date('1992-03-10'),
        gender: 'Male',
        address: '789 Gandhi Road, Bangalore, Karnataka',
        emergencyContact: {
          name: 'Priya Kumar',
          phone: '+91-9876543215',
          relationship: 'Wife'
        },
        membershipType: 'Basic',
        joinDate: new Date('2024-03-20'),
        status: 'Active',
        profileImage: '/members/rajesh-kumar.jpg'
      },
      {
        memberId: 'PG004',
        name: 'Emily Chen',
        email: 'emily.chen@email.com',
        phone: '+91-9876543216',
        dateOfBirth: new Date('1995-11-30'),
        gender: 'Female',
        address: '321 Tech Park, Hyderabad, Telangana',
        emergencyContact: {
          name: 'David Chen',
          phone: '+91-9876543217',
          relationship: 'Brother'
        },
        membershipType: 'Premium',
        joinDate: new Date('2024-04-10'),
        status: 'Active',
        profileImage: '/members/emily-chen.jpg'
      },
      {
        memberId: 'PG005',
        name: 'Amit Singh',
        email: 'amit.singh@email.com',
        phone: '+91-9876543218',
        dateOfBirth: new Date('1987-07-18'),
        gender: 'Male',
        address: '654 Royal Palace, Jaipur, Rajasthan',
        emergencyContact: {
          name: 'Sunita Singh',
          phone: '+91-9876543219',
          relationship: 'Sister'
        },
        membershipType: 'Elite',
        joinDate: new Date('2024-05-05'),
        status: 'Active',
        profileImage: '/members/amit-singh.jpg'
      }
    ]

    const createdMembers = await Member.insertMany(members)
    console.log('Seeded members:', createdMembers.length)

    // Seed Trainers
    const trainers = [
      {
        name: 'Michael Johnson',
        email: 'michael@vitalizefitness.com',
        phone: '+91-9876543220',
        specialization: ['Personal Training', 'Strength Training', 'Nutrition'],
        experience: 8,
        bio: 'Certified personal trainer with 8 years of experience specializing in strength training and nutrition coaching.',
        image: '/trainers/michael-johnson.jpg',
        rating: 4.9,
        certifications: ['NASM-CPT', 'Precision Nutrition', 'Olympic Weightlifting']
      },
      {
        name: 'Priya Sharma',
        email: 'priya@vitalizefitness.com',
        phone: '+91-9876543221',
        specialization: ['Yoga', 'Pilates', 'Meditation'],
        experience: 6,
        bio: 'Experienced yoga instructor and meditation guide helping members achieve mind-body wellness.',
        image: '/trainers/priya-sharma.jpg',
        rating: 4.8,
        certifications: ['RYT-500', 'Pilates Comprehensive', 'Meditation Teacher']
      },
      {
        name: 'David Rodriguez',
        email: 'david@vitalizefitness.com',
        phone: '+91-9876543222',
        specialization: ['Cardio Training', 'HIIT', 'Group Fitness'],
        experience: 10,
        bio: 'High-energy cardio specialist and group fitness instructor passionate about making workouts fun and effective.',
        image: '/trainers/david-rodriguez.jpg',
        rating: 4.7,
        certifications: ['ACE-CPT', 'AFAA', 'HIIT Specialist']
      },
      {
        name: 'Lisa Chen',
        email: 'lisa@vitalizefitness.com',
        phone: '+91-9876543223',
        specialization: ['CrossFit', 'Functional Training', 'Sports Performance'],
        experience: 7,
        bio: 'CrossFit coach and functional training expert helping athletes reach their peak performance.',
        image: '/trainers/lisa-chen.jpg',
        rating: 4.9,
        certifications: ['CrossFit L2', 'Functional Movement Screen', 'Sports Performance']
      }
    ]

    const createdTrainers = await Trainer.insertMany(trainers)
    console.log('Seeded trainers:', createdTrainers.length)

    // Seed Testimonials
    const testimonials = [
      {
        name: 'John Doe',
        role: 'Premium Member',
        content: 'Vitalize Fitness has transformed my fitness journey! The trainers are incredibly knowledgeable and the facilities are top-notch. I\'ve lost 20kg and gained so much confidence.',
        rating: 5,
        image: '/testimonials/john-doe.jpg'
      },
      {
        name: 'Sarah Wilson',
        role: 'Elite Member',
        content: 'The personalized training programs and nutrition guidance have been game-changing. The staff goes above and beyond to ensure member success.',
        rating: 5,
        image: '/testimonials/sarah-wilson.jpg'
      },
      {
        name: 'Rajesh Kumar',
        role: 'Basic Member',
        content: 'Great value for money! Clean facilities, modern equipment, and friendly atmosphere. Perfect for someone starting their fitness journey.',
        rating: 4,
        image: '/testimonials/rajesh-kumar.jpg'
      },
      {
        name: 'Emily Chen',
        role: 'Premium Member',
        content: 'The group classes are amazing and the community here is so supportive. I\'ve made great friends while getting in the best shape of my life!',
        rating: 5,
        image: '/testimonials/emily-chen.jpg'
      },
      {
        name: 'Amit Singh',
        role: 'Elite Member',
        content: 'Professional gym with excellent trainers. The attention to detail in every aspect is remarkable. Highly recommend for serious fitness enthusiasts.',
        rating: 5,
        image: '/testimonials/amit-singh.jpg'
      }
    ]

    const createdTestimonials = await Testimonial.insertMany(testimonials)
    console.log('Seeded testimonials:', createdTestimonials.length)

    // Seed Membership Plans
    const plans = [
      {
        name: 'Basic',
        type: 'Basic',
        price: 1999,
        duration: 1,
        features: [
          'Access to gym equipment',
          'Locker facility',
          'Basic fitness assessment',
          'Group classes access',
          'Water station access'
        ],
        description: 'Perfect for beginners starting their fitness journey with essential gym access.'
      },
      {
        name: 'Premium',
        type: 'Premium',
        price: 3499,
        duration: 1,
        features: [
          'All Basic features',
          '2 Personal training sessions/month',
          'Nutrition consultation',
          'Advanced fitness assessment',
          'Priority booking for classes',
          'Towel service'
        ],
        description: 'Comprehensive package for fitness enthusiasts seeking personalized guidance.',
        popular: true
      },
      {
        name: 'Elite',
        type: 'Elite',
        price: 5999,
        duration: 1,
        features: [
          'All Premium features',
          'Unlimited personal training',
          'Customized meal plans',
          'Recovery sessions',
          'VIP lounge access',
          'Guest passes (2/month)',
          'Complimentary beverages',
          'Priority parking'
        ],
        description: 'Ultimate fitness experience with premium services and unlimited access.',
        popular: false
      }
    ]

    const createdPlans = await MembershipPlan.insertMany(plans)
    console.log('Seeded membership plans:', createdPlans.length)

    // Seed Partners
    const partners = [
      {
        name: 'FitLife Nutrition',
        logo: '/partners/fitlife-nutrition.jpg',
        website: 'https://fitlife-nutrition.com',
        description: 'Premium nutrition supplements and wellness products',
        order: 1
      },
      {
        name: 'SportTech Equipment',
        logo: '/partners/sporttech.jpg',
        website: 'https://sporttech.com',
        description: 'Professional fitness equipment manufacturer',
        order: 2
      },
      {
        name: 'HealthFirst Insurance',
        logo: '/partners/healthfirst.jpg',
        website: 'https://healthfirst-insurance.com',
        description: 'Comprehensive health and fitness insurance coverage',
        order: 3
      },
      {
        name: 'Pure Water Co.',
        logo: '/partners/purewater.jpg',
        website: 'https://purewater.com',
        description: 'Premium bottled water and hydration solutions',
        order: 4
      }
    ]

    const createdPartners = await Partner.insertMany(partners)
    console.log('Seeded partners:', createdPartners.length)

    // Seed Fees (sample payments)
    const fees = [
      {
        memberId: createdMembers[0]._id,
        amount: 3499,
        paymentDate: new Date('2024-12-01'),
        paymentMode: 'UPI',
        month: 12,
        year: 2024,
        notes: 'Premium membership fee for December 2024'
      },
      {
        memberId: createdMembers[1]._id,
        amount: 5999,
        paymentDate: new Date('2024-12-05'),
        paymentMode: 'Card',
        month: 12,
        year: 2024,
        notes: 'Elite membership fee for December 2024'
      },
      {
        memberId: createdMembers[2]._id,
        amount: 1999,
        paymentDate: new Date('2024-12-10'),
        paymentMode: 'Cash',
        month: 12,
        year: 2024,
        notes: 'Basic membership fee for December 2024'
      },
      {
        memberId: createdMembers[3]._id,
        amount: 3499,
        paymentDate: new Date('2024-11-15'),
        paymentMode: 'Net Banking',
        month: 11,
        year: 2024,
        notes: 'Premium membership fee for November 2024'
      },
      {
        memberId: createdMembers[4]._id,
        amount: 5999,
        paymentDate: new Date('2024-11-20'),
        paymentMode: 'UPI',
        month: 11,
        year: 2024,
        notes: 'Elite membership fee for November 2024'
      }
    ]

    const createdFees = await Fee.insertMany(fees)
    console.log('Seeded fees:', createdFees.length)

    // Seed Attendance (sample attendance records)
    const attendanceRecords = []
    const today = new Date()

    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      // Add attendance for active members
      for (let j = 0; j < createdMembers.length; j++) {
        if (Math.random() > 0.2) { // 80% attendance rate
          attendanceRecords.push({
            memberId: createdMembers[j]._id,
            date: date,
            checkInTime: new Date(date.getTime() + Math.random() * 8 * 60 * 60 * 1000), // Random time between 00:00 and 08:00
            status: Math.random() > 0.1 ? 'Present' : 'Late' // 90% present, 10% late
          })
        }
      }
    }

    const createdAttendance = await Attendance.insertMany(attendanceRecords)
    console.log('Seeded attendance records:', createdAttendance.length)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      summary: {
        members: createdMembers.length,
        trainers: createdTrainers.length,
        testimonials: createdTestimonials.length,
        plans: createdPlans.length,
        partners: createdPartners.length,
        fees: createdFees.length,
        attendance: createdAttendance.length
      }
    })

  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed database', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
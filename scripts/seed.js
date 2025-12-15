import dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' })

// Temporary fix: set the URI manually
process.env.MONGODB_URI = 'mongodb+srv://alokyadav83956_db_user:pulse@cluster0.um3zupg.mongodb.net/'

import dbConnect from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import Member from '@/lib/models/Member'
import Trainer from '@/lib/models/Trainer'
import Testimonial from '@/lib/models/Testimonial'
import MembershipPlan from '@/lib/models/MembershipPlan'
import Partner from '@/lib/models/Partner'
import Fee from '@/lib/models/Fee'
import Attendance from '@/lib/models/Attendance'
import GymSettings from '@/lib/models/GymSettings'
import GalleryImage from '@/lib/models/GalleryImage'
import Admin from '@/lib/models/Admin'

async function seedDatabase() {
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
    await GymSettings.deleteMany({})
    await GalleryImage.deleteMany({})
    await Admin.deleteMany({})
    console.log('Cleared existing data')

    // Helper function to calculate end date (1 year from start)
    const getEndDate = (startDate) => {
      const end = new Date(startDate)
      end.setFullYear(end.getFullYear() + 1)
      return end
    }

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
        startDate: new Date('2024-01-15'),
        endDate: getEndDate(new Date('2024-01-15')),
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
        startDate: new Date('2024-02-01'),
        endDate: new Date('2025-02-01'),
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
        startDate: new Date('2024-03-20'),
        endDate: new Date('2025-03-20'),
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
        startDate: new Date('2024-04-10'),
        endDate: new Date('2025-04-10'),
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
        startDate: new Date('2024-05-05'),
        endDate: new Date('2025-05-05'),
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
        receiptNumber: 'RCP0001',
        notes: 'Premium membership fee for December 2024'
      },
      {
        memberId: createdMembers[1]._id,
        amount: 5999,
        paymentDate: new Date('2024-12-05'),
        paymentMode: 'Card',
        month: 12,
        year: 2024,
        receiptNumber: 'RCP0002',
        notes: 'Elite membership fee for December 2024'
      },
      {
        memberId: createdMembers[2]._id,
        amount: 1999,
        paymentDate: new Date('2024-12-10'),
        paymentMode: 'Cash',
        month: 12,
        year: 2024,
        receiptNumber: 'RCP0003',
        notes: 'Basic membership fee for December 2024'
      },
      {
        memberId: createdMembers[3]._id,
        amount: 3499,
        paymentDate: new Date('2024-11-15'),
        paymentMode: 'Net Banking',
        month: 11,
        year: 2024,
        receiptNumber: 'RCP0004',
        notes: 'Premium membership fee for November 2024'
      },
      {
        memberId: createdMembers[4]._id,
        amount: 5999,
        paymentDate: new Date('2024-11-20'),
        paymentMode: 'UPI',
        month: 11,
        year: 2024,
        receiptNumber: 'RCP0005',
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

    // Seed Gym Settings
    const gymSettings = {
      gymName: 'Vitalize Fitness',
      address: '123 Fitness Street, Health City, HC 12345',
      phone: '+91 98765 43210',
      email: 'info@vitalizefitness.com',
      website: 'https://vitalizefitness.com',
      openingHours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '07:00', close: '20:00' },
        sunday: { open: '08:00', close: '18:00' }
      },
      membershipFees: {
        basic: 1999,
        premium: 3499,
        elite: 5999
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
    }

    const createdSettings = await GymSettings.create(gymSettings)
    console.log('Seeded gym settings')

    // Seed Gallery Images
    const galleryImages = [
      {
        title: 'Modern Gym Equipment',
        image: '/gallery/alexander-red-d3bYmnZ0ank-unsplash.jpg',
        category: 'equipment',
        description: 'State-of-the-art gym equipment for comprehensive workouts',
        isActive: true
      },
      {
        title: 'Cardio Training Area',
        image: '/gallery/alexandra-tran-fS3tGOkp0xY-unsplash.jpg',
        category: 'cardio',
        description: 'Modern cardio machines for cardiovascular fitness',
        isActive: true
      },
      {
        title: 'Strength Training Zone',
        image: '/gallery/alina-chernysheva-JA2S6sJWleg-unsplash.jpg',
        category: 'strength',
        description: 'Dedicated strength training area with free weights',
        isActive: true
      },
      {
        title: 'Group Fitness Classes',
        image: '/gallery/brett-jordan-U2q73PfHFpM-unsplash.jpg',
        category: 'classes',
        description: 'High-energy group fitness classes for all levels',
        isActive: true
      },
      {
        title: 'Personal Training Session',
        image: '/gallery/danielle-cerullo-CQfNt66ttZM-unsplash.jpg',
        category: 'training',
        description: 'One-on-one personal training with certified professionals',
        isActive: true
      },
      {
        title: 'Yoga and Wellness',
        image: '/gallery/delaney-van-udE7Kh7QHbM-unsplash.jpg',
        category: 'yoga',
        description: 'Peaceful yoga studio for mind-body wellness',
        isActive: true
      },
      {
        title: 'Professional Training',
        image: '/gallery/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg',
        category: 'training',
        description: 'Professional training sessions with expert guidance',
        isActive: true
      },
      {
        title: 'Gym Facilities',
        image: '/gallery/eduardo-cano-photo-co-AzX5iNFYBMY-unsplash.jpg',
        category: 'facilities',
        description: 'Modern gym facilities designed for optimal performance',
        isActive: true
      },
      {
        title: 'CrossFit Training',
        image: '/gallery/eduardo-cano-photo-co-gP9rAnGJBRo-unsplash.jpg',
        category: 'crossfit',
        description: 'High-intensity CrossFit workouts for serious athletes',
        isActive: true
      },
      {
        title: 'Weightlifting Area',
        image: '/gallery/humphrey-m-LOA2mTj1vhc-unsplash.jpg',
        category: 'strength',
        description: 'Dedicated weightlifting area with professional equipment',
        isActive: true
      },
      {
        title: 'Fitness Equipment',
        image: '/gallery/istockphoto-1183038884-1024x1024.jpg',
        category: 'equipment',
        description: 'Comprehensive fitness equipment for all training needs',
        isActive: true
      },
      {
        title: 'Cardio Machines',
        image: '/gallery/istockphoto-1187121639-1024x1024.jpg',
        category: 'cardio',
        description: 'Latest cardio machines for effective cardiovascular training',
        isActive: true
      },
      {
        title: 'Gym Interior',
        image: '/gallery/istockphoto-1369897962-1024x1024.jpg',
        category: 'facilities',
        description: 'Spacious and well-equipped gym interior',
        isActive: true
      },
      {
        title: 'Functional Training',
        image: '/gallery/john-fornander-TAZoUmDqzXk-unsplash.jpg',
        category: 'training',
        description: 'Functional training area for comprehensive fitness',
        isActive: true
      },
      {
        title: 'Group Exercise',
        image: '/gallery/jonathan-borba-lrQPTQs7nQQ-unsplash.jpg',
        category: 'classes',
        description: 'Motivational group exercise sessions',
        isActive: true
      },
      {
        title: 'Fitness Training',
        image: '/gallery/logan-weaver-lgnwvr-apyd8hWmIw0-unsplash.jpg',
        category: 'training',
        description: 'Professional fitness training programs',
        isActive: true
      },
      {
        title: 'Strength Equipment',
        image: '/gallery/luis-reyes-mTorQ9gFfOg-unsplash.jpg',
        category: 'strength',
        description: 'Advanced strength training equipment',
        isActive: true
      },
      {
        title: 'Cardio Fitness',
        image: '/gallery/samuel-girven-2e4lbLTqPIo-unsplash.jpg',
        category: 'cardio',
        description: 'Cardio fitness zone with modern equipment',
        isActive: true
      },
      {
        title: 'Gym Atmosphere',
        image: '/gallery/samuel-girven-VJ2s0c20qCo-unsplash.jpg',
        category: 'facilities',
        description: 'Inviting gym atmosphere for all members',
        isActive: true
      },
      {
        title: 'Professional Equipment',
        image: '/gallery/spencer-davis-0ShTs8iPY28-unsplash.jpg',
        category: 'equipment',
        description: 'Professional-grade equipment for serious training',
        isActive: true
      }
    ]

    const createdGallery = await GalleryImage.insertMany(galleryImages)
    console.log('Seeded gallery images:', createdGallery.length)

    // Seed Admin
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await Admin.create({
      username: 'admin',
      password: adminPassword,
      name: 'Administrator',
      role: 'admin'
    })
    console.log('Seeded admin user')

    console.log('Database seeding completed successfully!')
    console.log('Summary:')
    console.log(`- Members: ${createdMembers.length}`)
    console.log(`- Trainers: ${createdTrainers.length}`)
    console.log(`- Testimonials: ${createdTestimonials.length}`)
    console.log(`- Membership Plans: ${createdPlans.length}`)
    console.log(`- Partners: ${createdPartners.length}`)
    console.log(`- Fees: ${createdFees.length}`)
    console.log(`- Attendance Records: ${createdAttendance.length}`)
    console.log(`- Gym Settings: 1`)
    console.log(`- Gallery Images: ${createdGallery.length}`)
    console.log(`- Admin Users: 1`)

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    process.exit(0)
  }
}

seedDatabase()
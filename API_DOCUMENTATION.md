# Pulse Gym Management System - API Documentation

## Overview
This is a comprehensive gym management system built with Next.js 14, featuring a complete admin panel with full CRUD operations for managing gym operations.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Members Management
- `GET /api/members` - Get all members (with search/filter)
- `POST /api/members` - Create new member
- `PUT /api/members` - Update member
- `DELETE /api/members?id={id}` - Delete member

### Testimonials Management
- `GET /api/testimonials` - Get all testimonials (with search/filter)
- `POST /api/testimonials` - Create new testimonial
- `PUT /api/testimonials` - Update testimonial
- `DELETE /api/testimonials?id={id}` - Delete testimonial

### Gallery Management
- `GET /api/gallery` - Get all gallery images (with search/filter)
- `POST /api/gallery` - Create new gallery image
- `PUT /api/gallery` - Update gallery image
- `DELETE /api/gallery?id={id}` - Delete gallery image

### Trainers Management
- `GET /api/trainers` - Get all trainers (with search/filter)
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers` - Update trainer
- `DELETE /api/trainers?id={id}` - Delete trainer

### Partners Management
- `GET /api/partners` - Get all partners (with search/filter)
- `POST /api/partners` - Create new partner
- `PUT /api/partners` - Update partner
- `DELETE /api/partners?id={id}` - Delete partner

### Membership Plans
- `GET /api/plans` - Get all membership plans (with search/filter)
- `POST /api/plans` - Create new membership plan
- `PUT /api/plans` - Update membership plan
- `DELETE /api/plans?id={id}` - Delete membership plan

### Attendance Tracking
- `GET /api/attendance` - Get attendance records (with filters)
- `POST /api/attendance` - Mark attendance (check-in)
- `PUT /api/attendance` - Update attendance (check-out)
- `DELETE /api/attendance?id={id}` - Delete attendance record

### Fee Management
- `GET /api/fees` - Get all fees (with filters)
- `POST /api/fees` - Create new fee
- `PUT /api/fees` - Update fee (mark as paid, etc.)
- `DELETE /api/fees?id={id}` - Delete fee

### Settings
- `GET /api/settings` - Get gym settings
- `PUT /api/settings` - Update gym settings

### Dashboard Analytics
- `GET /api/dashboard` - Get dashboard statistics and metrics

## Database Models

### Member
- Personal information (name, email, phone, etc.)
- Membership details (type, start/end dates)
- Emergency contact information

### Testimonial
- Customer name and content
- Rating (1-5 stars)
- Image URL
- Active status

### Gallery Image
- Title and description
- Image URL
- Category classification
- Active status

### Trainer
- Personal information and bio
- Specializations and experience
- Certifications
- Contact information

### Partner
- Company name and description
- Logo URL
- Website URL
- Active status

### Membership Plan
- Plan details (name, description, price)
- Duration and features
- Active status

### Attendance
- Member reference
- Check-in and check-out times
- Notes

### Fee
- Member reference
- Amount and description
- Due date and payment status
- Payment tracking

### Gym Settings
- General gym information
- Contact details
- Opening hours
- Social media links
- Feature toggles

## Features Implemented

✅ Complete admin panel UI with all CRUD operations
✅ Modal forms for add/edit operations
✅ Search and filtering functionality
✅ Responsive design with Tailwind CSS
✅ Database models with Mongoose ODM
✅ Full REST API with proper error handling
✅ JWT-based authentication
✅ Dashboard with key metrics
✅ Attendance tracking system
✅ Fee management system

## Next Steps

🔄 File upload functionality for images
🔄 Real-time notifications system
🔄 Advanced reporting and analytics
🔄 API integration with frontend components
🔄 Testing and deployment preparation

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT tokens
- **UI Components**: Lucide React icons, Custom components
- **Database**: MongoDB with Mongoose ODM
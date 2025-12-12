# Pulse Gym Management System

A comprehensive web application for managing gym operations, built with Next.js, TypeScript, and MongoDB.

## Features

### Landing Page
- Modern, responsive design with hero section
- About section with gym information
- Services showcase (Personal Training, Group Classes, etc.)
- Membership plans (Basic, Premium, Elite)
- Trainer profiles
- Gallery with image filtering
- Contact form

### Admin Panel
- Secure admin login
- Dashboard with key metrics
- Daily check-in system with member search
- Member management (CRUD operations)
- Attendance tracking
- Fee collection and management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **UI Components**: Custom components with Tailwind CSS
- **Animations**: Framer Motion
- **Database**: MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pulse-gym-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/pulse-gym
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

4. Start MongoDB service (if using local MongoDB)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- **URL**: http://localhost:3000/admin/login
- **Username**: admin
- **Password**: admin123

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Plans.tsx
│   ├── Trainers.tsx
│   ├── Gallery.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── lib/                   # Utility libraries
│   ├── models/           # Mongoose models
│   └── mongodb.ts        # Database connection
└── types/                # TypeScript interfaces
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Members
- `GET /api/members` - Get all members (with optional search)
- `POST /api/members` - Create new member

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance

## Database Models

### Member
- memberId (unique)
- name, email, phone
- membership details
- personal information

### Attendance
- memberId
- date, checkInTime
- status

### Fee
- memberId
- amount, payment details
- receipt information

## Deployment

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Database
- Use MongoDB Atlas for production
- Update MONGODB_URI in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

This project is licensed under the MIT License.
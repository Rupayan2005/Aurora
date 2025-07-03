# AURORA 🎬

A modern video upload platform built with Next.js, enabling users to upload and manage their videos seamlessly.

## 🚀 Features

- **User Authentication**: Secure login/signup with email/password and Google OAuth
- **Video Upload**: Video uploads with real-time processing
- **Personal Dashboard**: Manage your uploaded videos with delete functionality
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Processing**: Videos are uploaded to ImageKit immediately upon selection
- **User Management**: Complete user profile and video management system

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **File Storage**: ImageKit
- **Language**: TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rupayan2005/Aurora.git
   cd video-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
video-platform/
├── app/                # Next.js 13+ App Router
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication API routes
│   │   ├── video/      # Video management API routes
│   ├── login/          # Login page
│   ├── register/       # Sign Up page
│   ├── dashboard/      # User dashboard
│   ├── components/     # Video upload page and Providers
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── models/             # Database models
│   ├── user.ts         # User model
│   └── video.ts        # Video model
├── lib/                # Utility functions
├── middleware.ts       # Next.js middleware
└── public/             # Static assets
```

## 📱 Pages Overview

### Authentication
- **Login Page**: Email/password and Google OAuth signin
- **Signup Page**: User registration with validation

### Core Pages
- **Home Page**: Landing page with platform overview
- **Dashboard**: Personal video management interface
- **Upload Page**: Video upload with title and description fields

## 🔧 API Routes

- `POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `GET /api/videos` - Fetch user videos
- `POST /api/videos` - Upload new video
- `DELETE /api/videos/[id]` - Delete video
- `GET /api/user/profile` - Get user profile

## 🎯 Key Features Detail

### Video Upload Process
1. User selects video file
2. File immediately uploads to ImageKit
3. User adds title and description
4. Clicking "Publish" saves metadata to MongoDB
5. Video appears in user dashboard

### Authentication Flow
- Email/password authentication
- Google OAuth integration
- Protected routes with middleware
- Session management with NextAuth.js

### Dashboard Features
- View all uploaded videos
- Delete videos (removes from both ImageKit and MongoDB)
- Video metadata display
- Responsive grid layout

## 🔐 Security Features

- **Middleware Protection**: Secure routes requiring authentication
- **Input Validation**: Server-side validation for all inputs
- **File Type Validation**: Only video files accepted
- **Session Management**: Secure session handling with NextAuth.js

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## 📊 Database Schema

### User Model
```typescript
{
  email: string;
  password: string;
  provider: "credentials" | "google";
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Video Model
```typescript
{
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  fileId: string; 
  userId: string; 
  controls: boolean;
  transformation: {
    height: number;
    width: number;
    quality: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Configuration

### ImageKit Setup
1. Create an ImageKit account
2. Get your public/private keys and URL endpoint
3. Configure upload settings in ImageKit dashboard
4. Set video upload permissions

### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Add your IP to whitelist
4. Create database and collections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- ImageKit for reliable video storage
- MongoDB for flexible database solutions
- NextAuth.js for seamless authentication


**Built with ❤️ by [Rupayan Auddya]**

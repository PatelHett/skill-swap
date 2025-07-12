# Skill Swap Platform

A modern web application that enables users to exchange skills through a community-driven platform. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login and registration system
- **Profile Management**: Create and customize user profiles with skills and availability
- **Skill Discovery**: Browse and search for users by their offered skills
- **Swap Requests**: Send, accept, or reject skill exchange requests
- **Rating System**: Provide feedback after completed skill swaps
- **Privacy Controls**: Make profiles public or private
- **Admin Panel**: Content moderation and user management

### User Profile Features
- Basic information (name, location, profile photo)
- Skills offered and wanted lists
- Availability scheduling (weekends, evenings, etc.)
- Public/private profile toggle
- Request management dashboard

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **UI Components**: Custom components with modern design

## 🎨 Design System

```css
Primary Color: #0A192F (Dark Navy)
Accent Color: #2196F3 (Bright Teal)
Background: #FFFFFF (White)
Text Color: #333333 (Dark Gray)
Font: Inter, sans-serif
Style: Clean, minimal, professional

## 📁 Project Structure
skill-swap/
├── backend/                 # Backend API (separate)
├── client/                  # Frontend React app
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions and API config
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # App entry point
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── .gitignore
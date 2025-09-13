# Optical Shop Management System

## Overview
This is a React + TypeScript + Vite application for optical shop management. It provides separate dashboards for staff and shop administrators to manage inventory, patients, sales reports, and staff activities.

## Recent Changes (September 13, 2025)
- **Project Setup**: Successfully imported from GitHub and configured for Replit environment
- **Dependencies**: Installed all npm dependencies and verified build process
- **Configuration**: Updated Vite config to support Replit's proxy system with `allowedHosts: true`
- **Workflow**: Set up Frontend workflow running on port 5000 with proper host binding (0.0.0.0)
- **Deployment**: Configured autoscale deployment with build and preview commands

## Project Architecture

### Frontend Structure
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: TailwindCSS 4.1.13
- **State Management**: Redux Toolkit with React-Redux
- **Routing**: React Router 7.8.2
- **HTTP Client**: Axios for API communication
- **UI Components**: Radix UI components with custom styling

### Key Features
1. **Authentication System**: 
   - Staff login/dashboard
   - Shop admin login/dashboard
   - Protected routes with token-based authentication

2. **Shop Admin Dashboard**:
   - Overview metrics and growth charts
   - Inventory reports and low stock alerts
   - Patient management and visit history
   - Sales reports and product analytics
   - Staff management and activity tracking

3. **Backend Integration**:
   - Production API: `https://staff-optical-production.up.railway.app`
   - JWT token authentication
   - RESTful API endpoints for all dashboard features

### File Structure
```
src/
├── components/ui/          # Reusable UI components
├── lib/                    # Utility functions
├── Pages/                  # Main application pages
│   ├── ShopAdminDashboard/ # Admin dashboard components
│   │   ├── Reports/        # Various report components
│   │   └── Staff/          # Staff management components
│   └── [Login pages]       # Authentication pages
├── providers/              # React context providers
├── store/                  # Redux store and slices
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point
```

### Development Configuration
- **Port**: 5000 (required for Replit)
- **Host**: 0.0.0.0 (allows external connections)
- **Proxy Support**: Configured for Replit's iframe preview
- **HMR**: Hot module replacement enabled for development

### Deployment Settings
- **Target**: Autoscale (stateless frontend)
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Run**: `npm run preview` on dynamic port with host binding

## User Preferences
- Clean, professional interface for optical shop management
- Comprehensive reporting and analytics
- Secure authentication and authorization
- Real-time data updates and notifications

## Current Status
✅ **Fully Configured**: The application is ready for development and deployment in the Replit environment. All dependencies are installed, build process verified, and the development server is running successfully.

## Next Steps
- The application is ready for use with the existing backend API
- All dashboard features should work once users authenticate
- Reports and analytics will display real data from the production API
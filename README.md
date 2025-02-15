# Lectify Frontend

A modern web application for generating summaries from lecture recordings. This repository contains the frontend code for Lectify.

## 🎯 Features

- **Audio File Processing**: Upload and process lecture recordings (supports WAV, MP3)
- **Smart Summarization**: Generate concise summaries from audio content
- **Customizable Output**: Choose between different transcription qualities and summary types
- **Real-time Progress**: Track the processing status of your summaries
- **History Management**: View and manage all your generated summaries
- **Share Functionality**: Make summaries public and share them via links
- **Dark Mode Support**: Comfortable viewing in any lighting condition
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Browser Notifications**: Get notified when your summary is ready

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- [Lectify Backend](https://github.com/lukaswerner/lectify-backend) running
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lectify/lectify-frontend.git
cd lectify-frontend
```

2. Install dependencies:
```bash
cd lectify
npm install
```

3. Create a `.env` file in the `lectify` directory:
```env
VITE_API_ENDPOINT=http://localhost:5001
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Tech Stack

- **Framework**: SvelteKit
- **UI Components**: Skeleton UI
- **Styling**: Tailwind CSS
- **Deployment**: Kubernetes

## 🔐 Authentication

The application uses a standard email/password authentication system:
- Users can register with email and password
- Secure login with HTTP-only cookies
- Protected routes for authenticated users
- Persistent login through cookies
- Access control for private summaries

## 🌐 Infrastructure

### Development
- Local development using Vite
- Backend communication via REST API
- Real-time updates using polling
- Browser notifications for completed summaries

### Production
- Containerized using Docker
- Deployed on Kubernetes
- Scalable architecture

## 📝 Environment Variables

Required environment variables:
- `VITE_API_ENDPOINT`: URL of the backend API
  
## 🔄 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment to Azure Kubernetes Service (AKS).

### Pipeline Steps

1. **Test**
   - Runs on every push to `main` and `develop` branches
   - Installs dependencies
   - Builds the application
   - Runs Playwright E2E tests
   - Uploads test reports as artifacts

2. **Deploy**
   - Triggered after successful tests
   - Builds Docker image
   - Pushes to Azure Container Registry
   - Deploys to AKS
   - Environment specific deployments:
     - `main` branch → production namespace
     - `develop` branch → development namespace

## 🏗️ Project Structure

```text
lectify/
├── src/
│   ├── lib/                    # Reusable components
│   │   ├── Summary.svelte      # Summary card component with share/delete functionality
│   │   ├── SummarySkeleton.svelte  # Loading placeholder for summaries
│   ├── models/
│   │   └── Summary.ts         # TypeScript interfaces for summary data
│   ├── routes/
│   │   ├── account/          # Account management
│   │   │   ├── +page.server.ts  # Fetches Cookie
│   │   │   ├── +page.svelte    # Login/Register forms
│   │   │   └── +page.ts        # Load user information
│   │   ├── history/         # Summary history
│   │   │   ├── +layout.svelte  # Layout for History Page
│   │   │   ├── +page.server.ts # Fetches Cookie
│   │   │   ├── +page.svelte    # Displays summary grid
│   │   │   └── +page.ts        # Loads summary data
│   │   ├── summary/[id]/    # Individual summary view
│   │   │   ├── +layout.svelte  # Summary layout
│   │   │   ├── +page.server.ts # Fetches Cookie
│   │   │   ├── +page.svelte    # Display summary details
│   │   │   └── +page.ts        # Loads specific summary data
│   │   ├── +layout.svelte   # Root layout with Navbar
│   │   ├── +page.server.ts  # Fetches Cookie
│   │   └── +page.svelte     # Landing page to convert Lecture
│   └── app.html             # HTML template
```

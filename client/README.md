# TinyLink Frontend

React application for the TinyLink URL shortener.

## Setup

```bash

# Install dependencies

npm install

# Start development server

npm run dev

# Build for production

npm run build

# Preview production build

npm run preview
```

## Configuration

Update the API URL in `.env`:

```env
# Development
API_URL=http://localhost:3000
# Production
# API_URL =https://your-api.com 
```

## Features

- URL shortening with optional custom codes
- Real-time link management dashboard
- Click analytics and statistics
- Responsive design
- Copy to clipboard
- Delete confirmation dialogs

## Tech Stack

- React 19
- Vite 7
- CSS3 with modern gradients
- Fetch API for HTTP requests

## Available Scripts

- `npm run dev` - Start development server on <http://localhost:5173>
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

Modern browsers with ES6+ support:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

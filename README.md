# PeerLink Frontend

A modern React-based web application for peer-to-peer file sharing with an intuitive user interface.

## Overview

PeerLink Frontend provides a clean, user-friendly interface for sharing files between peers. Users can easily upload files, generate invite codes, and download shared files from other peers.

## Prerequisites

- **Node.js 14.x** or higher
- **npm 6.x** or higher (or yarn)
- **Git**
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Getting Started

### 1. Clone the Repository

```bash
git clone <frontend-repo-url>
cd peerlink-frontend
```

### 2. Install Dependencies

```bash
npm install
```

Or if using yarn:
```bash
yarn install
```

### 3. Configure Environment

Create a `.env.local` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

**Available environment variables:**
- `REACT_APP_API_URL` - Backend API endpoint (default: http://localhost:8080/api)
- `REACT_APP_ENVIRONMENT` - Environment mode (development/production)

### 4. Start Development Server

```bash
npm start
```

The application will open automatically at `http://localhost:3000`.

## Available Scripts

### Development

```bash
npm start
```
Runs the app in development mode with hot-reload enabled.

### Production Build

```bash
npm run build
```
Creates an optimized production build in the `build/` directory.

### Run Tests

```bash
npm test
```
Launches the test runner in interactive watch mode.

### Code Quality

```bash
npm run eject
```
**Note**: This is a one-way operation. Once you eject, you can't go back!

## Project Structure

```
peerlink-frontend/
├── public/
│   └── index.html                 # Main HTML file
├── src/
│   ├── components/
│   │   ├── UploadComponent.js      # File upload interface
│   │   ├── UploadComponent.css     # Upload styling
│   │   ├── DownloadComponent.js    # File download interface
│   │   ├── DownloadComponent.css   # Download styling
│   │   ├── InviteCodeComponent.js  # Invite code generator
│   │   └── InviteCodeComponent.css # Invite code styling
│   ├── App.js                      # Main app component
│   ├── App.css                     # App styling
│   ├── index.js                    # Application entry point
│   └── index.css                   # Global styling
├── package.json                    # Project dependencies
├── package-lock.json               # Locked versions
├── .env.local                      # Environment configuration
├── .gitignore                      # Git ignore rules
├── Dockerfile                      # Docker configuration
└── README.md                       # This file
```

## Features

### Upload Component
- Drag-and-drop file upload
- Single file or batch upload
- Progress tracking
- Upload status indicators
- File validation

### Download Component
- Browse available files
- Download files from peers
- Verify peer access with invite codes
- File metadata display

### Invite Code Component
- Generate shareable invite codes
- Copy to clipboard functionality
- Expiration time settings
- Revoke access codes

## Component Details

### UploadComponent
Handles file selection and upload to the backend.

```javascript
import UploadComponent from './components/UploadComponent';

<UploadComponent onUploadSuccess={handleSuccess} />
```

### DownloadComponent
Displays available files for download.

```javascript
import DownloadComponent from './components/DownloadComponent';

<DownloadComponent peerId={peerId} />
```

### InviteCodeComponent
Manages invite code generation and sharing.

```javascript
import InviteCodeComponent from './components/InviteCodeComponent';

<InviteCodeComponent fileId={fileId} />
```

## API Integration

The frontend communicates with the backend API defined by `REACT_APP_API_URL`.

### Key API Calls

```javascript
// Upload file
POST /api/upload
FormData with file

// Download file
GET /api/download/{fileId}
Params: inviteCode (optional)

// Generate invite code
POST /api/peers/invite
Body: { fileId, expiresIn }

// Get file list
GET /api/files
```

## Styling

### CSS Modules
Each component has its own CSS file for scoped styling.

### Global Styles
Edit `index.css` for global theme and reset styles.

### Customization
```css
/* Override in App.css or component CSS */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --error-color: #dc3545;
}
```

## Development Workflow

### Local Development with Backend

1. Start backend (default port 8080):
```bash
cd ../peerlink-backend
mvn spring-boot:run
```

2. Start frontend (default port 3000):
```bash
npm start
```

3. Backend API calls will be routed to `http://localhost:8080/api`

### Using Docker Compose

From the root directory:
```bash
docker-compose up
```

This starts both frontend and backend services.

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

### Serve Locally

```bash
npm install -g serve
serve -s build
```

### Docker Build

```bash
docker build -t peerlink-frontend:latest .
docker run -p 80:80 peerlink-frontend:latest
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
PORT=3001 npm start
```

### API Connection Issues

1. Check `REACT_APP_API_URL` in `.env.local`
2. Ensure backend is running
3. Check CORS configuration on backend
4. Open browser DevTools > Network tab for details

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Blank Page on Load

1. Check browser console for errors
2. Verify `public/index.html` exists
3. Check that `src/index.js` is correct
4. Clear browser cache

## Performance Optimization

### Code Splitting
React.lazy() is used for component lazy loading.

### Image Optimization
- Use appropriate image formats
- Optimize size before upload
- Consider WebP format

### Build Optimization
```bash
npm run build
# Analyze bundle size
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

## Security

- Sanitize user inputs
- Use HTTPS in production
- Validate file types on frontend and backend
- Implement rate limiting
- Secure API endpoints with authentication

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the GNU License - see LICENSE file for details.

## Related Projects

- **Backend**: [peerlink-backend](https://github.com/sgr9/peer2peer_backend)

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [sgr@duck.com]

---

**Version**: 1.0.0  
**React Version**: 18.x  
**Node Version**: 14.x or higher  
**Last Updated**: December 2025

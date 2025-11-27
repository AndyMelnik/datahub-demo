# Dashboard Embedding Guide

This guide explains how to embed the Navixy Fleet Management Dashboard into your landing page or website.

## Quick Start

### Option 1: Using iframe (Recommended)

The simplest way to embed the dashboard is using an iframe:

```html
<iframe 
  src="https://your-domain.com/embed.html" 
  width="100%" 
  height="800px"
  title="Fleet Management Dashboard"
  allow="fullscreen"
  style="border: none;"
></iframe>
```

### Option 2: Responsive iframe with Container

For a more responsive design:

```html
<div style="position: relative; width: 100%; min-height: 800px;">
  <iframe 
    id="fleet-dashboard"
    src="https://your-domain.com/embed.html" 
    style="width: 100%; height: 800px; border: none;"
    title="Fleet Management Dashboard"
    allow="fullscreen"
  ></iframe>
</div>
```

## Files for Embedding

This project provides two HTML entry points:

1. **`index.html`** - Standalone full-page dashboard
   - Use this for direct access to the dashboard
   - Includes full page styling and margins
   - Best for opening in a new tab or as the main page

2. **`embed.html`** - Optimized for iframe embedding
   - Stripped down version without extra margins
   - Includes postMessage communication
   - Automatically reports resize events
   - Best for embedding in other pages

## Advanced Features

### Communication Between Parent and iframe

The embedded dashboard supports postMessage API for two-way communication.

#### Receiving Messages from Dashboard

```javascript
window.addEventListener('message', function(event) {
  // Verify the message is from our dashboard
  if (event.data.source === 'navixy-dashboard') {
    
    // Dashboard ready event
    if (event.data.type === 'dashboard-ready') {
      console.log('Dashboard loaded successfully');
    }
    
    // Dashboard resize event (for responsive sizing)
    if (event.data.type === 'dashboard-resize') {
      console.log('Dashboard size:', event.data.width, event.data.height);
      // Optionally adjust iframe height
      // iframe.style.height = event.data.height + 'px';
    }
  }
});
```

#### Sending Messages to Dashboard

```javascript
const iframe = document.getElementById('fleet-dashboard');

iframe.addEventListener('load', function() {
  // Send configuration to dashboard
  iframe.contentWindow.postMessage({
    type: 'dashboard-config',
    theme: 'light',
    embedded: true,
    // Add any custom configuration here
  }, '*');
});
```

### Loading State

Add a loading indicator while the dashboard loads:

```html
<div id="dashboard-container" style="position: relative; min-height: 800px;">
  <div id="loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
    Loading Dashboard...
  </div>
  <iframe 
    id="fleet-dashboard"
    src="embed.html" 
    style="width: 100%; height: 800px; border: none;"
    onload="document.getElementById('loading').style.display='none'"
  ></iframe>
</div>
```

## Security Considerations

### Content Security Policy (CSP)

If you have CSP headers enabled on your landing page, you may need to add:

```
frame-src 'self' https://your-dashboard-domain.com;
```

### X-Frame-Options

The dashboard is configured to allow embedding. The server sets:

```
X-Frame-Options: SAMEORIGIN
```

For cross-origin embedding, you'll need to configure this header appropriately.

### Sandbox Attributes

For additional security, you can use iframe sandbox attributes:

```html
<iframe 
  src="embed.html"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
></iframe>
```

## Responsive Design

### Mobile Optimization

For mobile devices, consider adjusting the iframe height:

```css
@media (max-width: 768px) {
  #fleet-dashboard {
    height: 600px;
  }
}

@media (max-width: 480px) {
  #fleet-dashboard {
    height: 500px;
  }
}
```

### Full-Screen Mode

Allow users to expand the dashboard to full screen:

```html
<button onclick="document.getElementById('fleet-dashboard').requestFullscreen()">
  Full Screen
</button>
```

## Building for Production

### 1. Build the project

```bash
npm run build
```

This creates a `dist/` folder with all compiled assets.

### 2. Deploy the dist folder

Upload the contents of `dist/` to your web server.

### 3. Configure your web server

Ensure your server allows iframe embedding and sets appropriate CORS headers:

**Nginx example:**

```nginx
location / {
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Content-Security-Policy "frame-ancestors 'self' https://your-landing-page.com" always;
}
```

**Apache example:**

```apache
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Content-Security-Policy "frame-ancestors 'self' https://your-landing-page.com"
```

## Example Landing Page Integration

See `landing.html` for a complete example of how to integrate the dashboard into a landing page with:

- Hero section
- Feature descriptions
- Embedded dashboard with loading state
- Call-to-action sections
- Responsive design
- Parent-iframe communication

## Troubleshooting

### Dashboard doesn't load

1. Check browser console for errors
2. Verify the iframe `src` URL is correct
3. Check for CSP or X-Frame-Options blocking
4. Ensure CORS is properly configured

### Dashboard appears cut off

1. Increase iframe height
2. Use the resize event messages to adjust dynamically
3. Ensure parent container has sufficient height

### Scrolling issues

- Set `overflow: auto` on the iframe
- Ensure parent container doesn't restrict height
- Test on mobile devices for touch scrolling

### Cross-origin issues

- Ensure both parent and iframe are served over HTTPS
- Configure CORS headers on the dashboard server
- Use proper postMessage origin validation

## Need Help?

For additional support or custom integration requirements, please contact:
- Email: support@navixy.com
- Documentation: https://www.navixy.com/docs

## License

This dashboard demo is provided as-is for demonstration purposes.



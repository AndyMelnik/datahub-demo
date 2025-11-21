# 🚀 Quick Start: Embedding the Dashboard

This is a quick reference for embedding the Fleet Management Dashboard into your website.

## ⚡ 3-Step Quick Embed

### Step 1: Build the Dashboard

```bash
npm run build
```

### Step 2: Deploy the `dist` folder

Upload the contents of the `dist` folder to your web server or hosting platform.

### Step 3: Embed in Your Page

```html
<iframe 
  src="https://your-domain.com/embed.html" 
  width="100%" 
  height="800px"
  title="Fleet Dashboard"
  style="border: none;">
</iframe>
```

That's it! 🎉

---

## 📋 Common Use Cases

### Use Case 1: Landing Page Hero Section

```html
<section class="demo-section">
  <h2>See Our Dashboard in Action</h2>
  <div style="max-width: 1200px; margin: 0 auto;">
    <iframe 
      src="https://your-domain.com/embed.html" 
      width="100%" 
      height="800px"
      style="border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    </iframe>
  </div>
</section>
```

### Use Case 2: Modal/Popup Demo

```html
<button onclick="showDashboard()">View Dashboard Demo</button>

<div id="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999;">
  <div style="width: 90%; height: 90%; margin: 5%; background: white; border-radius: 8px; overflow: hidden;">
    <button onclick="hideDashboard()" style="position: absolute; top: 20px; right: 20px; z-index: 10000;">✕ Close</button>
    <iframe src="https://your-domain.com/embed.html" width="100%" height="100%" style="border: none;"></iframe>
  </div>
</div>

<script>
  function showDashboard() {
    document.getElementById('modal').style.display = 'block';
  }
  function hideDashboard() {
    document.getElementById('modal').style.display = 'none';
  }
</script>
```

### Use Case 3: WordPress/CMS Integration

```html
<!-- Add this to your WordPress page/post in HTML mode -->
<div class="dashboard-embed" style="width: 100%; margin: 20px 0;">
  <iframe 
    src="https://your-domain.com/embed.html" 
    width="100%" 
    height="800px"
    loading="lazy"
    style="border: none;">
  </iframe>
</div>
```

---

## 🔧 Customization Cheatsheet

### Adjust Height
```html
<iframe src="embed.html" height="600px"></iframe>  <!-- Smaller -->
<iframe src="embed.html" height="1000px"></iframe> <!-- Larger -->
```

### Make it Responsive
```html
<div style="position: relative; width: 100%; padding-bottom: 75%;">
  <iframe 
    src="embed.html" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
  </iframe>
</div>
```

### Add Loading Spinner
```html
<div id="container" style="position: relative; min-height: 800px;">
  <div id="loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
    ⏳ Loading...
  </div>
  <iframe 
    src="embed.html" 
    width="100%" 
    height="800px"
    onload="document.getElementById('loading').remove()"
    style="border: none;">
  </iframe>
</div>
```

### Style the Container
```html
<div style="
  max-width: 1400px; 
  margin: 0 auto; 
  padding: 20px; 
  background: white; 
  border-radius: 12px; 
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);">
  
  <iframe src="embed.html" width="100%" height="800px" style="border: none; border-radius: 8px;"></iframe>
</div>
```

---

## 🌐 Deployment Quick Links

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Vercel
```bash
npm run build
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Copy dist/* to your GitHub Pages repository
```

### Traditional Hosting (FTP/cPanel)
```bash
npm run build
# Upload contents of dist/ folder to your public_html directory
```

---

## ⚠️ Important Notes

1. **Always use HTTPS** in production
2. **Test on mobile devices** - adjust height for smaller screens
3. **Check browser console** for any errors during embedding
4. **CSP headers** - If you have Content Security Policy, allow iframe from your domain
5. **Loading time** - Dashboard may take 2-3 seconds to load initially

---

## 📱 Mobile Responsive Example

```html
<style>
  .dashboard-iframe {
    width: 100%;
    height: 800px;
    border: none;
  }
  
  @media (max-width: 768px) {
    .dashboard-iframe {
      height: 600px;
    }
  }
  
  @media (max-width: 480px) {
    .dashboard-iframe {
      height: 500px;
    }
  }
</style>

<iframe src="embed.html" class="dashboard-iframe"></iframe>
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Dashboard doesn't load | Check the iframe `src` URL is correct |
| Blank screen | Open browser console (F12) to see errors |
| Too small/cut off | Increase iframe `height` attribute |
| Scrolling issues | Ensure parent container doesn't have `overflow: hidden` |
| CORS errors | Configure server headers (see EMBEDDING.md) |

---

## 📚 Need More Details?

- **Full Documentation**: See [EMBEDDING.md](./EMBEDDING.md)
- **Live Examples**: Open `integration-examples.html` in your browser
- **Landing Page Demo**: Open `landing.html` in your browser

---

## ✅ Checklist Before Going Live

- [ ] Built the project with `npm run build`
- [ ] Tested the dashboard locally with `npm run preview`
- [ ] Uploaded dist folder to hosting
- [ ] Verified HTTPS is working
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices
- [ ] Checked browser console for errors
- [ ] Configured CSP headers if needed
- [ ] Added fallback link if iframe fails

---

**Ready to embed?** Start with the simple 3-step process at the top! 🚀


# BINARY - Official Website

> "The truth isn't binary."

## 🚀 About

BINARY is a revolutionary cryptocurrency project on Solana that challenges digital certainty and questions the binary nature of truth in our coded world.

## 📁 Project Structure

```
Binary-2/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles and animations
├── js/
│   └── script.js       # JavaScript for interactions and animations
├── fonts-kopia/        # Custom Amiga4everPro font files
└── images/             # Logo and art gallery images
```

## ✨ Features

- **Responsive Design** - Works perfectly on all devices (desktop, tablet, mobile)
- **Smooth Animations** - Scroll-triggered animations using custom AOS implementation
- **Performance Optimized** - Lazy loading images, debounced events, optimized rendering
- **Clean Code** - Well-structured, commented, and maintainable
- **Cross-browser Compatible** - Works on all modern browsers
- **SEO Friendly** - Proper meta tags and semantic HTML

## 🎨 Sections

1. **Hero** - Full-screen logo with parallax effect
2. **See The Truth** - Mission statement in a clean white box
3. **How To Join** - 3-step guide to buying BINARY token
4. **Roadmap** - 3-phase development plan with progress indicators
5. **Art Gallery** - Showcasing 9 unique BINARY artworks

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, animations
- **Vanilla JavaScript** - No dependencies, pure JS for best performance
- **Custom Font** - Amiga4everPro for authentic retro feel

## 🚀 How to Run

1. Simply open `index.html` in any modern web browser
2. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```
3. Navigate to `http://localhost:8000`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance Features

- **Lazy Loading** - Images load only when visible
- **Debounced Events** - Optimized scroll and resize handlers
- **RequestAnimationFrame** - Smooth 60fps animations
- **CSS Hardware Acceleration** - GPU-accelerated transforms
- **Reduced Motion Support** - Respects user accessibility preferences

## 📝 Notes

- All fonts are included in the `fonts-kopia` folder
- Images are optimized but can be further compressed if needed
- Contract address will be updated from "soon" when available
- All animations respect `prefers-reduced-motion` for accessibility

## 🔧 Customization

### Changing Colors
Edit `css/styles.css` - main colors are:
- Background: `#000000` (black)
- Foreground: `#ffffff` (white)
- Accents: `#FFD700` (gold for active phase)

### Adding More Art
Simply add images to the `images/` folder and add HTML in the Art section:
```html
<div class="art-item" data-aos="zoom-in" data-aos-delay="550">
    <img src="images/Art-10.jpg" alt="Binary Art 10" loading="lazy">
</div>
```

### Updating Contract Address
Change the text in `index.html`:
```html
<p class="contract-address">YOUR_CONTRACT_ADDRESS_HERE</p>
```

## 📄 License

© 2025 BINARY. All rights reserved.

---

**Built with ❤️ for the BINARY community**

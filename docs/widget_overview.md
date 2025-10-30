# Quick Menu Widget - Overview & Context

## Widget Goals & Design Philosophy

### Primary Objective
Create a **subtle, lowkey widget** that prioritizes **viewer interest over self-promotion**. The widget should feel like a helpful tool rather than an advertisement.

### Target Audience Strategy

#### For Casual Visitors
- **Focus**: Fun, engaging content (reaction test game, leaderboard)
- **Goal**: Provide entertainment and value
- **Approach**: Make the game the star, not the developer

#### For Employers
- **Focus**: Subtle portfolio access without being pushy
- **Goal**: Professional credibility through understated presentation
- **Approach**: Portfolio link available but not flashy or obvious

### Design Principles
- **Minimal**: Clean, uncluttered interface
- **Neutral**: Subtle colors that blend with any website
- **Compact**: Efficient use of space
- **Functional**: Every element serves a purpose

## Technical Architecture

### Core Technologies
- **HTML/CSS/JavaScript**: Standalone, no dependencies
- **OpenAI GPT-3.5-turbo**: AI chat backend (via Netlify functions)
- **Reaction Test API**: Live leaderboard from `fast.jovylle.com`

### File Structure
```
public/widget/
├── mystery-widget.html    # Main widget (embeddable)
└── embed.js              # JavaScript embed script

netlify/functions/
└── chatbot.js            # AI chat backend

server/api/
└── leaderboard.js        # Leaderboard proxy (local dev)
```

### Security Model
- **iframe embedding**: Complete sandboxing for security
- **JavaScript embedding**: Convenience option for trusted sites
- **CORS handling**: Proper cross-origin request management

## Features

### Current Features
1. **Reaction Test Leaderboard**: Top 3 players with real-time data
2. **AI Chat**: Portfolio-focused assistant using GPT-3.5-turbo
3. **Quick Links**: Portfolio access for employers
4. **Responsive Design**: Works on all devices
5. **Tab Navigation**: Links and AI Chat tabs

### Current Features (Updated)
1. **Configurable Positioning**: 4 corner positions
2. **Size Options**: Small, medium, large
3. **Theme Toggle**: Light/dark mode
4. **Analytics**: Event tracking for insights
5. **Content Configuration**: Hide/show specific elements (chat, portfolio, sections)
6. **Smart Embedding**: Different configurations for different use cases

## Embedding Methods

### Method 1: iframe (Recommended - Most Secure)
```html
<iframe 
    src="https://jovylle.com/widget/mystery-widget.html?position=bottom-right&size=medium" 
    width="320" height="500" frameborder="0"
    style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
</iframe>
```

### Method 2: JavaScript (Convenience Option - iframe)
```html
<script 
    src="https://jovylle.com/widget/embed.js" 
    data-position="top-left" 
    data-size="large">
</script>
```

### Method 3: JavaScript Inline (No iframe, Shadow DOM)
```html
<script 
  src="https://jovylle.com/widget/embed-inline.js"
  data-position="top-right"
  data-size="medium"
  data-density="comfortable"
  data-theme="light"
  data-hide-chat="false"
  data-open="false"
  async
></script>
```

Inline API (optional):
```html
<script>
  // After script loads
  // window.JovylleInlineWidget.open()
  // window.JovylleInlineWidget.close()
  // window.JovylleInlineWidget.toggle()
  // window.JovylleInlineWidget.switchTab('links'|'chat')
  // window.JovylleInlineWidget.setTheme('light'|'dark')
  // window.JovylleInlineWidget.state // read-only snapshot
<\/script>
```

Density options:
- comfortable: 8/12 px paddings, relaxed spacing (default)
- compact: smaller paddings for tight layouts

## Configuration Options

### Position Parameters
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

### Size Parameters
- `small`: 280px width, 350px max-height
- `medium`: 320px width, 400px max-height (default)
- `large`: 360px width, 500px max-height

### Theme Options
- `light`: Current neutral theme (default)
- `dark`: Dark backgrounds with light text

### Content Configuration
- `hideChat`: true/false - Hide AI Chat tab entirely
- `hidePortfolio`: true/false - Hide portfolio link from Quick Links
- `showOnly`: comma-separated - Only show specified sections (leaderboard,links,chat)

## Development Context

### Why This Approach?
1. **Trust Building**: Subtle presentation builds credibility
2. **User Experience**: Fun content keeps visitors engaged
3. **Professional Image**: Understated approach appeals to employers
4. **Security First**: iframe embedding protects both parties

### Success Metrics
- Widget engagement (opens, tab switches)
- Game play button clicks
- Portfolio link clicks (employer interest)
- AI chat interactions

## Future Considerations

### Potential Enhancements
- Custom branding options
- Additional game integrations
- Social sharing features
- Advanced analytics dashboard

### Maintenance Notes
- Keep the widget lightweight and fast
- Maintain security-first approach
- Regular updates to game integration
- Monitor AI chat quality and costs

---

*This document preserves the context and goals of the Quick Menu Widget for future development sessions.*

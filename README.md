

# Jovylle.com - Personal Portfolio & Widget Library

For the project overview, UI rules, and architecture, see `docs/project_overview.md`.

A modern personal portfolio website built with Nuxt.js, featuring a floating widget that can be embedded on any website.

## 🚀 Quick Menu Widget

The **Quick Menu Widget** is a floating, embeddable component that provides:
- 🎮 **Reaction Test Game** leaderboard and direct play access
- 🤖 **AI Chat** about the developer's portfolio (when deployed on Netlify)
- 🔗 **Quick Links** to portfolio and projects
- 📱 **Responsive design** that works on any website

### 📦 Embedding the Widget

#### Method 1: iframe Embed (Recommended - Most Secure)
```html
<iframe 
    src="https://jovylle.com/widget/mystery-widget.html?position=bottom-right&size=medium" 
    width="320" 
    height="500" 
    frameborder="0"
    style="position: fixed; bottom: 20px; right: 20px; z-index: 10000; border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);">
</iframe>
```

#### Method 2: JavaScript Embed (Convenience Option)
```html
<script 
    src="https://jovylle.com/widget/embed.js" 
    data-position="top-left" 
    data-size="large">
</script>
```

### 🎛️ Customization Options

#### Position Configuration
Control where the widget appears on the page:
- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

#### Size Configuration
Choose the widget size:
- `small`: 280px width, 350px max-height
- `medium`: 320px width, 400px max-height (default)
- `large`: 360px width, 500px max-height

#### Theme Options
The widget includes a built-in theme toggle:
- **Light theme**: Clean, neutral colors (default)
- **Dark theme**: Dark backgrounds with light text
- Theme preference is saved in localStorage

#### Content Configuration
Control which elements to show/hide:
- **`hideChat`**: true/false - Hide the AI Chat tab entirely
- **`hidePortfolio`**: true/false - Hide the portfolio link from Quick Links
- **`showOnly`**: comma-separated list - Only show specified sections (leaderboard,links,chat)

#### Example Configurations

**Game-only widget (for your own site):**
```html
<iframe src="https://jovylle.com/widget/mystery-widget.html?position=bottom-left&size=small&hideChat=true&hidePortfolio=true"></iframe>
```

**Professional widget (portfolio focus):**
```html
<iframe src="https://jovylle.com/widget/mystery-widget.html?position=top-right&size=medium&hideChat=true"></iframe>
```

**Full widget (external sites):**
```html
<iframe src="https://jovylle.com/widget/mystery-widget.html?position=bottom-right&size=large"></iframe>
```

**JavaScript embed with custom config:**
```html
<script 
    src="https://jovylle.com/widget/embed.js" 
    data-position="bottom-left" 
    data-size="small"
    data-hide-chat="true"
    data-hide-portfolio="true">
</script>
```

### ⚡ Features & Compatibility

| Feature | Local Development | Netlify Deployment | External Websites |
|---------|------------------|-------------------|-------------------|
| **Leaderboard** | ✅ (via `/api/leaderboard`) | ✅ (via `/api/leaderboard`) | ✅ (direct API call) |
| **AI Chat** | ✅ (via `/api/chatbot`) | ✅ (via `/.netlify/functions/chatbot`) | ⚠️ (CORS dependent) |
| **Quick Links** | ✅ | ✅ | ✅ |
| **Game Play Button** | ✅ | ✅ | ✅ |

### 🔧 Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/jovylle.com.git
   cd jovylle.com
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the widget locally**:
   ```
   http://localhost:3000/widget/mystery-widget.html
   ```

### 🌐 Deployment

#### Netlify Deployment
1. **Connect your repository** to Netlify
2. **Set environment variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key for the AI chat
3. **Deploy**: Netlify will automatically build and deploy

#### Environment Variables
Create a `.env` file (copy from `.env.example`):
```env
OPENAI_API_KEY="your_openai_api_key_here"
```

### 🧑‍💻 Contributing

We welcome contributions!

1. **Fork** this repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### 📦 Project Structure

```
jovylle.com/
├── public/widget/           # Widget files
│   ├── mystery-widget.html  # Main widget (embeddable)
│   └── embed.js            # Embed script
├── netlify/functions/      # Serverless functions
│   └── chatbot.js         # AI chat backend
├── server/api/            # Nuxt API routes
│   └── leaderboard.js     # Leaderboard proxy
└── components/            # Vue components
```

### 🎮 Game Integration

The widget integrates with the **Reaction Test Game** hosted at `fast.jovylle.com`:
- **Leaderboard API**: `https://fast.jovylle.com/reaction/top.json`
- **Game URL**: `https://fast.jovylle.com`
- **Features**: Real-time top 3 players, direct play access

### 🤖 AI Chat Backend

The AI chat uses OpenAI GPT-5.6 Luna (`gpt-5.6-luna` at $0.20/$1.20 per 1M tokens) and provides information about:
- Developer skills and technologies
- Project portfolio
- General development questions

**Local Development**: Uses Nuxt API route `/api/chatbot`  
**Production**: Uses Cloudflare Pages Function `/api/chatbot` (override model via `OPENAI_MODEL` env)

### 📱 Responsive Design

The widget is fully responsive and works on:
- 🖥️ Desktop browsers
- 📱 Mobile devices
- 📟 Tablets
- 🖼️ Embedded in iframes

### 🔒 Security & Privacy

- ✅ No tracking or analytics in the widget
- ✅ API keys stored securely in environment variables
- ✅ CORS properly configured for cross-origin requests
- ✅ No personal data collection
- ✅ iframe embedding provides complete sandboxing

### 📚 Documentation

For detailed information about the widget's goals, design philosophy, and technical architecture, see:
- **[Widget Overview](docs/widget_overview.md)** - Complete context and goals documentation

---

## 📦 Zipping the Project (Excludes `node_modules`)

To create a zip of key folders and top-level files (excluding `node_modules`), run this PowerShell command:

```powershell
$ts = Get-Date -Format "MM-dd-yyyy-HHmm"
$dest = "project-$ts.zip"

$dirs = Get-ChildItem -Directory | Where-Object { $_.Name -in 'components','content','layouts','pages','public','server' }
$files = Get-ChildItem -File
$allPaths = $dirs.FullName + $files.FullName

Compress-Archive -Path $allPaths -DestinationPath $dest -Force
```

This will generate a file like `project-05272025.zip` containing:

* `components/`, `content/`, `layouts/`, `pages/`, `public/`, `server/`
* All top-level files
* ✅ Excludes `node_modules` and other unneeded folders

```
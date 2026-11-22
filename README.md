

# Jovylle.com - Personal Portfolio & Widget Library

For the project overview, UI rules, and architecture, see `docs/project_overview.md`.

A modern personal portfolio website built with Nuxt.js, featuring a floating widget that can be embedded on any website.

## 🚀 Quick Menu Widget

The **Quick Menu Widget** is a floating, embeddable component that provides:
- 🎮 **Reaction Test Game** leaderboard and direct play access
- 🤖 **AI Chat** about the developer's portfolio (via `/api/chatbot`)
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

> **Note:** `public/widget/mystery-widget.html` does not read URL query parameters (no `location` or `URLSearchParams` use in the file). The `?position=`, `?size=`, `hideChat`, `hidePortfolio`, and `showOnly` options below are passed by `public/widget/embed.js` but are not applied by that page. The site itself uses `public/widget/embed-inline.js`, whose data-attribute API is documented at the top of that file. Verify any option before relying on it.

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
- The widget saves its theme preference in localStorage (`jovylle-widget-theme`). The site's own dark mode is not saved.

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

| Feature | Local Development | Production (Cloudflare Pages) | External Websites |
|---------|------------------|-------------------|-------------------|
| **Leaderboard** | ✅ (direct call to `fast.jovylle.com`) | ✅ (direct call to `fast.jovylle.com`) | ✅ (direct API call) |
| **AI Chat** | ✅ (via `/api/chatbot`) | ✅ (via `/api/chatbot`) | ⚠️ Blocked unless the site's origin is in `CHATBOT_ALLOWED_ORIGINS` |
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

#### Cloudflare Pages Deployment
1. **Build**: `npm run build`
2. **Set secrets**: `OPENAI_API_KEY` as a Cloudflare Pages secret for the AI chat
3. **Deploy**: `npm run deploy` (`wrangler pages deploy dist --project-name=jovylle-com`)

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
├── app.vue, nuxt.config.ts            # App shell; Nuxt/Nitro config (cloudflare-pages preset)
├── pages/                             # File-based routes; [...slug].vue renders content/ markdown
├── layouts/default.vue                # Global layout: header, nav, footer, widget loader
├── components/                        # Vue components (Chatbot.vue is unused)
├── plugins/widget-embed.client.ts     # Client-only plugin that loads the site widget
├── content/                           # Markdown content: post/, projects/, other/
├── public/widget/                     # Widget files
│   ├── embed-inline.js                # Shadow-DOM widget used by the site (data-* API at top of file)
│   ├── mystery-widget.html            # Standalone page for iframe embeds
│   └── embed.js                       # Loader that builds the iframe URL
├── server/api/                        # Server routes (dev + Cloudflare Pages prod)
│   ├── chatbot.js                     # AI chat backend (open endpoint; see file header)
│   └── usage-metrics.js               # Proxies content.jovylle.com usage metrics (GET)
└── docs/                              # Project notes (AGENTS.md is the agent entry point)
```

### 🎮 Game Integration

The widget integrates with the **Reaction Test Game** hosted at `fast.jovylle.com`:
- **Leaderboard API**: `https://fast.jovylle.com/api/scores?game=reaction&limit=3` (called by `public/widget/embed-inline.js`)
- **Game URL**: `https://fast.jovylle.com`
- **Features**: Real-time top 3 players, direct play access

### 🤖 AI Chat Backend

The AI chat uses OpenAI GPT-5.6 Luna (`gpt-5.6-luna` at $0.20/$1.20 per 1M tokens) and provides information about:
- Developer skills and technologies
- Project portfolio
- General development questions

**Local Development**: Uses Nuxt API route `/api/chatbot`  
**Production**: Uses Cloudflare Pages Function `/api/chatbot` (override model via `OPENAI_MODEL` env)

**Chat env vars**:
- `CHATBOT_ALLOWED_ORIGINS` (optional): comma-separated browser origins allowed to call `/api/chatbot`. Unset, it defaults to `https://jovylle.com`, `https://www.jovylle.com`, `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3999`, `http://127.0.0.1:3000`, and `http://127.0.0.1:3999`. Setting it replaces the default list, so include jovylle.com yourself. Other origins get 403. Third-party embeds stop working unless their origin is listed.
- Limits: request body 32 KB (413), message 2000 characters (400), and a best-effort rate limit of 20 requests per 10 minutes per IP (429). The rate limit is per isolate on Cloudflare, so use Cloudflare rate limiting rules for a hard limit. Requests with no client IP share one bucket of 200 per 10 minutes.
- Caller `context` is capped at 4000 characters (extra text is cut). It is sent as a delimited user message, not in the system prompt. The `<<<CONTEXT` and `CONTEXT>>>` markers are removed from it first.

### 📱 Responsive Design

The widget is fully responsive and works on:
- 🖥️ Desktop browsers
- 📱 Mobile devices
- 📟 Tablets
- 🖼️ Embedded in iframes

### 🔒 Security & Privacy

- ✅ No tracking or analytics in the widget
- ✅ API keys stored securely in environment variables
- ⚠️ `/api/chatbot` has no auth. Browser requests must come from an origin in `CHATBOT_ALLOWED_ORIGINS`, but requests with no Origin header (curl, server-to-server) are also allowed. Since a non-browser caller can skip the origin check, the per-IP rate limit is the only spend control for them. Size limits apply too, and caller `context` is not placed in the system prompt. See the header of `server/api/chatbot.js`.
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
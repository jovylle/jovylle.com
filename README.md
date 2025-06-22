

### 📄 README Section (Add to your README.md)

````markdown
## 🧑‍💻 Contributing

We welcome contributions!

To contribute:

1. **Fork** this repository to your GitHub account.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/jovylle.com.git
   cd jovylle.com
````

3. **Install dependencies**:

   ```bash
   npm install
   ```
4. **Start the development server**:

   ```bash
   npm run dev
   ```

Once you've made your changes:

1. **Commit and push** them to your fork.
2. **Open a Pull Request (PR)** to the main repository on GitHub.
3. We'll review and merge your PR once approved!

---

## 📦 Zipping the Project (Excludes `node_modules`)

To create a zip of key folders and top-level files (excluding `node_modules`), run this PowerShell command:

```powershell
$ts = Get-Date -Format "MMddyyyy"
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
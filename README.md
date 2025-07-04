# Vinotheque 🍷

A simple wine journal built with plain JavaScript, Netlify Functions (serverless backend), and Supabase as the database.

## 🚀 Features

- 📊 Log and rate wines
- 🔐 All Supabase requests handled server-side via Netlify Functions
- 🔑 Secure environment variables for your keys
- 🌎 Deploys instantly on Netlify

## 📂 Project Structure

```
vinotheque/
│
├── index.html
├── js/            # Your frontend JS
├── css/           # Your styles
├── functions/     # Netlify Functions (serverless backend)
│   ├── get-wines.js
│   ├── save-wine.js
│   └── delete-wine.js
├── netlify.toml
├── .env           # Local environment variables (not committed)
├── .gitignore
└── package.json
```

## ⚙️ Prerequisites

- Node.js
- Netlify CLI

> **Tip:** Use your Service Role Key for server functions if you want full access for inserts/deletes. Never expose the Service Role Key in your frontend JS.

## 🧪 Run locally

Start the Netlify dev server:

```bash
netlify dev
```

Visit [http://localhost:8888](http://localhost:8888)

Your functions run at `/.netlify/functions/*`

## 🌐 Deploy to Netlify

1. Push your code to a Git repo (GitHub, GitLab, etc.)
2. Connect your site on Netlify → New Site from Git
3. Add your environment variables in Netlify UI:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_KEY = your_key_here
```

4. Deploy!

## 🔑 Environment variables

| Key          | Purpose                       |
| ------------ | ----------------------------- |
| SUPABASE_URL | Your Supabase project URL     |
| SUPABASE_KEY | Your anon or service role key |

## 🗂️ Important Files

- `functions/` → Your serverless backend functions.
- `.env` → Local dev keys (never commit this!).
- `netlify.toml` → Configures build & functions path.

## 🤝 Contributing

PRs welcome! Open an issue if you find a bug or want to improve the wine experience 🍷✨

## 📝 License

ISC

## 💡 Tips

- ✅ Use `console.log(process.env.SUPABASE_URL)` inside your functions to debug env vars.
- ✅ Use the Service Role Key only server-side — never expose it to the frontend.
- ✅ Add a `favicon.ico` if you see 404s for missing icons.

Cheers! 🥂

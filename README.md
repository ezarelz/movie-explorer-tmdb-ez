# 🎬 Movie Library Project

This repository contains the full source code of the **Movie Library App**, built using Next.js, TypeScript, and Tailwind CSS.

## 🌟 Overview

Movie Library allows users to explore trending, top-rated, and newly released movies powered by the TMDB API.  
You can also favorite movies, view trailers, and manage your personal collection.

## 🧩 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- TMDB API

## 🛠️ Setup

```bash
npm install
npm run dev
```

## 🚀 Features

- Search movies by title
- Trending and popular sections
- Movie detail page with trailer link
- Add to Favorites
- Responsive layout with dark theme

## ⚙️ Installation

```bash
cd my-app
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## 🔑 Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_APP_BASEURL=https://api.themoviedb.org/3
NEXT_APP_BASEIMGURL=https://image.tmdb.org/t/p
NEXT_APP_APIKEY=your_api_key_here
NEXT_APP_TOKEN=your_token_here
```

## 📁 Folder Structure

```
src/
├──public
├──app/
│ ├── api/ # route handlers (server functions)
│ ├── favorites/ # favorites page
│ ├── movie/ # detail movie page
│ ├── search/ # search page
│ ├── styles/ # global styles
│ ├── layout.tsx # root layout
│ └── page.tsx # home page
├── components/ # reusable UI components
├── features/ # feature-level sections
└── lib/ # helper & config modules
├── .env (Make and Configure Your Own)
```

## 🧑‍💻 Author

Built with ❤️ by [Manggala Eleazar](https://github.com/ezarelz)

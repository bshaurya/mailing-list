# Shaurya's Mailing List Tool

This is my personal mailing list system. It looks like a terminal because that's cooler than regular forms (and fits in with my personal website https://shaurya.studio). Built it to collect emails for my projects and content in the future.

## What it does

People can subscribe to my mailing list through a terminal-style form. I get a dashboard to see who signed up and export their emails `/dashboard`. If someone tries to hack the dashboard with wrong passwords, they see fake data instead of my real subscribers.

## Getting it running to work for yourself

First, you need a Supabase account. Go make one at supabase.com if you don't have it.

1. Create a new Supabase project
2. Copy your project URL and API key
3. Go to the SQL Editor and paste everything from `setup.sql`
4. Replace the fake key value with whatever password you want
5. Copy `.env.example` to `.env` and fill in your details
6. Run `npm install` then `npm start`

That's it, deploy on vercel or another platform, and your mailing list is live!

## How to use it

- Main form: `localhost:3000` - this is where people subscribe
- Dashboard: `localhost:3000/dashboard` - this is where you manage everything

The dashboard shows you stats, lets you export CSV files, and has that same terminal-esk vibe.

---

*Built for personal use but feel free to fork it if you want your own terminal-style mailing list.*
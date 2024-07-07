# NTU-PS-Camp App 2024

Using Next.js + Typescript Stack for the first time!

Expected Functionalities:

- [x] Home (/)
  - [x] Summary:
    - [x] Bank dashboard
    - [x] Latest post
    - [x] Recent uploads
  - [ ] PWA Install Prompt
- [x] Bank (/bank)
  - [x] Balance
  - [x] Transfer
- [x] Upload files (/upload)
- [x] Posts/News (/news)
- [x] Voting? [repo](https://github.com/chingweih/ntups-camp-voting-vite)
- [x] Admin Dashboard
  - [x] User Table
    - [x] Create/Delete users
    - [x] Change/Reset passwords
    - [x] Verify staff account
    - [x] Bank
      - [x] Modify Balances (admin insert a new row with certain notes: e.g. "系統調整")
      - [x] List of transactions
  - [x] Upload
    - [x] Set files requirements
    - [x] See uploaded files & created time
  - [x] Send push notifications
- [ ] PWA
  - [x] Configuration
    - [x] Service Worker (Serwist)
    - [x] Manifest.json
  - [x] Push notifications (FCM)
    - [x] Send from admin panel
    - [ ] Connect to bank transfer

TODOs:

- [x] Deploy to **Vercel**
- [x] UI & Pages
  - [x] Shadcn/UI
- [x] Tidy build process (ignore eslint on build)
- [x] Set up database (**Supabase** Postgres)
- [x] Set up Auth (**Supabase** Auth)
- [x] Tidy things up
  - [x] Check supabase auth call (should all be server client)
  - [x] Tidy up file location (rule: in related path folder)
  - [x] Magic files: loading, not-found and /error
  - [x] Change supabase env to not be exposed
  - [x] Add 2nd layer of verification to db query calls (e.g. `user.email == from_email`, etc..)
- [x] Set up Storage (**Supabase** Storage)
- [x] Postgres RLS on supabase
- [x] Supabase CLI: Generate db types
  - [ ] Github Action automation
- [ ] Dev Tools (Maybe)
  - [ ] Sentry for error management
  - [ ] PostHog analytics

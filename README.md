# NTU-PS-Camp App (for EVERYTHING, hopefully)

Using Next.js + Typescript Stack for the first time!

Expected Functionalities:

- [x] Home (/)
  - [ ] Summary:
    - [ ] Itinerary
    - [ ] Bank dashboard
    - [ ] Latest post
    - [ ] Recent uploads
  - [ ] PWA Install Prompt
- [ ] Bank (/bank)
  - [x] Balance
  - [x] Transfer
  - [ ] Details?
- [ ] Upload files (/upload)
- [ ] Posts/News (/news)
- [ ] Voting?
  - [ ] Real-time DB?
- [ ] Auth
  - [ ] Sign-Up Function (for staff)
- [ ] Admin Dashboard
  - [ ] User Table
    - [ ] Create/Delete users
    - [ ] Change/Reset passwords
    - [ ] Verify staff account
    - [ ] Bank
      - [ ] Modify Balances (admin insert a new row with certain notes: e.g. "系統調整")
      - [ ] List of transactions
  - [ ] Upload
    - [ ] Set files requirements
    - [ ] See uploaded files & created time
- [ ] PWA
  - [ ] Configuration
    - [?] Service Worker (next-pwa, half working?)
    - [?] Manifest.json (working, but doesn't have a proper logo)
  - [ ] Push notifications (supabase + firebase)

TODOs:

- [x] Deploy to **Vercel**
- [x] UI & Pages
  - [x] Shadcn/UI
- [x] Tidy build process (ignore eslint on build)
- [x] Set up database (**Supabase** Postgres)
- [x] Set up Auth (**Supabase** Auth)
- [ ] Tidy things up
  - [ ] Check supabase auth call (should all be server client)
  - [ ] Tidy up file location (rule: in related path folder)
  - [ ] Magic files: loading, not-found and /error
  - [ ] Change supabase env to not be exposed
  - [ ] Add 2nd layer of verification to db query calls (e.g. `user.email == from_email`, etc..)
- [ ] Set up Storage (**Supabase** Storage)
- [ ] Postgres RLS on supabase
- [ ] Supabase CLI: Generate db types
  - [ ] Github Action automation

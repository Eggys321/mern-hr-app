# MERN stack HR APP

### Back-End Development Languages

- Nodejs(Express.js)

### Front-End Development Deliverables :

- Web Design

- Website Development

- Web Application

### Front-End Development Languages

- Javascript(ReactJs)

### Front-End Development Skills

- Git And GitHub

- React Bootstrap

- Figma design

## Project description :

This is a simple responsive mern stack Hr app which was used to teach my trainees how to build MERN stack app.

The project has an admin dashboard(for employees with admin role) and employee dashboard(for registered employees only).

Only the admin can register employees,approve leaves,create tasks,create teams,see all tasks,see all employees.

Employees only sign in,reset password,update profile,apply for leave.

## Setup

### Server

```
cd server
npm install
cp .env.example .env   # then fill in real values
npm run dev             # http://localhost:4040
npm test                 # runs the vitest suite
```

### Client

```
cd client
npm install
cp .env.example .env   # VITE_API_URL - defaults to the deployed server if unset
npm run dev             # http://localhost:5173
npm run build
```

See `server/.env.example` and `client/.env.example` for the full list of required environment variables.

### Demo account

The sign-in page comes pre-filled with a demo admin login so visitors can explore the app without registering:

```
email:    demoaccount2@gmail.cooom
password: 12345678
```

This is the same demo account already in the database from before - the seed script below is only needed if it ever gets deleted or its password stops matching. It's idempotent: it creates the account if missing, or just resets its password to the one above if it already exists.

```
cd server
npm run seed:demo
```

Since the credentials are public, treat this as a shared sandbox - anyone can create/edit/delete demo data through it. Re-run the seed script any time to reset its password; re-seed your demo data separately if it gets messy.

#### Tools Used

- Npm packages(Toastify)

- React-hook-form

- Bycrypt.js

## Hr App Website Preview :

Desktop design:
<img
  src="/client/src/assets/hr app.png"
  alt="Alt text"
  title="desktop-view"
  style="display: inline-block; margin: 0 auto; max-width: 300px">
sign-in design:
<img
  src="/client/src/assets/sign-in.png"
  alt="Alt text"
  title="mobile-view"
  style="display: inline-block; margin: 0 auto; max-width: 300px">

# Internship Portal - Dockerization Guide & Walkthrough

This document outlines everything we did to containerize the Internship Portal, the bugs we encountered along the way, and exactly how we resolved them to get everything running in production-ready Docker containers.

## 1. Initial Docker Setup

We started with an excellent foundation of Dockerfiles. Here is a breakdown of the structural choices:

- **Backend (`backend/Dockerfile`)**: 
  - Used `node:22-alpine` to keep the image incredibly lightweight.
  - Used `npm ci` instead of `install` for a cleaner, strictly version-locked installation sequence.
  - Strategically copied `package.json` first, allowing Docker to cache the node_modules layer and drastically speeding up rebuild times.
- **Frontend (`frontend/Dockerfile`)**: 
  - Implemented a **Multi-stage Build**. It first builds the React/Vite app using a Node container, and then copies only the compiled static `/dist` files into an Alpine NGINX server container. This is an industry-best practice for performance.
- **`.dockerignore` Files**:
  - Excluded `node_modules` and local build (`dist`) folders to prevent massive local files from copying into the container context and overriding containerized installations.
- **Orchestration (`docker-compose.yml`)**:
  - Bound Frontend to port `80` (accessible via `http://localhost`).
  - Bound Backend to port `8000` (accessible via `http://localhost:8000`).
  - Successfully routed the backend `.env` file via `env_file`.

---

## 2. Bugs Encountered & Fixes Applied

Although the Docker configurations were flawless, deploying them inside isolated Linux containers revealed a few subtle bugs in the Node.js source code.

### 🔴 Error 1: Backend Not Reachable
- **The Issue**: When running `docker compose up`, the backend wouldn't respond at `localhost:8000`. 
- **The Cause**: The `docker-compose.yml` was mapping Docker's internal port `8000` to your host computer. However, your `backend/.env` file was manually telling Express to listen on port `4000`! 
- **The Fix**: Updated `PORT=4000` to `PORT=8000` inside `backend/.env`.

### 🔴 Error 2: Race Condition at Startup
- **The Issue**: The server was starting even if MongoDB failed to connect.
- **The Cause**: Inside `backend/src/index.js`, the `app.listen()` was placed inside `.then()`, but not wrapped inside a callback function. This caused JavaScript to evaluate `app.listen()` instantaneously instead of waiting for the database to resolve.
- **The Fix**: Wrapped it in an arrow function: `.then(() => { app.listen(...) })`

### 🔴 Error 3: Frontend APIs were Crashing/Failing
- **The Issue**: The UI loaded, but immediately failed to get data.
- **The Cause**: Inside `frontend/src/services/api.js`, the fallback API URL was hardcoded to point to the old backend port: `http://localhost:4000/api/v1`.
- **The Fix**: Changed the hardcoded port to `8000` to match the new Docker exposed layout.

### 🔴 Error 4: CORS Blocking Requests
- **The Issue**: Cross-Origin Resource Sharing prevented the frontend from talking to the backend.
- **The Cause**: The backend `.env` explicitly only allowed traffic from `http://localhost:3000` (your old local React port). However, the Dockerized NGINX frontend was running on port 80 (`http://localhost`).
- **The Fix**: Updated `CORS_ORIGIN=http://localhost` inside `backend/.env`.

### 🔴 Error 5: Resume Uploads Failing 
- **The Issue**: Calling the resume upload endpoint resulted in a server crash or fail.
- **The Cause**: The Express `multer` middleware (which temporarily stores the file before sending it to Cloudinary) was using a hardcoded absolute Windows path (`C:/Users/HP/.../public/temp`). The Linux Docker container crashed because there is no `C:/` drive inside the container.
- **The Fix**: 
  1. Changed the destination path in `multer.middlewares.js` to a universal relative path: `'./public/temp'`
  2. Modified the `backend/Dockerfile` to automatically create this folder at build time using: `RUN mkdir -p public/temp`

---

## 3. How to Run This Project with Docker

Whenever you return to this project later, you don't need to manually start your frontend, backend, or database servers. You just need to run Docker from the root directory:

**To Start Everything:**
```bash
docker compose up --build
```

**Where to Access:**
- The Website: [http://localhost](http://localhost)
- The Backend API: [http://localhost:8000](http://localhost:8000)

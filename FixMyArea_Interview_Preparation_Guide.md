# 🚀 FixMyArea — Complete Technical Interview & Architecture Guide

This comprehensive guide is designed to prepare you for technical interviews, code walkthroughs, and manager reviews for the **FixMyArea** civic issue management platform.

---

## 📌 Executive Summary & 30-Second Elevator Pitch

> **Elevator Pitch:**
> *"FixMyArea is a full-stack, real-time civic issue reporting and resolution platform built using React, Node.js, Express, and MongoDB Atlas. It empowers citizens to report local infrastructure problems (like potholes, street light failures, or sewage leaks) with geo-location detection and photo evidence. The platform implements Role-Based Access Control (RBAC) across three user tiers — Citizens, Municipal Workers, and System Administrators — allowing municipal teams to manage issue life-cycles and admins to oversee platform analytics and user roles."*

---

## 🏗️ 1. System Architecture & Tech Stack Overview

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             FRONTEND (Vite + React 18)                      │
│                                                                             │
│   [ Pages ]                 [ Context / State ]           [ Network Layer ] │
│   • Home / Landing          • AuthContext                 • Axios Instance  │
│   • Auth (Login/Signup)     • (JWT & User state)           • Request Interceptor│
│   • Citizen Dashboard       • Custom Hooks (`useAuth`)     • Response Interceptor│
│   • Municipal Dashboard                                    • Attachment Helper│
│   • Admin Dashboard                                                         │
│   • Report Issue (Geolocation + Image Preview)                              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST APIs (JSON & Multipart)
                                       │ Port: 4009 | Base: /v1/api
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                             BACKEND (Node.js + Express 5)                   │
│                                                                             │
│   [ Security Middleware ]       [ Controllers ]         [ Middleware ]     │
│   • Helmet (Security Headers)   • authController        • verifyToken      │
│   • Express Rate Limit          • issueController       • requireRole      │
│   • CORS Cross-Origin Control                           • uploadMiddleware │
│                                                         • errorHandler     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Mongoose ODM / MongoDB Driver
                                       │ TLS / SRV Connection String
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                             DATABASE (MongoDB Atlas)                        │
│                                                                             │
│   [ Collections ]               [ Indexes ]                                 │
│   • Users (Citizens/Staff/Admin)• status, category, priority, userId        │
│   • Issues (Reports & Comments) • createdAt (-1)                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Full Technology Stack Table

| Tier | Technology | Purpose / Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | **React 18 (Vite)** | Component-based UI with fast HMR build tool |
| **Styling** | **Vanilla CSS + Glassmorphism** | Modern, premium aesthetic with smooth blur gradients & animations |
| **Icons & Anims** | **Lucide-React, Framer Motion** | Clean UI icons & fluid micro-interactions |
| **Routing** | **React Router DOM v6** | Client-side routing with protected route wrappers |
| **HTTP Client** | **Axios** | Interceptor-based HTTP requests & global header injection |
| **Backend API** | **Node.js + Express 5** | Non-blocking, asynchronous RESTful API backend |
| **Authentication**| **JWT (`jsonwebtoken`), `bcrypt`**| Stateless token-based auth & salted password hashing |
| **File Handling** | **Multer** | Multipart form-data handling & image disk storage |
| **Security** | **Helmet, Express Rate Limit** | Hardening HTTP headers & protecting endpoints against DDoS/brute-force |
| **Validation** | **Express-Validator** | Sanitizing & validating incoming request payloads |
| **Database** | **MongoDB Atlas + Mongoose ODM** | Scalable NoSQL document store with schema validation & indexing |

---

## 🔐 2. Deep-Dive: Authentication & Role-Based Access Control (RBAC)

### Password Security & Registration Flow
1. **Password Hashing:** Passwords are never stored in plain text. When a user registers via `POST /v1/api/auth/register`, [authController.js](file:///d:/Final%20Year%20Project/FixMyArea_Backend/controllers/authController.js#L23) hashes the password using `bcrypt.hash(password, 10)` with 10 salt rounds.
2. **Token Generation:** Upon successful registration or login, the backend generates a JsonWebToken signed with `process.env.JWT_SECRET`:
   ```javascript
   const signToken = (user) =>
     jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
       expiresIn: '7d',
     });
   ```

### Role-Based Authorization Engine
The backend enforces security using two custom middleware functions in [authMiddleware.js](file:///d:/Final%20Year%20Project/FixMyArea_Backend/middleware/authMiddleware.js):

* **`verifyToken` Middleware:** Extracts the Bearer token from `Authorization: Bearer <token>`, verifies it against `JWT_SECRET`, and attaches the decoded payload (`userId`, `role`) to `req.user`.
* **`requireRole(...roles)` Middleware:** Higher-order middleware function that checks if `req.user.role` matches the required roles (`'citizen'`, `'municipal'`, `'admin'`). Returns `403 Forbidden` if unauthorized.

```javascript
// Example: Restricting user deletion to Admins only
router.delete('/users/:id', verifyToken, requireRole('admin'), deleteUser);
```

### Frontend Auth Lifecycle (`AuthContext`)
1. **State Persistence:** Upon login, the JWT is stored in `localStorage` under `fma_token`.
2. **Global Header Injection:** [api.js](file:///d:/Final%20Year%20Project/FixMyArea_Frontend/src/utils/api.js#L9-L13) uses an Axios request interceptor to automatically attach `Authorization: Bearer <token>` to every outgoing request.
3. **Session Rehydration (`/auth/me`):** When the application loads, [AuthContext.jsx](file:///d:/Final%20Year%20Project/FixMyArea_Frontend/src/context/AuthContext.jsx#L18) checks if the token exists and hasn't expired (via `jwtDecode`). It then fetches current user profile details from `GET /v1/api/auth/me` to rehydrate state seamlessly.

---

## 📸 3. Deep-Dive: Image Upload & Storage Architecture

### How Images Are Processed (End-to-End)

```
[ Citizen Browser ]                        [ Express Backend ]                    [ File System / Uploads ]
       │                                           │                                          │
       │ 1. Select Image (<input type="file">)     │                                          │
       │ 2. Preview via FileReader (Base64)        │                                          │
       │ 3. Send multipart/form-data via Axios    │                                          │
       │──────────────────────────────────────────>│                                          │
       │                                           │ 4. `upload.single('photo')` (Multer)      │
       │                                           │    • Validates MIME type & 5MB limit     │
       │                                           │    • Generates unique filename           │
       │                                           │─────────────────────────────────────────>│
       │                                           │                                          │ 5. Saves file to
       │                                           │<─────────────────────────────────────────│    `uploads/issues/<filename>`
       │                                           │                                          │
       │                                           │ 6. Saves relative path string in Mongo   │
       │                                           │    `photo: "uploads/issues/<filename>"`  │
       │<──────────────────────────────────────────│                                          │
       │ 7. Returns 201 Created                     │                                          │
```

1. **Client-Side Validation & Preview:**
   In [ReportIssue.jsx](file:///d:/Final%20Year%20Project/FixMyArea_Frontend/src/pages/ReportIssue.jsx#L65-L73), the user selects an image file. The client checks `file.size <= 5 * 1024 * 1024` (5MB limit) and reads the file into a base64 string using `FileReader` to show an immediate UI preview.

2. **Multipart Submission:**
   The form constructs a `FormData()` object containing text fields (`issueTitle`, `issueDescription`, `category`, `address`, `priority`) and appends the raw file object `fd.append('photo', form.photo)`.

3. **Backend Storage Engine (Multer):**
   In [uploadMiddleware.js](file:///d:/Final%20Year%20Project/FixMyArea_Backend/middleware/uploadMiddleware.js), Multer disk storage handles the incoming stream:
   * **Destination:** `FixMyArea_Backend/uploads/issues`
   * **Filename Generation:** Standardizes filenames to avoid collisions using a timestamp suffix:
     ```javascript
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
     cb(null, uniqueSuffix + path.extname(file.originalname));
     // Resulting filename example: 1714523948123-948201948.jpg
     ```
   * **MIME Filter:** Rejects non-image file extensions (allowing only `.jpg`, `.jpeg`, `.png`, `.webp`).

4. **Database Record:**
   The database does **not** store binary BLOBs (which bloat databases). Instead, MongoDB stores the relative path string: `"uploads/issues/1714523948123-948201948.jpg"`.

5. **Static File Serving & Image URL Resolution:**
   In [server.js](file:///d:/Final%20Year%20Project/FixMyArea_Backend/server.js#L46), Express serves static files:
   ```javascript
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   ```
   On the frontend, [api.js](file:///d:/Final%20Year%20Project/FixMyArea_Frontend/src/utils/api.js#L27-L34) exports `getAttachmentUrl(photoPath)`, converting relative paths into full HTTP URLs: `http://localhost:4009/uploads/issues/1714523948123-948201948.jpg`.

---

## 📍 4. Deep-Dive: Geolocation & Reverse Geocoding

### How Geolocation Works
In [ReportIssue.jsx](file:///d:/Final%20Year%20Project/FixMyArea_Frontend/src/pages/ReportIssue.jsx#L24-L58):

1. **Browser Location Capture:**
   Clicking the location button triggers `navigator.geolocation.getCurrentPosition()`, requesting high accuracy coordinates (`{ enableHighAccuracy: true }`).

2. **Reverse Geocoding (OpenStreetMap Nominatim API):**
   Once latitude and longitude are retrieved, the frontend sends an asynchronous request to OpenStreetMap's Nominatim API:
   ```javascript
   const response = await fetch(
     `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
   );
   const data = await response.json();
   ```
3. **Address Auto-Fill & Fallback:**
   * If Nominatim returns `data.display_name` (e.g., *"MG Road, Connaught Place, New Delhi"*), the address input field is automatically populated with the readable location.
   * **Fallback Mechanism:** If the API fails or rate-limits, the code gracefully falls back to raw coordinate strings (`"12.9716, 77.5946"`).

---

## ⚡ 5. Frontend-Backend Communication & Axios Architecture

* **Centralized Axios Instance ([api.js](file:///d:/Final%20Year%20Project/FixMyArea_Frontend/src/utils/api.js)):**
  * `baseURL` configured via environment variable `import.meta.env.VITE_API_BASE_URL` with a default fallback to `http://localhost:4009/v1/api`.
  * `timeout: 15000` (15s timeout to prevent hanging connections).

* **Request Interceptor:** Automatically retrieves the JWT token from `localStorage` and injects `Authorization: Bearer <token>` into HTTP headers.
* **Response Interceptor:** Global error handling trap for `401 Unauthorized`. If a token expires, the interceptor clears `localStorage` and redirects the user to the auth page.

---

## 🛡️ 6. Security Hardening & Performance Optimizations

1. **Helmet Middleware:** Enforces secure HTTP response headers (XSS Protection, HSTS, Content Security Policy, Frameguard against Clickjacking).
2. **Express Rate Limiting:** Prevents DDoS and password brute-force attacks by capping requests per IP window.
3. **Payload Sanitization (`express-validator`):** Validates and sanitizes incoming request payloads before reaching controller handlers.
4. **MongoDB Indexing Strategy:**
   In [Issue.js](file:///d:/Final%20Year%20Project/FixMyArea_Backend/models/Issue.js#L50-L54), database query execution is optimized using compound and single-field indexes:
   ```javascript
   issueSchema.index({ status: 1 });
   issueSchema.index({ category: 1 });
   issueSchema.index({ priority: 1 });
   issueSchema.index({ userId: 1 });
   issueSchema.index({ createdAt: -1 });
   ```
   *Indexes speed up feed filtering by category/status and sorting by creation date from $O(N)$ collection scans to $O(\log N)$ B-tree index lookups.*

---

## ❓ 7. Top 20 Technical Interview Questions & Expert Answers

### Q1: Can you give an overview of the FixMyArea project architecture?
> **Answer:** *"FixMyArea is structured as a decoupled full-stack JavaScript application following the client-server REST architecture. The frontend is built with React 18 and Vite for fast client-side rendering and responsive UI. The backend is a modular Node.js Express application organized into routes, controllers, middleware, and Mongoose database models. Communication occurs over HTTP/HTTPS with JSON payloads for data and multipart form-data for image uploads."*

### Q2: How is user authentication implemented?
> **Answer:** *"Authentication is stateless and uses JSON Web Tokens (JWT). When a user logs in, their credentials are validated against hashed passwords stored in MongoDB using `bcrypt.compare()`. Upon validation, a signed JWT containing the user ID and role is returned. The frontend stores this token in `localStorage` and attaches it to the `Authorization` header as a Bearer token on subsequent requests using Axios request interceptors."*

### Q3: How do you handle Role-Based Access Control (RBAC) on the backend?
> **Answer:** *"We use two express middleware functions: `verifyToken` and `requireRole`. `verifyToken` decodes and verifies the JWT, attaching `req.user` to the request object. `requireRole(...roles)` is a higher-order closure function that compares `req.user.role` against authorized roles (e.g. `'admin'` or `'municipal'`). If the user does not possess the required role, it short-circuits the request and returns a `403 Forbidden` response."*

### Q4: Why did you choose local disk storage with Multer instead of Cloud Storage (like AWS S3) for images, and how would you scale it?
> **Answer:** *"For development speed and zero external dependency costs, local disk storage via `multer.diskStorage` was selected. Images are saved to `/uploads/issues` with unique timestamped filenames, and served statically by Express. In a production cloud environment, we would swap Multer disk storage for `multer-s3` or direct client-side S3 presigned URLs, uploading images to an AWS S3 bucket distributed via Amazon CloudFront CDN for global caching and high scalability."*

### Q5: How does the application capture location when a user reports an issue?
> **Answer:** *"We utilize the HTML5 Browser Geolocation API (`navigator.geolocation.getCurrentPosition`) to capture latitude and longitude coordinates. We then perform reverse geocoding asynchronously by sending the coordinates to the OpenStreetMap Nominatim API. This resolves raw GPS coordinates into human-readable street names and areas. If reverse geocoding fails or is offline, the system safely falls back to coordinate strings."*

### Q6: How does the frontend handle expired JWT tokens?
> **Answer:** *"The frontend handles expired tokens at two levels: First, in `AuthContext`, we inspect token expiration (`decoded.exp * 1000 > Date.now()`) during initialization using `jwt-decode`. Second, we have an Axios response interceptor that catches global `401 Unauthorized` responses from the backend, removes the invalid token from `localStorage`, and redirects the user to the login screen."*

### Q7: Why are passwords hashed with bcrypt instead of SHA-256 or MD5?
> **Answer:** *"SHA-256 and MD5 are fast cryptographic hash functions designed for message integrity, making them vulnerable to rainbow table attacks and high-speed GPU brute-forcing. `bcrypt` is an adaptive key-derivation function that incorporates a salt to prevent rainbow table lookups and uses a configurable cost factor (work factor of 10) to slow down brute-force attacks significantly."*

### Q8: What database did you choose and how is data modeled?
> **Answer:** *"We selected MongoDB Atlas (NoSQL) with Mongoose ODM due to its schema flexibility and seamless JSON document integration. We have two primary models: `User` and `Issue`. The `Issue` document includes sub-documents for embedded `comments` and references user ObjectIds for issue authors (`userId`), assigned municipal workers (`assignedTo`), and citizen upvotes (`votes`)."*

### Q9: How do you optimize database query performance when issue volume grows?
> **Answer:** *"We implemented single-field database indexes on high-frequency query fields in the Issue schema: `status`, `category`, `priority`, `userId`, and `createdAt`. Indexes create B-tree lookup structures in memory, reducing query search complexity from $O(N)$ full-collection scans to $O(\log N)$ lookups when filtering issue feeds."*

### Q10: How do you prevent security vulnerabilities like SQL/NoSQL Injection and XSS?
> **Answer:** *"For XSS protection, we use Express `helmet` middleware to set strict HTTP security headers and leverage React's automatic JSX text escaping. For NoSQL Injection prevention, Mongoose schema casting automatically sanitizes input types. In addition, we use `express-validator` middleware to sanitize and validate input payloads before processing."*

### Q11: What is CORS and how is it configured in your backend?
> **Answer:** *"CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making API requests to a domain different from the one that served the page. In Express, we configure the `cors` middleware with an explicit whitelist of allowed origins (e.g. `http://localhost:5173` and deployed domain URLs) and permitted HTTP methods (`GET, POST, PUT, DELETE`)."*

### Q12: How are CORS preflight requests handled?
> **Answer:** *"When a client makes non-simple HTTP requests (such as POST with `Content-Type: application/json` or headers containing `Authorization: Bearer`), the browser sends an automatic `OPTIONS` preflight request. Express `cors()` middleware automatically intercepts `OPTIONS` requests and returns the proper `Access-Control-Allow-Headers` and `Access-Control-Allow-Origin` headers."*

### Q13: How does state management work across the React application?
> **Answer:** *"We use React Context API (`AuthContext`) combined with custom hooks (`useAuth`) for global authentication state (current user, login, logout, loading states). Component-level state (`useState`) handles local form inputs, image previews, and UI toggles, while React Router handles navigation state."*

### Q14: Explain the issue status lifecycle in FixMyArea.
> **Answer:** *"An issue starts in the `'Pending'` status when submitted by a citizen. A municipal official or administrator can update the status to `'In Progress'`, assign it to an authority worker, add official progress notes, and eventually transition the issue status to `'Resolved'` (populating `resolvedAt`) or `'Rejected'`."*

### Q15: How are file sizes and file types restricted during image upload?
> **Answer:** *"Validation happens at both client and server levels. On the client, `handlePhoto` checks `file.size > 5MB` and rejects oversized files immediately. On the server, Multer enforces `limits: { fileSize: 5 * 1024 * 1024 }` and executes a regex `fileFilter` validating MIME type (`mimetype: image/jpeg|png|webp`) and extension."*

### Q16: How do you handle errors centrally in Express?
> **Answer:** *"We use custom Express error-handling middleware (`errorHandler.js`) placed after all API route declarations. Async controller functions catch runtime errors or wrap routes with `express-async-handler`. Any uncaught error passed to `next(err)` is intercepted by the central error handler, logging the stack trace and returning a formatted JSON error response with an appropriate HTTP status code (e.g. 500)."*

### Q17: What is the benefit of using ES Modules (`"type": "module"`) in Node.js?
> **Answer:** *"ES Modules bring native `import/export` syntax standardization across both frontend React and backend Node.js codebases. It improves static code analysis, enables tree-shaking support, avoids CommonJS `require()` synchronous loading bottlenecks, and maintains consistent JavaScript syntax throughout the full stack."*

### Q18: How would you implement real-time notifications for issue updates?
> **Answer:** *"Currently, issue updates are retrieved via REST API polling or re-fetching. To upgrade to real-time notifications, we would integrate **Socket.io** or WebSockets. When a municipal worker updates an issue status to 'Resolved', the server would emit a WebSocket event (`issue_updated`) to connected citizen clients subscribed to that issue ID channel."*

### Q19: What is Rate Limiting and why did you include it?
> **Answer:** *"Rate limiting restricts the maximum number of requests a single IP address can submit within a given time window (using `express-rate-limit`). We included it to protect authentication and issue submission endpoints from automated brute-force password attempts, API abuse, and Denial of Service (DDoS) attacks."*

### Q20: If you had 2 weeks to add major new features to FixMyArea, what would you build?
> **Answer:**
> 1. **Interactive Map Layer:** Integrate Leaflet.js / Mapbox to display all reported issues on an interactive cluster map with heatmaps for high-priority areas.
> 2. **AI Automated Issue Categorization:** Use OpenAI / Vision API to auto-classify uploaded pothole/garbage photos and assign priority levels automatically.
> 3. **Push Notifications & SMS Alerts:** Use Web Push API and Twilio SMS to notify citizens instantly when their reported issue status changes.

---

## 🎯 Summary Checklist Before Your Interview

- [x] Review the 30-Second Elevator Pitch.
- [x] Understand the JWT token flow: `Register/Login -> bcrypt -> JWT Sign -> localStorage -> Axios Interceptor -> verifyToken`.
- [x] Understand Multer image flow: `FormData -> Multer DiskStorage -> unique suffix -> uploads/issues/ -> express.static()`.
- [x] Understand Geolocation: `navigator.geolocation -> Nominatim API reverse lookup -> address fallback`.
- [x] Practice answering Q1, Q2, Q4, Q8, and Q20 aloud!

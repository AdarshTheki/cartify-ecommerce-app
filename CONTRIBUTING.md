## 🙌 Contributing to Cartify (MERN Stack E-Commerce)

Thank you for considering contributing to **Cartify**! Your help makes this project better for everyone.

### 🚀 Getting Started

#### 1. Fork and Clone the Repository

```bash
git clone https://github.com/your-username/cartify.git
cd cartify
```

#### 2. Install Dependencies

Install both backend and frontend dependencies:

```bash
# Backend (Server APIs)
cd /backend
npm install

# Frontend (Website App)
cd /frontend
npm install
```

#### 3. Setup Environment Variables

Create `.env` files in both the `backend` and `frontend` directories with your own values:

##### 📁 backend/.env

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
CLIENT_URL=http://localhost:3000
```

##### 📁 frontend/.env

```env
VITE_API_URL=http://localhost:5000/api
```

> 💡 Make sure to **never commit `.env` files**.

---

### 🧪 Running the App Locally

In separate terminals:

```bash
# Start backend
cd backend
npm run dev
```

```bash
# Start frontend
cd frontend
npm run dev
```

App will run at [http://localhost:3000](http://localhost:3000)

---

### 📌 Notes

- **Make sure MongoDB is running locally** or use a cloud DB like MongoDB Atlas.
- **Ensure OAuth credentials are set correctly** in the `.env`.

---

Ready to contribute? Continue with the [contribution steps](#️-how-to-contribute) or [submit a pull request](#submit-code). 🚀

---

Let me know if you'd like me to combine this into your full `CONTRIBUTING.md`, including **How to Contribute**, **Code Style**, and **Pull Request Guidelines**.

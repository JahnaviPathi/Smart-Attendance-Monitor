# 🎨 Smart Attendance & Well-Being Monitoring System (Frontend)

## 📌 Overview

This repository contains the **frontend application** of the Smart Attendance and Well-Being Monitoring System.

It provides a responsive dashboard for managing attendance, verifying location, and visualizing student well-being insights.

---

## 🖼️ Application Screenshots

### 🔐 Authentication (Login & Register)

![Login](./media/Screenshot%202026-03-14%20101813.png)
![Register](./media/Screenshot%202026-03-14%20101848.png)

👉 Users can securely login or create an account to access the system.

---

### 📍 Location Verification

![Location1](./media/Screenshot%202026-03-14%20101908.png)
![Location2](./media/Screenshot%202026-03-14%20102039.png)

👉 The system uses browser GPS to verify user presence within the campus.

---

### 📊 College Reports Dashboard

![Reports1](./media/Screenshot%202026-03-14%20102327.png)
![Reports2](./media/Screenshot%202026-03-14%20102333.png)

👉 Displays attendance statistics, well-being scores, and analytics in a clean UI.

---

## 🎯 Features

* 🔐 Authentication UI (Login/Register)
* 📍 Location-based verification
* 📊 Dashboard with reports & analytics
* 😊 Well-being data interaction
* 🔌 REST API integration

---

## 🏗️ Frontend Architecture

The application is built using a **component-based architecture**:

UI → API Calls → Backend → Response → UI Update

---

## ⚙️ Tech Stack

* React.js
* TypeScript
* HTML5
* CSS3

---

## 📂 Folder Structure

```
client/
│── components/
│── pages/
│── services/
│── assets/
│── App.tsx
```

---

## 🔄 Working Flow

1. User logs in or registers
2. Location is captured via browser
3. API calls are made to backend
4. Dashboard loads with data
5. Reports are visualized using UI components

---

## 🔌 API Integration

* POST /login
* POST /register
* GET /attendance
* GET /reports

---

## ⚠️ Limitations

* Depends on backend APIs
* GPS accuracy may vary
* Requires internet connection

---

## 🔮 Future Enhancements

* Improve UI/UX
* Add real-time updates
* Mobile optimization
* AI-based insights

---

## 👩‍💻 Author

Jahnavi Pathi

---

## 🎯 Conclusion

The frontend provides an interactive and user-friendly interface for managing attendance and monitoring student well-being efficiently.

---

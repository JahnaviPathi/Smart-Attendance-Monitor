# 🎨 Smart Attendance & Well-Being Monitoring System (Frontend)

## 📌 Overview

This repository contains the **frontend application** of the Smart Attendance and Well-Being Monitoring System.

It provides a **responsive dashboard interface** for students and administrators to interact with the system, view attendance records, and monitor well-being insights.

---

## 🖼️ Application Screenshots

### 🔐 Login Page

![Login Page](./media/Screenshot%202026-03-14%20101908.png)

### 📊 Dashboard - College Reports

![Dashboard](./media/Screenshot%202026-03-14%20102333.png)

### 📈 Attendance & Analytics

![Analytics](./media/Screenshot%202026-03-14%20102033.png)

---

## 🎯 Features

* 🔐 User Login & Authentication UI
* 📊 Interactive Dashboard (Reports, Insights)
* 📍 Location Access Integration (GPS via browser)
* 😊 Well-being Data Input Forms
* 📈 Attendance & Stress Visualization (charts & cards)
* 📤 API Integration with Backend Services

---

## 🏗️ Frontend Architecture

The frontend follows a **component-based architecture** using React.

👉 Flow:
UI Components → API Calls → Backend → Response → UI Update

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

1. User opens the web application
2. Login form captures user credentials
3. Data is sent to backend via API
4. On success → dashboard is loaded
5. Dashboard fetches attendance & well-being data
6. Data is displayed using charts and UI cards

---

## 🔌 API Integration

The frontend communicates with backend using REST APIs:

* `POST /login`
* `GET /attendance`
* `POST /wellbeing`
* `GET /reports`

---

## 📊 UI Highlights

* Clean dashboard design
* Real-time data updates
* User-friendly navigation
* Responsive layout

---

## ⚠️ Limitations

* Depends on backend APIs
* No direct data processing
* Requires internet connection

---

## 🔮 Future Enhancements

* Improve UI/UX
* Add notifications
* Enhance responsiveness
* AI insights integration

---

## 👩‍💻 Author

Jahnavi Pathi

---

## 🎯 Conclusion

The frontend delivers a **smooth and interactive experience**, enabling users to efficiently view attendance and well-being insights.

---

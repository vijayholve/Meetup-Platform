# 🎉 Event Management System

A full-stack Event Management web application built using **Django (Backend)** and **React (Frontend)**. The system allows users to register as organizers, attendees, or vendors, create or join events, and manage event-related activities efficiently.

---

## 🔧 Technologies Used

- **Backend**: Django, Django REST Framework (DRF), JWT Authentication  
- **Frontend**: React, Axios, React Router  
- **Database**: SQLite (dev), PostgreSQL (prod recommended)  
- **Styling**: Tailwind CSS, Custom CSS  

---

## 🚀 Features

### 🔐 Authentication
- User registration with role selection (Organizer, Attendee, Vendor)
- JWT-based login/logout
- Role-based access control

### 🗓️ Event Management
- Organizers can create, edit, and delete events
- Attendees can register for events
- Vendors can view and manage assigned events

### 📩 Communication
- Users receive real-time messages for event updates *(Coming soon with WebSocket)*

### 📊 Dashboard *(In Progress)*
- Overview of upcoming and past events
- Stats and activity logs

---

## 📁 Project Structure

```bash

event-management/
│
├── eventx/ # Django project
│ ├── manage.py
│ ├── event_app/ # App with models, views, serializers
│ └── ...
│
├── frontend/ # React project
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── features/
│ ├── public/
│ └── package.json
│
├── requirements.txt
└── README.md



## 🛠️ Setup Instructions

### 🔙 Backend (Django)

```bash
cd eventx
python -m venv env
# Activate the virtual environment
# On Windows:
env\Scripts\activate
# On Unix/macOS:
source env/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

🔜 Frontend (React)

cd frontend
rm package-lock.json       # Optional, to avoid dependency conflicts
npm install
npm run dev                # Or use: npm start
🌐 API Endpoints (Examples)
Method	Endpoint	Description
POST	/api/register/	Register a new user
POST	/api/token/	Login to get JWT token
GET	/api/events/	List all events
POST	/api/events/create/	Create a new event (organizer)

📷 Screenshots (Add Yours)
✅ Login Page

✅ Registration Form

✅ Event Dashboard

You can add screenshots by uploading images and referencing them like:

markdown
Copy
Edit
![Login](screenshots/login.png)
🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

📄 License
This project is open source and available under the MIT License.

👨‍💻 Author
Vijay Gholve

GitHub

LinkedIn

---

### ✅ What You Need to Do Next

1. Create a folder called `screenshots/` and add your images (`login.png`, `dashboard.png`, etc.).
2. If you don’t have a `LICENSE` file yet, add one (MIT recommended).
3. Copy this markdown into your `README.md` file in the root directory.

Let me know if you want to include deployment instructions (e.g., using Vercel or Heroku).








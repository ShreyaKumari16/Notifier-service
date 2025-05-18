# Notifier-service

A microservice-based notification system built using Node.js, Express, MongoDB, RabbitMQ, and Twilio. This service enables sending and storing in-app notifications, SMS, and email alerts in a scalable and efficient way.

## 🚀 Features
- Send notifications via SMS, Email, and In-App
- Queue-based message handling using RabbitMQ
- Persistent notification storage in MongoDB
- RESTful APIs to create and retrieve notifications
- Easily extensible architecture for future channels (e.g., WhatsApp, Push)

## 🛠️ Tech Stack
- Layer	Technology
- Backend	Node.js, Express
- Database	MongoDB
- Messaging	RabbitM
- Notification	Twilio (Email/SMS)

## 📂 Project Structure
Notifier-service/
│
├── config/             # Configuration files
├── controllers/        # API logic
├── models/             # Mongoose schemas
├── routes/             # Express routes
├── services/           # Business logic (Twilio, RabbitMQ, etc.)
├── utils/              # Utility functions
├── queue/              # RabbitMQ producer/consumer
├── .env                # Environment variables
├── app.js              # Main server setup
└── README.md           # Project overview

## 🔧 Setup Instructions

### Clone the repository:
- git clone https://github.com/ShreyaKumari16/Notifier-service.git
- cd Notifier-service

### Install dependencies
- npm install

### Set up environment variables
Create a .env file and add:
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- RABBITMQ_URI=your_rabbitmq_connection_string
- TWILIO_ACCOUNT_SID=your_twilio_account_sid
- TWILIO_AUTH_TOKEN=your_twilio_auth_token
- TWILIO_PHONE_NUMBER=your_twilio_phone_number
- EMAIL_SERVICE_API_KEY=your_email_api_key

### Start the app
- npm start

  
## 📬 API Endpoints
- Method	Endpoint	Description
- POST	/api/notify	Create and send a notification
- GET	/api/notifications	Get all stored notifications

## 📦 Message Queue (RabbitMQ)
- Producer adds messages to the queue when a notification is requested.
- Consumer processes messages asynchronously and triggers the appropriate service (SMS/Email/In-App).

## ✉️ Notification Channels
- SMS: Sent using Twilio
- Email: Configured via API key (e.g., SendGrid or Twilio SendGrid)
- In-App: Stored in MongoDB and retrievable via API

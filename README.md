# 🚢 Cargo Shipment Tracker

A full-stack MERN application for tracking cargo shipments in real-time. Features an interactive dashboard with Leaflet maps, live location updates, and automatic ETA calculation.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-v14+-brightgreen)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Assumptions](#-assumptions)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- **📊 Dashboard:** View all shipments in a clean tabular/list view
- **🗺️ Interactive Map:** Visualize routes from Origin to Destination using Leaflet
- **⚡ Real-time Updates:** Update shipment coordinates and watch ETA recalculate instantly
- **📍 Status Tracking:** Automatic status updates (Pending, In-Transit, Delivered, Delayed)
- **🧮 Smart ETA:** Dynamic ETA calculation based on current position and destination
- **📱 Responsive Design:** Works seamlessly across desktop and mobile devices

---

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **Leaflet** - Interactive maps
- **CSS3** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM library

### Dev Tools
- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands

---

## 📦 Installation & Setup

### 1. Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### 2. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/open-filer/cargo-shipment-tracker.git

# Navigate to repository
cd cargo-shipment-tracker
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Create .env file
touch .env
```

**Environment Variables (.env):**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cargo-tracker
FRONTEND_URL=http://localhost:3000
```

```bash
# Start the backend server
npm start
```

✅ Backend server should now be running on `http://localhost:5000`

### 4. Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

✅ Frontend app should now be running on `http://localhost:5000`

### 5. Verify Installation

- Open your browser and navigate to `http://localhost:5000`
- You should see the Cargo Shipment Tracker dashboard
- The map should load successfully (requires internet for map tiles)

---

## 🧪 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/shipments` | Fetch all shipments | - |
| `GET` | `/api/shipment/:id` | Get single shipment details | - |
| `POST` | `/api/shipment` | Create a new shipment | `{ shipmentNumber, origin, destination, status, currentLocation }` |
| `POST` | `/api/shipment/:id/update-location` | Update coordinates & recalculate ETA | `{ latitude, longitude }` |
| `GET` | `/api/shipment/:id/eta` | Get current ETA details | - |

### Example API Calls

**Create a new shipment:**
```bash
curl -X POST http://localhost:5000/api/shipment \
  -H "Content-Type: application/json" \
  -d '{
    "shipmentNumber": "SHP001",
    "origin": { "lat": 40.7128, "lng": -74.0060, "name": "New York" },
    "destination": { "lat": 34.0522, "lng": -118.2437, "name": "Los Angeles" },
    "status": "Pending",
    "currentLocation": { "lat": 40.7128, "lng": -74.0060 }
  }'
```

**Update location:**
```bash
curl -X POST http://localhost:5000/api/shipment/SHP001/update-location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 39.7392,
    "longitude": -104.9903
  }'
```

---

## 📁 Project Structure

```
cargo-shipment-tracker/
│
├── backend/
│   ├── models/
│   │   └── Shipment.js          # Mongoose schema
│   ├── routes/
│   │   └── shipments.js         # API routes
│   ├── server.js                # Express server setup
│   ├── package.json
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── MapView.js       # Leaflet map component
│   │   │   └── ShipmentList.js  # Shipment table
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

---

## 💡 Usage

### Adding a New Shipment

1. Navigate to the dashboard
2. Click "Add Shipment" button
3. Fill in the following details:
   - Shipment Number
   - Origin (name, latitude, longitude)
   - Destination (name, latitude, longitude)
   - Initial Status
4. Click "Submit"

### Updating Shipment Location

1. Select a shipment from the list
2. Click "Update Location"
3. Enter new coordinates (latitude, longitude)
4. ETA will automatically recalculate
5. Status will update based on proximity to destination

### Viewing Shipment Route

- Click on any shipment to view its route on the interactive map
- Blue marker: Origin
- Red marker: Destination
- Green marker: Current location
- Dotted line: Planned route

---

## 📝 Assumptions

The following assumptions were made for this demo application:

1. **Average Ship Speed:** Ships travel at an average speed of **40 km/h** for ETA calculation
2. **Route Calculation:** Routes assume a **direct path** using Haversine distance formula (great-circle distance)
3. **Status Logic:**
   - `Pending`: Shipment not yet started
   - `In-Transit`: Shipment is moving (distance from origin > 10 km)
   - `Delivered`: Shipment reached destination (within 10 km radius)
   - `Delayed`: ETA exceeded by more than 2 hours
4. **Coordinate System:** Uses WGS84 coordinate system (standard GPS)
5. **Real-time Updates:** Manual updates via API (no automatic GPS tracking)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/YourFeature`)
6. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kritagya Singh**

- Email: kritagya.singh.dev@gmail.com
- GitHub: [@open-filer](https://github.com/open-filer)

---

## 🙏 Acknowledgments

- [Leaflet.js](https://leafletjs.com/) for the amazing mapping library
- [MongoDB](https://www.mongodb.com/) for the database
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework


---

**⭐ If you found this project helpful, please consider giving it a star!**
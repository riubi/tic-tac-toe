# Tic-Tac-Toe Game

A simple real-time multiplayer Tic-Tac-Toe Game built with **Node.js, WebSockets, Express, React Native, and Expo**.

[Live Demo](https://tic-tac-toe.clu.by/)

---

## 🚀 Some Features

- **Real-time multiplayer** with WebSockets
- **AI-powered bots** for single-player mode
- **Lobby system** for matchmaking and game management
- **Cross-platform** support via React Native & Expo

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express, WebSockets (ws), TensorFlow.js
- **Frontend:** React Native, Expo

---

## 📌 Prerequisites

- Install **[Node.js](https://nodejs.org/)** (v20.x or higher)
- Install **[Expo CLI](https://docs.expo.dev/get-started/installation/)**:
  ```sh
  npm install -g expo-cli
  ```

---

## 📦 Installation

### 1️⃣ Start the **Server**

```sh
npm install
npm start
```

The server will start on `http://localhost:3000`.

📌 **Note:** The server starts with **random AI training cases**, and every **10 seconds**, a bot joins the lobby.

---

### 2️⃣ Start the **Client**

```sh
cd ../client
npm install
npm start
```

To run on your **device**, install **Expo Go** (iOS/Android) and scan the QR code.

For **specific platforms**:

- **Android:** `npm run android`
- **iOS:** `npm run ios`
- **Web:** `npm run web`

---

## 🛠 Development

To run both **server** and **client** in parallel:

```sh
npm run dev
```

_(This uses `concurrently` to start both processes.)_

---
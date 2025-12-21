const AUTH_URL = "http://localhost:5000/auth";
const SOCKET_URL = "http://localhost:8000";

let socket;

// 1. Socket Initialize (Bina function ke, file load hote hi)
socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true // Cookies allow karne ke liye
});

// Connection Handlers
socket.on("connect", () => {
    console.log("✅ Socket Connected:", socket.id);
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = "Status: Connected ✅";
    statusDiv.className = "status online";
});

socket.on("connect_error", (err) => {
    console.error("❌ Connection Error:", err.message);
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = "Status: Connection Failed ❌";
    statusDiv.className = "status offline";
});

// --- Auth Functions ---

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login Success:", data);
            
            // Server ko login ki detail bhejna
            socket.emit("message", {
                type: "LOGIN_SUCCESS",
                user: data
            });
            alert("Logged In & Data Sent to Socket!");
        } else {
            alert("Login Failed: " + data.message);
        }
    } catch (error) {
        console.error("Login Fetch Error:", error);
    }
}

async function refreshToken() {
    try {
        const response = await fetch(`${AUTH_URL}/refresh/token`, {
            method: "POST",
            credentials: "include"
        });
        const data = await response.json();
        console.log("Token Refresh Response:", data);
        alert("Refresh Token Called!");
    } catch (error) {
        console.error("Refresh Error:", error);
    }
}

async function logout() {
    try {
        await fetch(`${AUTH_URL}/logout`, {
            method: "POST",
            credentials: "include"
        });
        console.log("Logged Out");
        socket.disconnect(); // Socket band karo
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

// --- Message Handling ---

const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const messagesList = document.getElementById('messages');

sendBtn.addEventListener('click', () => {
    const msg = messageInput.value;
    if (msg && socket.connected) {
        socket.emit("message", msg);
        messageInput.value = "";
    }
});

socket.on("reply", (data) => {
    const li = document.createElement('li');
    li.innerText = data;
    messagesList.appendChild(li);
});
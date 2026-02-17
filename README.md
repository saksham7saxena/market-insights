# Market Insights AI

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)
![Ollama](https://img.shields.io/badge/AI-Ollama-black)

A privacy-focused, full-stack financial assistant application that leverages local Large Language Models (LLMs) via Ollama. This project demonstrates a modern microservices architecture using **Docker**, **Node.js**, and **React**.

## 🚀 Overview

Market Insights is designed to provide users with a conversational interface to explore financial concepts. Unlike cloud-based solutions, this application runs entirely locally (optional), ensuring data privacy and zero inference costs.

**Key Features:**
-   **Local Inference**: Powered by [Ollama](https://ollama.com/), supporting models like `llama3.1` and `mistral`.
-   **Streaming Responses**: Real-time token streaming from the backend to the React frontend for a responsive UX.
-   **Containerized Architecture**: Fully dockerized backend and frontend for consistent deployment.
-   **Modern Tech Stack**:
    -   **Frontend**: React (SPA), CSS3 animations.
    -   **Backend**: Node.js (Express), Server-Sent Events (SSE).
    -   **Infrastructure**: Docker Compose, Nginx (production build serving).

## 🛠️ Architecture

The application consists of three main components:

1.  **Frontend Service (`frontend/`)**: A React application that handles user interaction, chat state, and renders streaming responses. It is served via Nginx in the Docker setup.
2.  **Backend Service (`backend/`)**: An Express.js server that acts as an API gateway. It manages communication with the Ollama instance, handles CORS, and streams LLM responses back to the client.
3.  **LLM Service (Ollama)**: Running on the host machine (or a separate container), providing the inference API.

## 📋 Prerequisites

-   **Docker Desktop**: Installed and running.
-   **Ollama**: Installed locally.
    -   Run `ollama serve` in a terminal.
    -   Pull a model: `ollama pull llama3.1` (or your preferred model).

## ⚡ Quick Start (Docker)

The easiest way to run the application is using Docker Compose.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/saksham7saxena/market-insights.git
    cd market-insights
    ```

2.  **Start the services**
    ```bash
    docker compose up --build
    ```
    *This will build the backend and frontend images and start the containers.*

3.  **Access the Application**
    -   Frontend: [http://localhost:3000](http://localhost:3000)
    -   Backend Health Check: [http://localhost:8000/health](http://localhost:8000/health)

## 🔧 Environment Configuration

The application is pre-configured for a standard Docker setup. However, you can modify behavior via environment variables.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `OLLAMA_URL` | URL of the Ollama API | `http://host.docker.internal:11434/api/chat` (Docker) <br> `http://localhost:11434/api/chat` (Local) |
| `PORT` | Backend server port | `8000` |

### Networking Note
In `docker-compose.yml`, the `host.docker.internal:host-gateway` mapping is used to allow the containerized backend to communicate with the Ollama instance running on your host machine.

## 📦 Manual Setup (Development)

If you prefer running without Docker:

1.  **Backend**
    ```bash
    cd backend
    npm install
    npm start
    ```
2.  **Frontend**
    ```bash
    cd frontend
    npm install
    npm start
    ```

## 🐛 Troubleshooting

**"Ollama API error" or Connection Refused:**
-   Ensure Ollama is running (`ollama serve`).
-   Verify you have the model pulled (`ollama list`).
-   If using Docker, ensure `host.docker.internal` is reachable. On Linux, you may need to check your firewall settings or use `--network host`.

**Market Data Accuracy:**
-   *Note*: Real-time stock data tools have been disabled to ensure stability across different network environments. The model answers based on its internal knowledge base.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

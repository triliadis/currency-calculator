# Setup Instructions

## Prerequisites: Install Docker and Docker Compose
1. Download and install **Docker Desktop** from [Docker's official website](https://www.docker.com/products/docker-desktop).
2. Ensure that Docker Compose is included (it comes pre-installed with Docker Desktop).

## Project File Setup
1. Extract the project files attached in the email (e.g., `docker-compose.yml` and `.env`) into the same directory.
2. The provided `.env` file contains the required environment variables. If needed, you can create your own `.env` file using the same format.
3. You can find the full project [here](https://github.com/triliadis/currency-calculator).

## Running the Application
1. Open a terminal and navigate to the project’s root directory.
2. Execute the following command:
   ```bash
   docker-compose up
    ```
3. Docker will:
   - Pull the required images (this process may take some time for the frontend, backend, and database images).
   - Build and launch the containers for the backend, frontend, and database services.
   - Automatically seed the database with initial test data.

## Accessing the Application
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## Key Features
- **Backend**:
  - Authentication APIs for login and registration.
  - CRUD operations for currency management.
  - Currency conversion API.
- **Frontend**:
  - Responsive user interface design to interact with the backend api.
- **Documentation**:
  - Swagger-generated API documentation.

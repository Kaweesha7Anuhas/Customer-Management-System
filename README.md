# Customer Management System (CMS)

A full-stack, responsive Customer Management System built to handle real-world business requirements including dynamic search, dashboard analytics, and robust data validation. Developed utilizing a layered enterprise architecture to ensure scalability and clean code principles.

## 🚀 Features

*   **Interactive Dashboard:** Real-time statistics tracking total, active, inactive, individual, and business customers.
*   **Full CRUD Operations:** Create, Read, Update, and Delete customer records dynamically without page reloads.
*   **Live Search & Filtering:** Case-insensitive search by name, email, or code, combinable with dropdown filters for Type and Status.
*   **Comprehensive Validation:** Jakarta Bean Validation (`@Valid`) on the backend with dynamic UI error highlighting on the frontend.
*   **Global Exception Handling:** Custom `@RestControllerAdvice` intercepting duplicate records (409) and bad requests (400) to return clean JSON error messages.
*   **Responsive UI:** Mobile-first design utilizing Bootstrap 5 grid utilities, ensuring the table and forms scale perfectly from desktop monitors to smartphone screens.
*   **Dedicated Profile View:** Read-only customer profile cards for quick data access.

## 🛠️ Tech Stack

**Backend**
*   Java 17 (Oracle JDK 17.0.12)
*   Spring Boot 3.3.x
*   Spring Data JPA (Hibernate)
*   MySQL Server 8.0
*   Apache Maven 3.9.9

**Frontend**
*   HTML5 & CSS3
*   Bootstrap 5 (UI Framework)
*   jQuery 3.7.1 & AJAX (Asynchronous API Communication)
*   FontAwesome (Iconography)

## 🏗️ Architecture

The backend strictly follows a layered architecture pattern:
1.  **Controller Layer:** Thin REST endpoints handling HTTP routing and parameter extraction.
2.  **Service Layer:** Core business logic, validation rules, and DTO mapping.
3.  **Repository Layer:** Database interaction using Spring Data JPA and custom JPQL queries.
4.  **Data Transfer Objects (DTOs):** Secure payloads preventing direct exposure of internal database entities.

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/customers/stats` | Retrieve aggregated dashboard statistics |
| `GET` | `/api/customers/search` | Search and filter customers via query params |
| `GET` | `/api/customers` | Fetch all customers |
| `GET` | `/api/customers/{id}` | Fetch a single customer by ID |
| `POST` | `/api/customers` | Create a new customer |
| `PUT` | `/api/customers/{id}` | Update an existing customer |
| `DELETE` | `/api/customers/{id}` | Delete a customer |

## ⚙️ Local Setup Instructions

### Prerequisites
*   Java 17 installed and configured in your environment variables.
*   MySQL Server 8.0 running locally.
*   Maven installed.

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR-USERNAME/Customer-Management-System.git](https://github.com/YOUR-USERNAME/Customer-Management-System.git)
    cd customermanagement
    ```

2.  **Configure the Database:**
    Open MySQL Workbench and create a new schema:
    ```sql
    CREATE DATABASE customermanagement;
    ```
    *(Note: Hibernate will automatically generate the required tables upon application startup.)*

3.  **Update application properties:**
    Navigate to `src/main/resources/application.properties` and verify your MySQL credentials:
    ```properties
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```

4.  **Run the application:**
    Open a terminal at the project root and execute:
    ```bash
    mvn spring-boot:run
    ```

5.  **Access the application:**
    Open your web browser and navigate to `http://localhost:8080`
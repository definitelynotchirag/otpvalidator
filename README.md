# OTP Validator App

A secure OTP (One-Time Password) validator application with a frontend for OTP input and a backend for OTP generation, verification, and user session management.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Frontend Specifications](#frontend)
- [Backend Specifications](#backend)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

---

## Project Overview
The OTP Validator app is designed to provide a simple, secure, and intuitive OTP validation experience. The frontend features a 4-digit OTP input system that automatically processes entries once complete, with an option to verify manually if desired. The backend securely manages OTP generation, verification, user sessions, and access tokens.

---

## Features
1. **4-Digit OTP Input System** with individual boxes for each digit.
2. **Automatic Submission** upon OTP completion, with a manual "Verify" option.
3. **Secure Session Management** and OTP validation in the backend.
4. **Access Token-based Security** for authenticated operations.
5. **Error Feedback and Timeout Handling** on invalid OTP entries.

---

## Frontend

### OTP Input System
- A 4-digit OTP input system with each digit placed in an individual input box, styled to enhance user focus on each box.
- Users can type digits directly into each input box.
- A "Submit" button is provided, disabled until all four digits are entered.
- Automatic processing of OTP once all four boxes are filled.

### Additional Features
- **Automatic Processing**: Automatically processes OTP input once all four digits are entered.
- **Timer**: Implements a countdown timer to prevent immediate OTP re-submission.
- **Error Handling**: Provides a shake animation as feedback for incorrect OTP inputs.

### Styling and Animation
- **CSS Framework**: Tailwind CSS for modern styling.
- **Keyframes**: CSS keyframes for shake animation upon invalid OTP submission.

---

## Backend

### OTP Verification
- **Session Management**:
  - Secure session management per user by using token in frontend
  - Each user session is tracked and managed securely in the backend.
- **Database Usage**:
  - Stores user data securely upon OTP login.
  - Manages secure storage of user sessions, with data fetched as needed for the frontend.

### Access Token
- **Security**:
  - Each user is assigned a secure "Access Token" for authenticated actions.
  - Access Tokens are not exposed on the frontend and are used internally by the backend.

---

## Setup and Installation

### Prerequisites
- Node.js and npm installed.
- Database setup (MongoDB or another supported database).
- API keys or credentials if using external services.

### Installation Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/otpvalidator
   cd otpvalidator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add necessary variables, such as:
     ```env
     MONGO_URI=<Your-Database-URL>
     TOKEN_SECRET=<Your-JWT-Secret>
     ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

---

## Usage

1. **Access the OTP Input Page**: Enter the 4-digit OTP in individual input boxes.
2. **Verify OTP**: The app will auto-submit the OTP once all boxes are filled, or you can click "Submit" to submit manually.
3. **Session Handling**: The backend securely manages each user session with a unique access token for authenticated operations.

---

## Technologies Used

- **Frontend**: NextJs, React, Tailwind CSS, Vanilla CSS for animations.
- **Backend**: Node.js, Next server side functions, JWT for access token management.
- **Database**: MongoDB

---

## License
MIT License


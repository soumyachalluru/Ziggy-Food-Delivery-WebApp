# Ziggy - Food Delivery Web Application

## Introduction
This repository contains a food delivery web application similar to UberEats. This application serves two main user personas: Customers and Restaurants, providing them with a full suite of features to interact with the system efficiently.

## Features

### Customer Features:
- **Account Management:** Sign up, sign in/out, and manage profile details.
- **Restaurant Interaction:** View restaurant details, menus, and mark favorites.
- **Order Management:** Place orders, view carts, checkout, and track order status.

### Restaurant Features:
- **Account Management:** Sign up, sign in/out, and manage restaurant profile.
- **Menu Management:** Add, edit, and remove dishes.
- **Order Fulfillment:** View, manage, and update the status of customer orders.

## Tech Stack
- **Frontend:** ReactJS
- **Backend:** Django
- **Database:** SQL (PostgreSQL or similar)

## Non-Functional Requirements
- **Responsiveness:** The application is responsive and works seamlessly across mobile, tablet, and desktop devices.
- **Accessibility:** Implements semantic HTML and keyboard navigation support.
- **Scalability:** Optimized for performance with considerations for increasing user load.

## Local Development
To set up and run the application locally, follow these steps:
## How to run

### Backend
1. `cd Backend`
2. `python -m venv env`
3. `env/scripts/activate.sh`
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

### Frontend
1. `cd Frontend/ziggy-client`
2. `npm install`
3. `npm run dev`

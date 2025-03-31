# Zenblen Smoothie Kiosk

Zenblen is an interactive smoothie kiosk application where users can browse smoothies, customize them with add-ins, and place orders for checkout. This project leverages **React** for the frontend and **Supabase** for authentication and database management.

## Features

- **Smoothie Menu**: Browse smoothies with their images, ingredients, and prices.
- **Add-ins Customization**: Customize your smoothie by adding ingredients like Collagen or Chia Seeds.
- **Shopping Cart**: Add customized smoothies to your cart and view them.
- **Authentication**: Login via **Guest User**, **Returning User** (via phone number), or **Admin** (via password).
- **Responsive UI**: The application is responsive for mobile and desktop users.

## Technologies Used

- **Frontend**: React, React Router
- **Backend**: Supabase (PostgreSQL, Authentication, and Database)
- **Styling**: Custom CSS (optionally Tailwind CSS for utility classes)
- **Icons**: React Icons for UI components

## Dependencies

To run this project, you will need to install the following dependencies:

- **React**: JavaScript library for building user interfaces.
- **React Router**: Declarative routing for React.
- **Supabase**: Open-source Firebase alternative to manage authentication and database.
- **Axios**: Promise-based HTTP client for making requests (optional for external calls).
- **React Icons**: For adding iconography to the UI.

Run the following to install dependencies:

```bash
npm install
# or
yarn install

npm install react react-router-dom supabase axios
# or if you're using Yarn
yarn add react react-router-dom supabase axios

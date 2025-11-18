# IMSS Dashboard Web Application

> This repository contains the source code for the IMSS Dashboard Web Application, which provides a user-friendly interface for monitoring and managing various aspects of the IMSS registry system.

## Project Structure

- `frontend/`: Contains the React-based frontend application.
- `backend/`: Contains the Node.js/Express backend server.
By potenciANO lopez perez

## Getting Started

To get started with the IMSS Dashboard Web Application, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/diegodev18/imss-dashboard-web
   ```

2. **Navigate to the project directory:**

   ```bash
   cd imss-dashboard-web
   ```

3. **Install dependencies:**

   ```bash
   pnpm install --frozen-lockfile
   ```

4. **Build the application:**

   ```bash
   pnpm --filter frontend run build
   pnpm --filter backend run build
   ```

5. **Start the application:**

   ```bash
   pnpm --filter frontend run preview
   pnpm --filter backend run start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

# Rumsan Hulaak

Rumsan Hulaak is an open-source, disposable email service designed to handle email reception on port 25.
It is similar to [Mailinator](https://mailinator.com) service. It comes with a robust REST API to manage email inboxes, making it ideal for testing and temporary email needs. With Hulaak, developers can seamlessly manage disposable email accounts and interact with inboxes via a simple API.

## Features

- Receive emails on port 25.
- Disposable email inboxes for testing and temporary use.
- Easy to manage email inboxes through a REST API.
- Manage domains and settings for email handling.

## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rumsan/hulaak.git
   ```

2. Navigate to the project directory:

   ```bash
   cd hulaak
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment variables:
   Create a `.env` file to configure the SMTP and database settings.

   Example `.env` file:

   ```bash
   PORT=3523
   DATABASE_URL=file:../.data/db/hulaak.db
   ```

## Start the application

Run `npx nx serve hulaak` to start the development server.

## Build for production

Run `npx nx build hulaak` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Connect with us!

- [Join the community](https://rumsan.com)
- [Follow us on LinkedIn](https://www.linkedin.com/company/rumsan)

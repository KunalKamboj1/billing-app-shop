# Shopify Billing App

A Shopify app that allows you to bill stores for your services on a monthly and one-time charge basis.

## Features

- Multiple subscription plans (Basic, Pro, Enterprise)
- Monthly recurring billing
- Clean and modern UI using Shopify Polaris
- Easy plan selection and management
- Secure payment processing through Shopify

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Shopify Partner account
- A development store

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd app-billing-shop
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=your_app_url
DATABASE_URL=your_database_url
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

1. Build the app:
```bash
npm run build
```

2. Deploy to your hosting platform (e.g., Heroku, DigitalOcean, etc.)

3. Update your app's URL in the Shopify Partner Dashboard to point to your deployed app

## Development

- The app uses Remix for the framework
- Polaris for the UI components
- Shopify App Bridge for authentication and API calls

## Project Structure

```
app-billing-shop/
├── app/
│   ├── components/
│   │   └── BillingPlans.jsx
│   ├── routes/
│   │   ├── app._index.jsx
│   │   └── api.billing.jsx
│   └── shopify.server.js
├── prisma/
│   └── schema.prisma
└── public/
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

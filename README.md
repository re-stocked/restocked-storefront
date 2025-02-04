<h1>Mercur storefront</h1>

## Quickstart

### Instalation
Clone the repository

```js
git clone https://github.com/mercurjs/b2c-marketplace-storefront.git
```
&nbsp;

Go to directory
```js
cd b2c-marketplace-storefront
```
&nbsp;

Install dependencies
```js
npm install
```
&nbsp;

Make a .env.local file and copy the code below
```js
// API URL
MEDUSA_BACKEND_URL=http://localhost:9000
// Your publishable key generated in mercur admin panel
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=
// Your public url
NEXT_PUBLIC_BASE_URL=http://localhost:3000
// Default region
NEXT_PUBLIC_DEFAULT_REGION=gb
// Stripe payment key. It can be random string, don't leave it empty.
NEXT_PUBLIC_STRIPE_KEY=supersecret
// Backend's cookie secret
REVALIDATE_SECRET=supersecret
// Your site name in metadata
NEXT_PUBLIC_SITE_NAME="Fleek Marketplace" 
// Your site description in metadata
NEXT_PUBLIC_SITE_DESCRIPTION="Fleek Markeplace"  
```
&nbsp;

Start storefront
```js
npm run dev
```

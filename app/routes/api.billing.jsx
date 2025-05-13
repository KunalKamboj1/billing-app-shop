import { authenticate } from "../shopify.server";
import { redirect } from "@remix-run/node";

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const { planId, shop: shopFromBody } = await request.json();
  const shop = session?.shop || shopFromBody;

  // If shop is missing, redirect to login or return error
  if (!shop) {
    return { error: "No valid shop. Please reload the app from your Shopify admin." };
  }

  try {
    if (planId === "one-time") {
      // Handle one-time charge
      const response = await admin.graphql(
        `#graphql
          mutation appPurchaseOneTimeCreate($name: String!, $price: MoneyInput!, $returnUrl: URL!, $test: Boolean) {
            appPurchaseOneTimeCreate(
              name: $name
              price: $price
              returnUrl: $returnUrl
              test: $test
            ) {
              appPurchaseOneTime {
                id
                name
                status
              }
              confirmationUrl
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          variables: {
            name: "One-Time Setup",
            price: { amount: "100.00", currencyCode: "USD" },
            returnUrl: `${process.env.SHOPIFY_APP_URL}/app`,
            test: process.env.NODE_ENV !== "production",
          },
        }
      );

      const responseJson = await response.json();
      return responseJson.data.appPurchaseOneTimeCreate;
    } else {
      // Handle recurring subscription
      const response = await admin.graphql(
        `#graphql
          mutation appSubscriptionCreate($name: String!, $returnUrl: URL!, $trialDays: Int, $test: Boolean, $lineItems: [AppSubscriptionLineItemInput!]!) {
            appSubscriptionCreate(
              name: $name
              returnUrl: $returnUrl
              trialDays: $trialDays
              test: $test
              lineItems: $lineItems
            ) {
              appSubscription {
                id
                name
                status
                currentPeriodEnd
              }
              confirmationUrl
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          variables: {
            name: `${planId} Plan`,
            returnUrl: `${process.env.SHOPIFY_APP_URL}/app`,
            trialDays: 0,
            test: process.env.NODE_ENV !== "production",
            lineItems: [
              {
                plan: {
                  appRecurringPricingDetails: {
                    price: { amount: getPlanPrice(planId), currencyCode: "USD" },
                    interval: "EVERY_30_DAYS",
                  },
                },
              },
            ],
          },
        }
      );

      const responseJson = await response.json();
      return responseJson.data.appSubscriptionCreate;
    }
  } catch (error) {
    console.error("Error creating subscription:", error);
    return { error: "Failed to create subscription" };
  }
};

function getPlanPrice(planId) {
  const prices = {
    starter: "10.00",
    growth: "30.00",
    business: "60.00",
    "one-time": "100.00",
  };
  return prices[planId] || "10.00";
} 
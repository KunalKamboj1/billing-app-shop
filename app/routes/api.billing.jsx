import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { planId, shop } = await request.json();

  try {
    if (planId === "one-time") {
      // Handle one-time charge
      const response = await admin.graphql(
        `#graphql
          mutation appUsageRecordCreate($subscriptionLineItemId: ID!, $quantity: Int!) {
            appUsageRecordCreate(
              subscriptionLineItemId: $subscriptionLineItemId
              quantity: $quantity
            ) {
              appUsageRecord {
                id
                quantity
                createdAt
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          variables: {
            subscriptionLineItemId: "one-time-setup",
            quantity: 1,
          },
        }
      );

      const responseJson = await response.json();
      return responseJson.data.appUsageRecordCreate;
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
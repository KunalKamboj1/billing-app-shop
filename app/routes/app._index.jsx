import { BillingPlans } from "../components/BillingPlans";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return { shop: session?.shop || null };
};

export default function Index() {
  const { shop } = useLoaderData();
  return <BillingPlans shop={shop} />;
}

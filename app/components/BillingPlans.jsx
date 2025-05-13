import {
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Button,
  Banner,
  Layout,
  Page,
} from "@shopify/polaris";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";

const plans = [
  {
    id: "starter",
    name: "Starter Plan",
    price: "$10",
    interval: "month",
    features: ["Basic features", "Email support", "1GB storage"],
  },
  {
    id: "growth",
    name: "Growth Plan",
    price: "$30",
    interval: "month",
    features: ["All Starter features", "Priority support", "5GB storage", "Basic analytics"],
  },
  {
    id: "business",
    name: "Business Plan",
    price: "$60",
    interval: "month",
    features: ["All Growth features", "24/7 support", "20GB storage", "Advanced analytics"],
  },
  {
    id: "one-time",
    name: "One-Time Setup",
    price: "$100",
    interval: "one-time",
    features: ["Initial setup", "Configuration", "Training session", "30 days support"],
  },
];

export function BillingPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setError(null);
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.confirmationUrl) {
        // Redirect to Shopify's confirmation page (embedded app safe)
        window.top.location.href = data.confirmationUrl;
      } else {
        setShowSuccess(true);
      }
    } catch (err) {
      setError("Failed to process subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page title="Billing Plans">
      {error && (
        <Banner
          title="Error"
          status="critical"
          onDismiss={() => setError(null)}
        >
          {error}
        </Banner>
      )}
      {showSuccess && (
        <Banner
          title="Success"
          status="success"
          onDismiss={() => setShowSuccess(false)}
        >
          Your plan has been updated successfully!
        </Banner>
      )}
      <Layout>
        <Layout.Section>
          <Card>
            <ResourceList
              items={plans}
              renderItem={(plan) => (
                <ResourceItem
                  id={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  selected={selectedPlan === plan.id}
                >
                  <div style={{ padding: "1rem" }}>
                    <Text variant="headingMd" as="h3">
                      {plan.name}
                    </Text>
                    <Text variant="headingLg" as="h2">
                      {plan.price}
                      {plan.interval !== "one-time" && (
                        <Text variant="bodyMd" as="span">
                          /{plan.interval}
                        </Text>
                      )}
                    </Text>
                    <ul>
                      {plan.features.map((feature, index) => (
                        <li key={index}>
                          <Text variant="bodyMd">{feature}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ResourceItem>
              )}
            />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
              primary
              disabled={!selectedPlan || isLoading}
              onClick={handleSubscribe}
              loading={isLoading}
            >
              {selectedPlan === "one-time" ? "Purchase Setup" : "Subscribe to Selected Plan"}
            </Button>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
} 
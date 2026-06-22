import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AgentOnboardingForm from "@/components/agent-onboarding/AgentOnboardingForm";

const AgentOnboardingApplication = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Helmet>
        <title>New Agent Onboarding Application | The Financial Architects</title>
        <meta
          name="description"
          content="Complete your TFA agent contracting and onboarding application — licensing, E&O, AML, background, employment, and direct deposit."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <AgentOnboardingForm />
    </>
  );
};

export default AgentOnboardingApplication;
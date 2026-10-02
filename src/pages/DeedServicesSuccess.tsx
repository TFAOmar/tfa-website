import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SEOHead } from "@/components/seo";
import { supabase } from "@/integrations/supabase/client";
import tfaLogo from "@/assets/tfa-logo.png";

export default function DeedServicesSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const requestId = params.get("request");
  const [state, setState] = useState<"loading" | "ok" | "unpaid" | "error">(sessionId ? "loading" : "ok");
  const [ref, setRef] = useState(requestId ? requestId.slice(0, 8).toUpperCase() : "");

  useEffect(() => {
    if (!sessionId) return;
    supabase.functions.invoke("verify-deed-payment", { body: { sessionId } }).then(({ data, error }) => {
      if (error || !data) return setState("error");
      setRef(data.ref ?? "");
      setState(data.paid ? "ok" : "unpaid");
    });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <SEOHead title="Request received | The Financial Architects" description="Your deed services request was received." noIndex />
      <header className="bg-card border-b"><div className="max-w-3xl mx-auto px-4 py-4"><img src={tfaLogo} alt="The Financial Architects" className="h-9" /></div></header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border bg-card p-8 text-center">
          {state === "loading" && <><Loader2 className="h-8 w-8 animate-spin mx-auto text-navy mb-4" /><p>Confirming your payment…</p></>}
          {state === "ok" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-bold text-navy mb-2">Request received</h1>
              {ref && <p className="text-sm text-muted-foreground mb-3">Request #{ref}</p>}
              <p className="text-muted-foreground mb-6">Our Legal Document Assistants have your information and documents. We'll reach out if anything else is needed, and with the notary quote if you requested one.</p>
              <Link to="/" className="text-navy font-medium hover:underline">Return home</Link>
            </>
          )}
          {state === "unpaid" && <><h1 className="font-serif text-2xl font-bold text-navy mb-2">Payment not completed</h1><p className="text-muted-foreground mb-4">We didn't receive payment for request #{ref}. <Link to="/deed-services" className="underline">Start again</Link> or call (888) 350-5396.</p></>}
          {state === "error" && <><h1 className="font-serif text-2xl font-bold text-navy mb-2">We couldn't confirm your payment</h1><p className="text-muted-foreground">If you were charged, your request is safe — please call (888) 350-5396 and we'll confirm it.</p></>}
        </div>
      </main>
    </div>
  );
}

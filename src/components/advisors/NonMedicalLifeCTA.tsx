import { Link } from "react-router-dom";
import { FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NonMedicalLifeCTAProps {
  advisorSlug: string;
  className?: string;
}

const NonMedicalLifeCTA = ({ advisorSlug, className }: NonMedicalLifeCTAProps) => (
  <Link to={`/advisors/${advisorSlug}/non-medical-life`} className={className}>
    <Button
      size="lg"
      variant="outline"
      className="border-accent bg-transparent text-accent hover:bg-accent/20"
    >
      <FileCheck className="mr-2 h-5 w-5" />
      Apply for Non-Medical Term Life
    </Button>
  </Link>
);

export default NonMedicalLifeCTA;
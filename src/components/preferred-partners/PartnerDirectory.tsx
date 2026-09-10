import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { partnerCategories } from "./partnerCategories";
import PartnerCard from "./PartnerCard";
import { usePreferredPartners } from "@/hooks/usePreferredPartners";

const PartnerDirectory = () => {
  const { data: partners = [], isLoading } = usePreferredPartners();
  const [active, setActive] = useState<string>("all");

  const usedCategories = useMemo(
    () => partnerCategories.filter((c) => partners.some((p) => p.category === c.id)),
    [partners]
  );

  const visible = active === "all" ? partners : partners.filter((p) => p.category === active);

  if (!isLoading && partners.length === 0) return null;

  return (
    <section id="partner-directory" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Preferred Partners
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Licensed professionals we know, trust, and refer our own clients to.
          </p>
        </div>

        {usedCategories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Button
              variant={active === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActive("all")}
            >
              All Partners
            </Button>
            {usedCategories.map((category) => (
              <Button
                key={category.id}
                variant={active === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActive(category.id)}
              >
                <category.icon className="mr-1.5 h-4 w-4" />
                {category.short}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnerDirectory;

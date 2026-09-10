import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { partnerCategories } from "./partnerCategories";
import { partnerPhoto, type PreferredPartner } from "@/hooks/usePreferredPartners";

const PartnerCard = ({ partner }: { partner: PreferredPartner }) => {
  const category = partnerCategories.find((c) => c.id === partner.category);
  const photo = partnerPhoto(partner);
  const location = [partner.city, partner.state].filter(Boolean).join(", ");

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
      <div className="aspect-[4/3] bg-secondary/40 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={`${partner.name}, preferred partner`}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
            {partner.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {category && (
          <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3">
            <category.icon className="h-3.5 w-3.5" />
            {category.short}
          </span>
        )}
        <h3 className="text-xl font-bold text-foreground">{partner.name}</h3>
        {(partner.title || partner.company) && (
          <p className="text-sm text-muted-foreground mt-1">
            {[partner.title, partner.company].filter(Boolean).join(" • ")}
          </p>
        )}
        {location && (
          <p className="text-sm text-muted-foreground mt-2 inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {location}
          </p>
        )}
        {partner.bio && (
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3">
            {partner.bio}
          </p>
        )}

        <Button asChild variant="outline" className="mt-5 w-full">
          <Link to={`/preferred-partners/${partner.slug}`}>
            View Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PartnerCard;

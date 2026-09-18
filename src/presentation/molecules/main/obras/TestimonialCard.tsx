import { Quote, UserRound } from "lucide-react";

import { RatingStars } from "@/presentation/atoms/main/obras/RatingStars";

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  rating: number;
  ratingLabel: string;
}

export function TestimonialCard({
  quote,
  authorName,
  authorRole,
  authorCompany,
  rating,
  ratingLabel,
}: TestimonialCardProps) {
  return (
    <figure className="flex h-full flex-col justify-between gap-2 rounded-xl border border-gray-100/80 bg-white p-3.5 shadow-sm">
      <Quote aria-hidden className="size-5 fill-[#F04400] text-[#F04400]" />
      <blockquote className="text-xs leading-snug font-normal text-pretty text-[#282828] italic">
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        {/* TODO: foto real del cliente */}
        <div
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-graphite text-white"
        >
          <UserRound className="size-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-foreground">{authorName}</p>
          <p className="text-[10px] leading-tight text-gray-500">
            {authorRole} · {authorCompany}
          </p>
          <RatingStars rating={rating} label={ratingLabel} className="mt-1 gap-0.5 [&_svg]:size-2.5" />
        </div>
      </figcaption>
    </figure>
  );
}

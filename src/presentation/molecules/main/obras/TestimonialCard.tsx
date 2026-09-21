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
    <figure className="flex h-full min-w-0 flex-col justify-between gap-5 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm lg:p-7">
      <div className="flex flex-col gap-4">
        <Quote aria-hidden className="size-7 fill-[#F04400] text-[#F04400]" />
        <blockquote className="text-sm leading-relaxed font-normal text-pretty text-[#282828] italic lg:text-[15px]">
          {quote}
        </blockquote>
      </div>

      <figcaption className="flex items-center gap-3">
        {/* TODO: foto real del cliente */}
        <div
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-graphite text-white"
        >
          <UserRound className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{authorName}</p>
          <p className="text-xs leading-snug text-gray-500">
            {authorRole} · {authorCompany}
          </p>
          <RatingStars rating={rating} label={ratingLabel} className="mt-1.5 gap-0.5 [&_svg]:size-3.5" />
        </div>
      </figcaption>
    </figure>
  );
}
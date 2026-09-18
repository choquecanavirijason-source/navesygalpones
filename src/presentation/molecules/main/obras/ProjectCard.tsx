import Image from "next/image";

export interface ProjectCardProps {
  /** Ruta de la foto en `public/`. */
  image: string;
  name: string;
  location: string;
  size: string;
}

/** Tarjeta de una obra: alto uniforme; la foto arriba y la ubicación/superficie siempre al pie. */
export function ProjectCard({ image, name, location, size }: ProjectCardProps) {
  return (
    <article className="flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="relative aspect-video w-full flex-shrink-0 bg-graphite">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 60vw"
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-2.5">
        <h3 className="line-clamp-2 min-h-[2rem] text-xs leading-snug font-bold text-[#282828]">{name}</h3>
        <div className="mt-auto pt-1.5 text-[10px] leading-tight text-[#6D6D6D]">
          <p>{location}</p>
          <p className="mt-0.5">{size}</p>
        </div>
      </div>
    </article>
  );
}

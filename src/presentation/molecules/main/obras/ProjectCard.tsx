import Image from "next/image";

export interface ProjectCardProps {
  /** Ruta de la foto en `public/`. */
  image: string;
  name: string;
  location: string;
  size: string;
}

/** Tarjeta apaisada de una obra: foto 16:10 y texto mínimo debajo, sin alturas artificiales. */
export function ProjectCard({ image, name, location, size }: ProjectCardProps) {
  return (
    <article className="inline-block h-auto w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-graphite">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 60vw"
          className="rounded-t-xl object-cover object-center"
        />
      </div>
      <div className="rounded-b-xl bg-white p-2">
        <h3 className="text-xs leading-tight font-bold break-words text-[#282828]">{name}</h3>
        <p className="mt-0.5 text-[10px] leading-tight text-[#6D6D6D]">{location}</p>
        <p className="text-[10px] leading-tight text-[#6D6D6D]">{size}</p>
      </div>
    </article>
  );
}

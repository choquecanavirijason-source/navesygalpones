"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/presentation/atoms/layout/Container";
import { HeroCtaGroup } from "@/presentation/molecules/main/hero/HeroCtaGroup";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─── Clips ──────────────────────────────────────────────────────────────── */

/*
 * Los dos clips son versiones re-encodeadas con un keyframe cada 4 frames. Los originales traían
 * 1 y 2 keyframes en todo el clip, y escrubear con GOP largo obliga al navegador a decodificar
 * la cadena entera desde el keyframe anterior en cada seek: eso es lo que se ve a tirones.
 * Para regenerar cualquiera de los dos:
 * ffmpeg -i <origen>.mp4 -an -c:v libx264 -preset slow -crf 23 -g 4 -keyint_min 4 \
 *        -sc_threshold 0 -movflags +faststart <destino>.mp4
 */

/** Clip 1 (`desde_el_segundo_no_hay_mu.mp4`): abre el recorrido, del arranque al segundo 7. */
const CLIP_A_SRC = "/videos/hero-scrub-1.mp4";
const CLIP_A_START_S = 0;
const CLIP_A_END_S = 7;
const CLIP_A_USABLE_S = CLIP_A_END_S - CLIP_A_START_S;

/** Clip 2 (`hero.mp4`): cierra el recorrido, retomando en el segundo 7 hasta el final. */
const CLIP_B_SRC = "/videos/hero-scrub-2.mp4";
const CLIP_B_START_S = 7;
/** No se escrubea hasta el último frame exacto, donde el decodificador tiende a colgarse. */
const CLIP_B_END_S = 9.95;
const CLIP_B_USABLE_S = CLIP_B_END_S - CLIP_B_START_S;

/** Duración real de los archivos (ffprobe). Solo actúa de respaldo si `duration` aún es NaN. */
const CLIP_DURATION_S = 10;

const USABLE_TOTAL_S = CLIP_A_USABLE_S + CLIP_B_USABLE_S;
/**
 * Punto de corte, proporcional a la duración usable de cada clip: el scroll no se reparte a
 * mitades sino según cuánto video tiene cada uno, para que el ritmo no cambie al cruzar.
 */
const SPLIT = CLIP_A_USABLE_S / USABLE_TOTAL_S;
/** Ventana del cruce, en unidades de progreso total. Corta a propósito: es un corte, no una disolvencia. */
const CROSSFADE_PROGRESS = 0.05;

/* ─── Recorrido de scroll ────────────────────────────────────────────────── */

/** Alturas de viewport que dura el pin. Más alto = más cinemático (y menos video por píxel de scroll). */
const SCROLL_VH_MULTIPLIER = 3;
/**
 * fps reales del material (ffprobe): con un valor mayor el guard de seek deja pasar seeks que
 * ni siquiera cambian de frame, y cada uno cuesta una re-decodificación.
 */
const VIDEO_FPS = 24;
const SEEK_EPSILON_S = 1 / VIDEO_FPS;
/*
 * El brief asumía Lenis suavizando el scroll globalmente; este proyecto no lo tiene, así que el
 * progreso llega en escalones: cada notch de rueda son ~100 px, o sea varios frames de golpe.
 * Un scrub corto reparte ese salto en el tiempo. No conviene subirlo mucho más: pasando ~0.6 s
 * el video se siente despegado del scroll, que es justo lo que la regla original quería evitar.
 */
const SCRUB_SMOOTHING_S = 0.4;

/* ─── Fundidos derivados del progreso ────────────────────────────────────── */

const INTRO_FADE_END = 0.22;
const HINT_FADE_END = 0.06;
const OUTRO_FADE_START = 0.86;
const COPY_TRAVEL_PX = 48;
const HINT_TRAVEL_PX = 16;
/** Debajo de esta opacidad la capa deja de capturar clicks, para no tapar los CTAs de la otra. */
const POINTER_OPACITY_THRESHOLD = 0.08;

/* ─── Loop de descanso (cinemagraph) ─────────────────────────────────────── */

const IDLE_PROGRESS_THRESHOLD = 0.995;
const IDLE_DELAY_MS = 500;
/** Ventana del vaivén, medida hacia atrás desde el final del clip 2. */
const LOOP_WINDOW_S = 1.6;
const LOOP_CYCLE_MS = 4200;

/* ─── Carga y loader ─────────────────────────────────────────────────────── */

/** Tiempo mínimo del loader: en local los clips cargan al instante y la marca no se llegaría a ver. */
const LOADER_MIN_MS = 900;
const READY_POLL_MS = 80;
/** Si algo falla en silencio, el hero se revela igual: nunca queda bloqueado de forma permanente. */
const LOAD_FAILSAFE_MS = 8000;
const LOAD_RETRY_DELAY_MS = 400;

interface VideoSeeker {
  seek: (time: number) => void;
  dispose: () => void;
}

/**
 * Seeks con guard de 1 frame y coalescing.
 *
 * El guard: reasignar `currentTime` fuerza una re-decodificación, y el scroll emite muchos más
 * updates por segundo que los fps del video, así que sin el corte la mayoría de los seeks son
 * redundantes.
 *
 * El coalescing: pedir un `currentTime` nuevo mientras el decodificador aún resuelve el anterior
 * encola trabajo que se vuelve obsoleto al instante. Se guarda solo el último objetivo y se
 * aplica al recibir `seeked`, de modo que el video siempre persigue la posición actual del
 * scroll en vez de arrastrar una cola de posiciones viejas.
 */
function createSeeker(video: HTMLVideoElement): VideoSeeker {
  let pending: number | null = null;

  const seek = (time: number) => {
    if (Math.abs(video.currentTime - time) < SEEK_EPSILON_S) return;
    if (video.seeking) {
      pending = time;
      return;
    }
    video.currentTime = time;
  };

  const handleSeeked = () => {
    const next = pending;
    pending = null;
    if (next !== null) seek(next);
  };

  video.addEventListener("seeked", handleSeeked);

  return {
    seek,
    dispose: () => {
      pending = null;
      video.removeEventListener("seeked", handleSeeked);
    },
  };
}

/** Rampa lineal acotada a [0,1]: reemplaza timelines anidadas para derivar fundidos del mismo progreso. */
function ramp(value: number, from: number, to: number): number {
  if (to <= from) return value >= to ? 1 : 0;
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

/**
 * Devuelve la capa a su estado declarado en CSS. El scrub escribe estilos inline que GSAP no
 * conoce (no los creó su contexto), así que no los limpia al revertir: sin esto, apagar el
 * scrub —por ejemplo activando reduced motion en caliente— dejaría el copy congelado invisible.
 */
function resetLayer(node: HTMLElement | null): void {
  if (!node) return;
  node.style.removeProperty("opacity");
  node.style.removeProperty("transform");
  node.style.removeProperty("pointer-events");
}

/** Escritura directa en el nodo: nada de state por frame de scroll. Solo opacity y transform. */
function applyFade(node: HTMLElement | null, opacity: number, travelPx: number): void {
  if (!node) return;
  node.style.opacity = opacity.toFixed(3);
  node.style.transform = `translate3d(0, ${travelPx.toFixed(2)}px, 0)`;

  // `pointer-events` no provoca reflow, pero igual solo se escribe cuando cambia de estado.
  const nextPointerEvents = opacity > POINTER_OPACITY_THRESHOLD ? "auto" : "none";
  if (node.style.pointerEvents !== nextPointerEvents) node.style.pointerEvents = nextPointerEvents;
}

interface HeroScrollytellingSectionProps {
  /** Ancla de la sección; también genera el id del título para `aria-labelledby`. */
  id?: string;
}

/**
 * Hero de scrollytelling: el scroll escrubea dos clips encadenados mientras la sección está
 * pineada —el primero hasta el segundo 7, el segundo desde ahí hasta el final—, cruzando de uno
 * al otro con un fundido corto. Un único ScrollTrigger gobierna los dos videos, los fundidos del
 * copy y el loop de descanso; todo se escribe por refs para no re-renderizar durante el scroll.
 */
export function HeroScrollytellingSection({ id = "inicio" }: HeroScrollytellingSectionProps) {
  const t = useTranslations("Home.hero");
  const tScroll = useTranslations("Home.heroScroll");
  const titleId = `${id}-title`;

  const sectionRef = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const idleTimeoutRef = useRef<number | null>(null);
  const loopFrameRef = useRef<number | null>(null);

  /** `null` = aún sin resolver. Resolverlo durante el render rompería la hidratación. */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean | null>(null);
  const [videosReady, setVideosReady] = useState(false);
  const [loaderElapsed, setLoaderElapsed] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const isStatic = prefersReducedMotion === true;
  const isRevealed = videosReady && loaderElapsed;
  const showLoader = !isStatic && !isRevealed;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Seek inicial de cada clip + progreso de carga real, promediado entre ambos. Todo por sondeo:
  // los eventos del elemento multimedia no son confiables para este caso (ver comentarios).
  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA) return;

    // Cada clip arranca en su propio punto: el B tiene que quedar plantado en el segundo 7 desde
    // el principio, o al cruzar mostraría su frame 0 por un instante.
    const targets: { video: HTMLVideoElement; startAt: number; seekRequested: boolean }[] = [
      { video: videoA, startAt: CLIP_A_START_S, seekRequested: false },
      ...(videoB ? [{ video: videoB, startAt: CLIP_B_START_S, seekRequested: false }] : []),
    ];

    const retryTimeouts = new Map<HTMLVideoElement, number>();

    const poll = window.setInterval(() => {
      let bufferedRatio = 0;
      let allReady = true;

      for (const target of targets) {
        const { video } = target;

        // Un archivo local puede terminar de cargar antes de que React hidrate y enganche
        // `loadedmetadata`. Se sondea `readyState` y se pide el seek UNA sola vez: reasignarlo
        // en cada tick reinicia el seek en curso y el video nunca se asienta.
        if (!target.seekRequested && video.readyState >= HTMLMediaElement.HAVE_METADATA) {
          target.seekRequested = true;
          video.currentTime = target.startAt;
        }

        const duration =
          Number.isFinite(video.duration) && video.duration > 0 ? video.duration : CLIP_DURATION_S;
        if (video.buffered.length > 0) {
          bufferedRatio += Math.min(1, video.buffered.end(video.buffered.length - 1) / duration);
        }

        // NO se usa `loadeddata`: dispara una sola vez para la posición inicial y el seek de
        // arranque puede impedir que vuelva a dispararse, dejando el loader clavado en 0 %.
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) allReady = false;
      }

      setLoadProgress(bufferedRatio / targets.length);

      if (allReady) {
        setVideosReady(true);
        window.clearInterval(poll);
      }
    }, READY_POLL_MS);

    // Arranque en frío del dev server: el bundler puede seguir compilando la ruta cuando el
    // <video> pide el archivo y la petición muere con error de red. Se reintenta la carga.
    const errorHandlers = targets.map(({ video }) => {
      const handleError = () => {
        if (retryTimeouts.has(video)) return;
        retryTimeouts.set(
          video,
          window.setTimeout(() => {
            retryTimeouts.delete(video);
            video.load();
          }, LOAD_RETRY_DELAY_MS),
        );
      };
      video.addEventListener("error", handleError);
      return { video, handleError };
    });

    const failsafe = window.setTimeout(() => setVideosReady(true), LOAD_FAILSAFE_MS);

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(failsafe);
      retryTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      errorHandlers.forEach(({ video, handleError }) => video.removeEventListener("error", handleError));
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoaderElapsed(true), LOADER_MIN_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  useGSAP(
    () => {
      // `null` = preferencia sin resolver; `true` = sin pin, sin scrub, sin segundo clip y sin loop.
      if (prefersReducedMotion !== false) return;

      const section = sectionRef.current;
      const videoA = videoARef.current;
      const videoB = videoBRef.current;
      if (!section || !videoA || !videoB) return;

      let trigger: ScrollTrigger | null = null;
      const seekerA = createSeeker(videoA);
      const seekerB = createSeeker(videoB);

      const stopIdleLoop = () => {
        if (idleTimeoutRef.current !== null) {
          window.clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = null;
        }
        if (loopFrameRef.current !== null) {
          cancelAnimationFrame(loopFrameRef.current);
          loopFrameRef.current = null;
        }
      };

      const runIdleLoop = (startedAt: number) => {
        const step = (now: number) => {
          // Si el usuario se fue lejos, `onUpdate` ya no vuelve a dispararse para cortar el
          // loop y el video seguiría "respirando" fuera de pantalla.
          if (trigger === null || !trigger.isActive) {
            stopIdleLoop();
            return;
          }

          const phase = ((now - startedAt) % LOOP_CYCLE_MS) / LOOP_CYCLE_MS;
          // Coseno 0→1→0: derivada nula en ambos extremos, así el ping-pong no tiene corte.
          const wave = (1 - Math.cos(phase * Math.PI * 2)) / 2;
          // El descanso mece el clip 2, que es el que queda en pantalla al final del recorrido.
          seekerB.seek(CLIP_B_END_S - LOOP_WINDOW_S * wave);

          loopFrameRef.current = requestAnimationFrame(step);
        };

        loopFrameRef.current = requestAnimationFrame(step);
      };

      const scheduleIdleLoop = (progress: number) => {
        stopIdleLoop(); // cualquier movimiento del scroll cancela el descanso en curso
        if (progress < IDLE_PROGRESS_THRESHOLD) return;

        idleTimeoutRef.current = window.setTimeout(() => {
          idleTimeoutRef.current = null;
          runIdleLoop(performance.now());
        }, IDLE_DELAY_MS);
      };

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // `end` como callback para que se recalcule en cada refresh: una constante congelada
        // rompe el recorrido al rotar el dispositivo o al cambiar el alto de la barra del navegador.
        end: () => `+=${window.innerHeight * SCROLL_VH_MULTIPLIER}`,
        pin: true,
        anticipatePin: 1,
        scrub: SCRUB_SMOOTHING_S,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          /*
           * Cada clip se escrubea solo mientras está en pantalla, más el ancho del cruce:
           * decodificar el que está a opacidad 0 es trabajo puro perdido, y el decodificador
           * es justamente el recurso escaso acá.
           */
          if (progress <= SPLIT + CROSSFADE_PROGRESS) {
            seekerA.seek(CLIP_A_START_S + ramp(progress, 0, SPLIT) * CLIP_A_USABLE_S);
          }
          if (progress >= SPLIT - CROSSFADE_PROGRESS) {
            seekerB.seek(CLIP_B_START_S + ramp(progress, SPLIT, 1) * CLIP_B_USABLE_S);
          }

          // El clip 2 va encima: basta con subir su opacidad para cruzar.
          videoB.style.opacity = ramp(
            progress,
            SPLIT - CROSSFADE_PROGRESS / 2,
            SPLIT + CROSSFADE_PROGRESS / 2,
          ).toFixed(3);

          const introOut = ramp(progress, 0, INTRO_FADE_END);
          applyFade(introRef.current, 1 - introOut, -COPY_TRAVEL_PX * introOut);

          const hintOut = ramp(progress, 0, HINT_FADE_END);
          applyFade(hintRef.current, 1 - hintOut, HINT_TRAVEL_PX * hintOut);

          const outroIn = ramp(progress, OUTRO_FADE_START, 1);
          applyFade(outroRef.current, outroIn, COPY_TRAVEL_PX * (1 - outroIn));

          scheduleIdleLoop(progress);
        },
      });

      return () => {
        stopIdleLoop();
        seekerA.dispose();
        seekerB.dispose();
        trigger?.kill();
        resetLayer(videoB);
        resetLayer(introRef.current);
        resetLayer(hintRef.current);
        resetLayer(outroRef.current);
      };
    },
    // `revertOnUpdate` es obligatorio acá: con dependencias y sin él, @gsap/react difiere el
    // cleanup hasta el unmount y el ScrollTrigger viejo sobreviviría al cambio de preferencia.
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  // El loader es absoluto y no mueve el layout, pero el reveal coincide con la aparición de
  // fuentes e imágenes del resto de la página: un refresh deja el pin medido sobre el layout final.
  useEffect(() => {
    if (!isRevealed) return;
    ScrollTrigger.refresh();
  }, [isRevealed]);

  const loadPercent = Math.round(loadProgress * 100);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      className={`hero-scroll${isStatic ? " hero-scroll--static" : ""}`}
    >
      <video
        ref={videoARef}
        src={CLIP_A_SRC}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="hero-scroll__video"
      />
      {/* Con reduced motion no se monta: queda solo el frame de arranque del clip 1. */}
      {!isStatic && (
        <video
          ref={videoBRef}
          src={CLIP_B_SRC}
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="hero-scroll__video hero-scroll__video--next"
        />
      )}
      <div className="hero-scroll__scrim" aria-hidden />

      <div className="hero-scroll__stage">
        <div ref={introRef} className="hero-scroll__layer">
          <Container className="hero-scroll__copy">
            <p className="hero-scroll__eyebrow">{t("badge")}</p>
            <h1 id={titleId} className="hero-scroll__title">
              <span className="block">{t("title.line1")}</span>
              <span className="block">
                {t("title.line2")} {t("title.line3")}
              </span>
            </h1>
            <p className="hero-scroll__description">{t("description")}</p>
            <HeroCtaGroup
              primaryAction={{ href: "#contacto", label: t("ctaPrimary") }}
              secondaryAction={{ href: "#obras", label: t("ctaSecondary") }}
            />
          </Container>
        </div>

        {!isStatic && (
          <div ref={outroRef} className="hero-scroll__layer hero-scroll__layer--outro">
            <Container className="hero-scroll__copy hero-scroll__copy--centered">
              <p className="hero-scroll__outro-title">{t("tagline")}</p>
              <HeroCtaGroup
                className="sm:justify-center"
                primaryAction={{ href: "#contacto", label: t("ctaPrimary") }}
                secondaryAction={{ href: "#obras", label: t("ctaSecondary") }}
              />
            </Container>
          </div>
        )}
      </div>

      {!isStatic && (
        <div ref={hintRef} className="hero-scroll__hint">
          <span>{tScroll("scrollHint")}</span>
          <ChevronDown aria-hidden className="hero-scroll__hint-icon" />
        </div>
      )}

      {showLoader && (
        <div className="hero-scroll__loader" role="status" aria-live="polite">
          <Image
            src="/logos/logo.svg"
            alt=""
            aria-hidden
            width={534}
            height={419}
            priority
            className="hero-scroll__loader-mark"
          />
          <p className="hero-scroll__loader-label">{tScroll("loading")}</p>
          {/* El porcentaje queda fuera del anuncio: repetirlo por `aria-live` cada 80 ms es ruido. */}
          <div aria-hidden className="hero-scroll__loader-track">
            <span
              className="hero-scroll__loader-bar"
              style={{ transform: `scaleX(${loadProgress.toFixed(3)})` }}
            />
          </div>
          <p aria-hidden className="hero-scroll__loader-value">
            {loadPercent}%
          </p>
        </div>
      )}
    </section>
  );
}

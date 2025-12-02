import Image from "next/image";
import { Mail, Link as LinkIcon } from "lucide-react";

export const Herosection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src="/banner.png"
        alt="Banner"
        fill
        priority
        className="object-cover -object-left md:object-center -z-10"
      />

      <div className="container mx-auto px-5 md:px-10 py-16 md:py-28 relative z-10 max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-6">
          Synthesia
        </h1>

        <p className="text-base md:text-lg text-black max-w-2xl leading-relaxed mb-8">
          Synthesia allows you to create videos directly in a web browser.
          Simply select an actor, type in the text and use AI to generate your
          video without the need for actors, film crew or expensive equipment
          and post-production. You can create stunning business videos in
          minutes.
        </p>

        <div className="flex items-center gap-6 flex-wrap">
          <a
            href="mailto:#"
            className="flex items-center gap-2 text-black/90 hover:text-black transition"
          >
            <Mail size={16} />
            Frontcloudcreator@gmail.com
          </a>

          <a
            href="#"
            className="flex items-center gap-2 text-black/90 hover:text-black transition"
          >
            <LinkIcon size={16} />
            Privacy Policy
          </a>
        </div>
      </div>
    </section>
  );
};

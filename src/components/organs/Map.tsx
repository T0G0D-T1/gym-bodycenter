import { Text } from "../atoms/Text";
import { MapPin} from "@phosphor-icons/react"

const Map = () => {
  return (
    <section className="w-full h-auto bg-zinc-950 pt-24 md:pt-28 lg:pt-32">
      <main className="w-full max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4] items-start px-6 md:px-10 lg:px-20 gap-10 py-12">
        <div className="w-full flex flex-col items-start gap-4">
          <div className="flex flex-col items-start relative before:absolute before:-bottom-6 before:left-0 before:w-20 before:h-1 before:rounded-lg before:bg-gradient-to-r before:from-amber-500 before:to-red-500">
            <Text as="p" className="text-amber-500 lg:text-sm text-xs tracking-widest uppercase font-medium">
              BodyCenter
            </Text>
            <Text as="h1" className="text-zinc-100 lg:text-5xl md:text-4xl text-3xl">
              Nuestra Ubicacion
            </Text>
          </div>

          <Text as="p" className="text-zinc-300 text-base mt-10">
            Encuentranos en el mapa y llega directo al gimnasio.
          </Text>

          <div className="flex items-center gap-2 text-zinc-200">
            <MapPin size={20} color="#f59e0b" weight="fill" />
            <Text as="p" className="text-base">
              14 norte #931, Viña del Mar, Chile
            </Text>
          </div>
        </div>

        <div className="w-full rounded-lg overflow-hidden shadow-2xl border border-zinc-700 bg-zinc-900 lg:justify-self-center">
          <div className="w-full h-[550px] md:h-[780px] lg:h-[500px]">
            <iframe
              title="Bodycenter"
              src="https://www.google.com/maps?q=BodyCenter%20gym%2C%2014%20Norte%20931%2C%20Vi%C3%B1a%20del%20Mar%2C%20Chile&z=16&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>
    </section>
  );
};

export default Map;

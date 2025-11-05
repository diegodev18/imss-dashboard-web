import TelegramIcon from "../components/icons/telegram";
import SectionContainer from "../components/sectionContainer";

export default function Home() {
  return (
    <>
      <main>
        <SectionContainer className="flex flex-col items-center justify-center gap-1 h-svh w-screen">
          <h1 className="text-yellow-300 text-[1.92rem] font-semibold">
            Bienvenido a IMSS Dashboard
          </h1>
          <p>
            El Panel de Control para la gestión de empleados ante el registro
            del IMSS.
          </p>
          <a
            className="px-3 py-1.5 my-3 bg-blue-500 hover:bg-blue-600 rounded-md transition duration-300"
            href="/dashboard"
          >
            Ve al Panel de Control
          </a>
          <a
            className="flex items-center gap-1 border-b border-b-transparent px-2 hover:border-b-blue-500 transition duration-300"
            target="_blank"
            rel="noopener noreferrer"
            href="https://t.me/IeuImsBot"
          >
            <span className="opacity-70">¡Prueba nuestro</span>
            <span className="font-semibold opacity-100">
              Asistente de Telegram!
            </span>
            <TelegramIcon className="h-8" />
          </a>
        </SectionContainer>
      </main>
    </>
  );
}

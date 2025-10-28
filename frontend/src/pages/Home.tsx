import TelegramIcon from "../components/icons/telegram";

export default function Home() {
  return (
    <>
      <main className="h-svh w-screen flex flex-col items-center justify-center gap-1 bg-gray-800 text-white">
        <h1 className="text-yellow-300 text-[1.92rem] font-semibold">
          Bienvenido a IMSS Dashboard
        </h1>
        <p>Esta es una aplicación de ejemplo utilizando Vite y React.</p>
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
      </main>
    </>
  );
}

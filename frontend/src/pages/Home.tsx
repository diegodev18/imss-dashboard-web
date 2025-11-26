import TelegramIcon from "../components/icons/telegram";
import SectionContainer from "../components/sectionContainer";
import {
  main as features,
  secondary as secondaryFeatures,
  telegram as telegramFeatures,
} from "../consts/features";
import { contacts } from "../consts/contacts";
import { pages } from "../consts/urls";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="py-2 bg-white shadow-sm border-b border-zinc-200">
        <SectionContainer className="flex justify-between items-center">
          <div className="flex items-center gap-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">I</span>
            </div>
            <span className="text-base font-semibold text-gray-800">
              IMSS Dashboard
            </span>
          </div>
          <a
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
            href="/dashboard"
          >
            Dashboard
          </a>
        </SectionContainer>
      </header>
      <main className="bg-linear-to-br from-blue-50 to-indigo-50">
        <SectionContainer>
          <div className="py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Bienvenido a IMSS Dashboard
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              El Panel de Control para la gestión de empleados ante el registro
              del IMSS
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Ve al Panel de Control
              </a>
              <a
                href="#telegram"
                className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-2.5 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-blue-600 scroll-smooth"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("telegram")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                ¡Prueba nuestro Asistente de Telegram!
              </a>
            </div>
          </div>
          <div className="pb-8">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </SectionContainer>
        <div className="bg-white py-16">
          <SectionContainer>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Todo lo que necesitas en un solo lugar
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Nuestra plataforma te ofrece las herramientas necesarias para
                gestionar eficientemente tu relación con el IMSS
              </p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryFeatures.map((feature, idx) => (
                <li
                  key={idx}
                  className="bg-linear-to-br from-blue-50 to-indigo-50 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </SectionContainer>
        </div>
        <div
          id="telegram"
          className="bg-linear-to-r from-blue-600 to-indigo-600 py-16"
        >
          <SectionContainer>
            <div className="text-center text-white mb-8">
              <h3 className="text-2xl font-bold mb-3">
                Asistente Virtual de Telegram
              </h3>
              <p className="text-base text-blue-100 max-w-2xl mx-auto mb-6">
                Obtén respuestas instantáneas a tus preguntas sobre el IMSS,
                consulta información de empleados y recibe notificaciones
                directamente en Telegram.
              </p>
              <a
                className="inline-flex items-center gap-x-2 bg-white text-blue-600 px-6 py-1.5 rounded-lg font-semibold text-base hover:bg-blue-50 transition-colors duration-200 shadow-lg"
                href={
                  pages.find((p) => p.name === "Telegram Bot")?.url ||
                  "https://t.me/IeuImsBot"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Conectar con Telegram
                <TelegramIcon className="h-8 w-8" />
              </a>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {telegramFeatures.map((feature, idx) => (
                <li
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
                >
                  <h2 className="text-base font-bold text-white mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </SectionContainer>
        </div>
        <div className="bg-white py-16">
          <SectionContainer>
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Registra tu Empresa
                </h2>
                <p className="text-base text-gray-600">
                  Completa el formulario y comienza a gestionar a tus empleados
                  con IMSS Dashboard
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: Implementar lógica de registro
                  console.log("Formulario enviado");
                }}
                className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md"
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ingresa el nombre de tu empresa"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contactName"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Nombre del Contacto *
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="(55) 1234-5678"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="contacto@empresa.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="rfc"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      RFC de la Empresa *
                    </label>
                    <input
                      type="text"
                      id="rfc"
                      name="rfc"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="ABC123456XYZ"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="employeeCount"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Número de Empleados
                    </label>
                    <select
                      id="employeeCount"
                      name="employeeCount"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="1-10">1-10 empleados</option>
                      <option value="11-50">11-50 empleados</option>
                      <option value="51-200">51-200 empleados</option>
                      <option value="201-500">201-500 empleados</option>
                      <option value="500+">Más de 500 empleados</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Mensaje Adicional
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="¿Algo que quieras comentarnos?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Enviar Solicitud de Registro
                  </button>
                </div>
              </form>
            </div>
          </SectionContainer>
        </div>
      </main>
      <footer className="bg-gray-900 text-gray-300 py-12">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-base font-bold text-white mb-2">
                IMSS Dashboard
              </h4>
              <p className="text-sm leading-relaxed">
                Tu plataforma confiable para la gestión integral de empleados
                ante el Instituto Mexicano del Seguro Social.
              </p>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-2">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-1 text-sm">
                {pages.map((page, idx) => (
                  <li key={idx}>
                    <a
                      href={page.url}
                      className="hover:underline hover:text-white transition-colors duration-300"
                      target={page.url.startsWith("http") ? "_blank" : "_self"}
                      rel={
                        page.url.startsWith("http") ? "noopener noreferrer" : ""
                      }
                    >
                      {page.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-2">Contacto</h4>
              <ul className="space-y-1 text-sm">
                {contacts.map((contact, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{contact.name}:</span>{" "}
                    <span>{contact.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-xs">
            <p>&copy; 2025 IMSS Dashboard. Todos los derechos reservados.</p>
          </div>
        </SectionContainer>
      </footer>
    </div>
  );
}

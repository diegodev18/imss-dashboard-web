import TelegramIcon from "../components/icons/telegram";
import SectionContainer from "../components/sectionContainer";

export default function Home() {
  const features = [
    {
      title: "Gestión Simplificada",
      description: "Administra todos tus empleados de forma eficiente y segura",
    },
    {
      title: "Gestión Simplificada",
      description: "Administra todos tus empleados de forma eficiente y segura",
    },
    {
      title: "Gestión Simplificada",
      description: "Administra todos tus empleados de forma eficiente y segura",
    },
  ];

  const features2 = [
    {
      title: "Gestión de Empleados",
      description:
        "Administra toda la información de tus empleados en un solo lugar. Alta, baja y modificaciones en tiempo real",
    },
    {
      title: "Gestión de Empleados",
      description:
        "Administra toda la información de tus empleados en un solo lugar. Alta, baja y modificaciones en tiempo real",
    },
    {
      title: "Gestión de Empleados",
      description:
        "Administra toda la información de tus empleados en un solo lugar. Alta, baja y modificaciones en tiempo real",
    },
    {
      title: "Gestión de Empleados",
      description:
        "Administra toda la información de tus empleados en un solo lugar. Alta, baja y modificaciones en tiempo real",
    },
  ];

  const telegramFeatures = [
    {
      title: "Consultas Rápidas",
      description:
        "Obtén información instantánea sobre el estado de tus empleados y trámites",
    },
    {
      title: "Notificaciones Automáticas",
      description:
        "Recibe alertas sobre fechas importantes y actualizaciones del IMSS",
    },
    {
      title: "Asistencia Personalizada",
      description:
        "Resuelve tus dudas con respuestas rápidas y precisas a través del asistente virtual",
    },
  ];

  return (
    <>
      <header>
        <SectionContainer className="flex justify-between items-center">
          <p>Bienvenido a la gestión de salud simplificada</p>
          <a href="">Dashboard</a>
        </SectionContainer>
      </header>
      <main>
        <SectionContainer>
          <div>
            <h1>Bienvenido a IMSS Dashboard</h1>
            <p>
              El Panel de Control para la gestión de empleados ante el registro
              del IMSS
            </p>
          </div>
          <div>
            <a href="">Ve al Panel de Control</a>
            <a>¡Prueba nuestro Asistente de Telegram!</a>
          </div>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </li>
            ))}
          </ul>
        </SectionContainer>
      </main>
      <SectionContainer>
        <div>
          <h2>Todo lo que necesitas en un solo lugar</h2>
          <p>
            Nuestra plataforma te ofrece las herramientas necesarias para
            gestionar eficientemente tu relación con el IMSS
          </p>
        </div>
        <ul>
          {features2.map((feature, index) => (
            <li key={index}>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </li>
          ))}
        </ul>
      </SectionContainer>
      <SectionContainer>
        <div>
          <h3>Asistente Virtual de Telegram</h3>
          <p>
            Obtén respuestas instantáneas a tus preguntas sobre el IMSS,
            consulta información de empleados y recibe notificaciones
            directamente en Telegram.
          </p>
          <a className="flex items-center gap-x-1" href="">
            Conectar con Telegram <TelegramIcon className="h-8" />
          </a>
          <ul>
            {telegramFeatures.map((feature, index) => (
              <li key={index}>
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </SectionContainer>
      <footer>
        <SectionContainer>
          <div>
            <h4>Bienvenido a la gestión de salud simplificada</h4>
            <p>
              Tu plataforma confiable para la gestión integral de empleados ante
              el Instituto Mexicano del Seguro Social.
            </p>
          </div>
          <div>
            <h4>Enlaces Rápidos</h4>
          </div>
          <div>
            <h4>Contacto</h4>
          </div>
        </SectionContainer>
      </footer>
    </>
  );
}

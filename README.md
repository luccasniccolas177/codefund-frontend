# CodeFund Frontend - Interfaz de Usuario para Crowdfunding Descentralizado

Este repositorio contiene el código fuente del frontend para CodeFund, una DApp de nueva generación construida con Next.js y React. Esta interfaz de usuario proporciona un portal limpio, moderno y reactivo para que desarrolladores y patrocinadores interactúen con la plataforma de crowdfunding.

La aplicación se comunica con un backend en FastAPI para obtener datos de la blockchain de forma eficiente y se conecta directamente con la wallet del usuario (MetaMask) para ejecutar transacciones on-chain.
🚀 Funcionalidades Implementadas

✅ Exploración de Proyectos: Visualiza todas las campañas activas con su progreso de financiación en tiempo real.

✅ Creación de Campañas: Un flujo completo para que los desarrolladores lancen nuevos proyectos, definiendo metas, plazos e hitos iniciales con condiciones de verificación (ej. URL de un Pull Request de GitHub).

✅ Página de Detalle: Vista completa de cada campaña, incluyendo descripción, estado financiero y la lista de hitos con su estado (Pendiente, Verificado, Pagado).

✅ Financiación de Proyectos: Los patrocinadores pueden conectar su wallet MetaMask y contribuir con ETH a las campañas que deseen apoyar.

✅ Panel de Desarrollador: Los creadores de campañas pueden gestionar sus proyectos, añadir nuevos hitos y liberar los fondos de los hitos ya verificados.

✅ Panel de Usuario (Dashboard): Una vista personalizada donde cada usuario puede ver un resumen de las campañas que ha creado y los proyectos a los que ha contribuido.
🛠️ Pila Tecnológica

    Framework: Next.js (React)

    Gestión de Estado Web3: wagmi y viem para la conexión de wallets y la interacción con contratos.

    Estilos: Tailwind CSS para un diseño moderno y responsivo.

    Cliente HTTP: fetch nativo para la comunicación con la API del backend.

⚙️ Instalación y Configuración
Requisitos Previos

    Node.js (versión 18 o superior)

    Una wallet de navegador como MetaMask

### 1. Clonar el repositorio y navegar a la carpeta

git clone <repo_url>
cd <nombre_del_repo>/app-frontend

### 2. Instalar dependencias

Se recomienda usar yarn para una instalación más estable, pero npm también funciona.

Con Yarn (recomendado)

yarn install

O con NPM

npm install

### 3. Configurar la variable de entorno

Este es el paso más importante para conectar el frontend con el contrato inteligente correcto.

    Crea un archivo llamado .env.local en la raíz de la carpeta app-frontend.

    Añade la siguiente línea, reemplazando la dirección con la de tu contrato CampaignFactory desplegado en la red Sepolia.

NEXT_PUBLIC_FACTORY_ADDRESS="0x...LA_DIRECCION_DE_TU_CONTRATO_FACTORY"

🏃‍♂️ Cómo Correr la Aplicación

Una vez instaladas las dependencias y configurada la variable de entorno, puedes iniciar el servidor de desarrollo.

Con Yarn

yarn dev

O con NPM

npm run dev

La DApp estará disponible en tu navegador en la siguiente dirección:
http://localhost:3000
🌐 Conexión con el Backend

Este frontend está diseñado para funcionar con el backend de CodeFund. Asegúrate de que el servidor del backend (FastAPI) esté corriendo en http://127.0.0.1:8000 para que el frontend pueda obtener los datos de los proyectos.
📈 Estado del Proyecto

✅ Frontend 100% Funcional: Todas las características descritas están implementadas y operativas.

✅ Integración Completa con MetaMask: Conexión, firma de transacciones y cambio de red gestionados.

✅ Comunicación con API Backend: Obtiene y muestra datos de proyectos y usuarios de forma eficiente.

✅ Interacción Directa con Contratos: Ejecuta transacciones on-chain para crear campañas, contribuir y gestionar hitos.

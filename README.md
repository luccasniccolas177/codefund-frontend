# CodeFund - DApp de Crowdfunding Descentralizado

CodeFund es una plataforma de crowdfunding basada en Web3 que permite financiar proyectos (especialmente de software) de forma segura y transparente. Los fondos solo se liberan si los desarrolladores cumplen hitos específicos, verificados on-chain. En caso contrario, los fondos pueden devolverse automáticamente gracias a los contratos inteligentes.

---

## 🚀 Funcionalidad

✅ Explorar proyectos y ver su progreso de financiamiento.  
✅ Conectar wallet MetaMask para interactuar con la blockchain.  
✅ Crear nuevas campañas de crowdfunding.  
✅ Visualizar detalles de cada campaña.  
---

## 🛠️ Tecnologías utilizadas

- **Frontend:** Next.js (React)
- **Estilos:** Tailwind CSS
- **Web3:** ethers.js, MetaMask
- **HTTP Client:** Axios
- **Backend esperado:** FastAPI (API REST)
- **Lenguaje backend (API):** Python 3.10+
- **Blockchain:** Smart Contracts en Solidity (en desarrollo)

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repo_url>
cd codefund-frontend-master
```

---

### 2. Instalar dependencias frontend

```bash
npm install
```

ó si usas yarn:

```bash
yarn install
```

---

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con la URL de la API backend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🏃‍♂️ Cómo correr la aplicación

### ✅ Levantar Frontend

```bash
npm run dev
```

o con yarn:

```bash
yarn dev
```

Por defecto estará disponible en:

```
http://localhost:3000
```

---

## 🌐 Conexión con el backend

Este frontend espera que el backend (FastAPI) esté corriendo en:

```
http://localhost:8000
```


### ➤ Estilos

- Usa **Tailwind CSS** para los estilos.
- Diseño responsivo y limpio.

---

## 📈 Estado del proyecto

✅ Frontend Next.js funcionando.  
✅ Integración con MetaMask básica.  
✅ Llamadas a la API backend.  
🔜 Integración real con Smart Contracts.  
🔜 Validación on-chain de milestones y liberación de fondos.



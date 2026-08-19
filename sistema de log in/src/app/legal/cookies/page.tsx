export default function CookiesPage() {
  return (
    <>
      <h1>Politica de Cookies</h1>
      <p>Ultima actualizacion: 1 de enero de 2025</p>

      <h2>1. Que son las cookies</h2>
      <p>Las cookies son pequenos archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Sirven para recordar preferencias, mantener sesiones activas y recopilar informacion estadistica.</p>

      <h2>2. Tipos de cookies que utilizamos</h2>

      <h3>2.1 Cookies tecnicas (necesarias)</h3>
      <p>Son esenciales para el funcionamiento de la plataforma. Sin ellas no podrias iniciar sesion ni navegar por las secciones protegidas.</p>
      <ul>
        <li><strong>Sesion:</strong> cookie httpOnly que mantiene tu sesion activa mientras navegas</li>
        <li><strong>CSRF:</strong> cookie de proteccion contra ataques de falsificacion de peticiones</li>
      </ul>

      <h3>2.2 Cookies de sesion de autenticacion</h3>
      <p>Gestionadas por NextAuth.js, almacenan un token JWT de sesion cifrado que permite mantenerte autenticado. Son estrictamente necesarias y no requieren consentimiento segun el RGPD.</p>

      <h2>3. Cookies de terceros</h2>
      <p>Actualmente esta plataforma no utiliza cookies de terceros (analitica, publicidad, redes sociales). En caso de incorporarlas en el futuro, se solicitara tu consentimiento expreso.</p>

      <h2>4. Gestion de cookies</h2>
      <p>Puedes configurar tu navegador para rechazar todas las cookies o para que te avise cuando se envian. Sin embargo, si deshabilitas las cookies tecnicas, no podras iniciar sesion ni utilizar la plataforma.</p>

      <h2>5. Mas informacion</h2>
      <p>Para mas informacion sobre el uso de cookies, puedes consultar las guias de la Agencia Espanola de Proteccion de Datos (AEPD) o contactarnos a traves del email indicado en el Aviso Legal.</p>
    </>
  );
}

/**
 * Página de error del Pages Router legacy.
 * Solo existe para evitar errores de build.
 * Las páginas de error reales se manejan en app/not-found.tsx (App Router).
 */
function ErrorPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Error</h1>
      <p>Ha ocurrido un error.</p>
      <a href="/">Volver al inicio</a>
    </div>
  );
}

ErrorPage.getInitialProps = () => {
  return { statusCode: 500 };
};

export default ErrorPage;

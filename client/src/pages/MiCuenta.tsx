import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MiCuenta() {
  const { user, profile } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await signOut();
    setLocation('/');
  };

  return (
    <>
      <Helmet>
        <title>Mi Cuenta | IMPACTO33</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Mi Cuenta</h1>
            <p className="text-slate-600 mt-2">
              Gestiona tu información personal y preferencias
            </p>
          </div>

          <div className="grid gap-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Datos de tu cuenta en IMPACTO33
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <p className="text-slate-900 mt-1">{user?.email}</p>
                </div>

                {profile && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Fecha de registro
                      </label>
                      <p className="text-slate-900 mt-1">
                        {format(new Date(profile.created_at), "d 'de' MMMM 'de' yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Newsletter
                      </label>
                      <p className="text-slate-900 mt-1">
                        {profile.is_newsletter_subscribed
                          ? '✅ Suscrito'
                          : '❌ No suscrito'}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>

            {/* Enlaces rápidos */}
            <Card>
              <CardHeader>
                <CardTitle>Enlaces Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="/inicio"
                  className="block text-blue-600 hover:text-blue-700 hover:underline"
                >
                  → Ir a mi panel personalizado
                </a>
                <a
                  href="/"
                  className="block text-blue-600 hover:text-blue-700 hover:underline"
                >
                  → Ver catálogo de productos
                </a>
                <a
                  href="/contacto"
                  className="block text-blue-600 hover:text-blue-700 hover:underline"
                >
                  → Contactar con soporte
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

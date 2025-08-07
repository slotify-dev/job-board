import { LoginForm } from './LoginForm';
import { Auth0LoginButton } from './Auth0LoginButton';
export function LoginPage() {
  const handleLoginSuccess = () => {
    // The useAuth hook will handle the redirect automatically
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">Job Board</h1>
          <p className="text-primary-600">Connect talent with opportunity</p>
        </div>

        <div className="space-y-4">
          <Auth0LoginButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-primary-50 text-primary-500">
                or continue with email
              </span>
            </div>
          </div>

          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  );
}

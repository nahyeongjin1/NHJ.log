import { useSyncExternalStore } from 'react';
import { LogIn } from 'lucide-react';
import { useSession, signIn, signOut } from '~/lib/auth.client';

interface AuthButtonProps {
  variant: 'desktop' | 'mobile';
}

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function AuthButton({ variant }: AuthButtonProps) {
  const isClient = useIsClient();

  // 서버/빌드 시에는 스켈레톤 표시
  if (!isClient) {
    return variant === 'desktop' ? (
      <div className="hidden md:flex w-9 h-9 rounded-full bg-tertiary animate-pulse" />
    ) : (
      <div className="md:hidden w-9 h-9 rounded-full bg-tertiary animate-pulse" />
    );
  }

  return <AuthButtonClient variant={variant} />;
}

function AuthButtonClient({ variant }: AuthButtonProps) {
  const { data: session, isPending } = useSession();

  const handleLogin = () => {
    signIn.social({ provider: 'github' });
  };

  const handleLogout = () => {
    signOut();
  };

  if (isPending) {
    return variant === 'desktop' ? (
      <div className="hidden md:flex w-9 h-9 rounded-full bg-tertiary animate-pulse" />
    ) : (
      <div className="md:hidden w-9 h-9 rounded-full bg-tertiary animate-pulse" />
    );
  }

  if (session?.user) {
    return variant === 'desktop' ? (
      <button
        onClick={handleLogout}
        className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="Logout"
      >
        <img
          src={session.user.image || ''}
          alt={session.user.name || 'User'}
          className="w-9 h-9 rounded-full border border-default"
        />
      </button>
    ) : (
      <button
        onClick={handleLogout}
        className="md:hidden w-9 h-9 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center"
        aria-label="Logout"
      >
        <img
          src={session.user.image || ''}
          alt={session.user.name || 'User'}
          className="w-7 h-7 rounded-full border border-default"
        />
      </button>
    );
  }

  return variant === 'desktop' ? (
    <button
      onClick={handleLogin}
      className="hidden md:flex w-9 h-9 rounded-lg hover:bg-secondary transition-colors items-center justify-center text-secondary"
      aria-label="Login"
    >
      <LogIn size={20} />
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className="md:hidden w-9 h-9 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center text-secondary"
      aria-label="Login"
    >
      <LogIn size={20} />
    </button>
  );
}

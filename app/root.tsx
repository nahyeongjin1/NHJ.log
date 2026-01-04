import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';
import type React from 'react';
import {
  ThemeProvider,
  useTheme,
  PreventFlashOnWrongTheme,
} from 'remix-themes';

import type { Route } from './+types/root';
import stylesheet from './app.css?url';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { themeSessionResolver } from './sessions.server';

export const links: Route.LinksFunction = () => [
  {
    rel: 'icon',
    href: '/favicon-96x96.png',
    type: 'image/png',
    sizes: '96x96',
  },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'shortcut icon', href: '/favicon.ico' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
  {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css',
  },
  {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css',
  },
  { rel: 'stylesheet', href: stylesheet },
];

// 쿠키에서 테마를 읽어서 SSR 시 적용
export const loader = async ({ request }: Route.LoaderArgs) => {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
};

// InnerLayout: useTheme 훅을 사용하여 테마 적용
const InnerLayout = ({ children }: { children: React.ReactNode }) => {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={theme ?? ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="NHJ.log" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

// Layout: ThemeProvider로 InnerLayout을 감싸서 테마 컨텍스트 제공
export const Layout = ({ children }: { children: React.ReactNode }) => {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data?.theme} themeAction="/api/set-theme">
      <InnerLayout>{children}</InnerLayout>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

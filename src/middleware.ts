import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Définir les routes publiques
const isPublicRoute = createRouteMatcher([
  '/', 
  '/agency',
  '/agency/sign-in(.*)', 
  '/agency/sign-up(.*)', 
  '/site', 
  '/api/uploadthing'
]);

export default clerkMiddleware(async (auth, req) => {
  // Définir les variables
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const hostname = req.headers.get('host');  // Correction : obtenir l'hôte des en-têtes

  // Fonction avant l'authentification
  await beforeAuth(auth, req);

  // Protéger les routes non publiques
  if (!isPublicRoute(req)) {
    auth().protect();
  }
  
  // Fonction après l'authentification
  const response = await afterAuth(auth, req, url, hostname, searchParams);
  if (response) {
    return response;
  }
  
  return NextResponse.next(); // Continue la chaîne de middleware si aucune réponse n'est renvoyée
});

// Fonction avant l'authentification
async function beforeAuth(auth: any, req: any) {
  // Logique avant l'authentification (vide ici)
}

// Fonction après l'authentification
async function afterAuth(auth: any, req: any, url: any, hostname: any, searchParams: any) {
  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;
  
  // Vérifier le sous-domaine
  const customSubDomain = hostname?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];
  if (customSubDomain) {
    return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url));
  }

  // Redirection pour les pages de connexion
  if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
  }

  // Réécriture des URL pour la page d'accueil et /site
  if (url.pathname === "/" || (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)) {
    return NextResponse.rewrite(new URL('/site', req.url));
  }

  // Réécriture pour les routes /agency et /subaccount
  if (url.pathname.startsWith('/agency') || url.pathname.startsWith('/subaccount')) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

  // Redirection pour les routes non trouvées
  if (!isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/agency', req.url));
  }

  return null; // Aucun changement si aucune condition n'est remplie
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

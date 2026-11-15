export const config = {
  matcher: '/:path*',
};

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');
  const validUser = process.env.ADMIN_USER || 'lorraine';
  const validPass = process.env.ADMIN_PASS;

  if (!validPass) {
    return new Response('ADMIN_PASS belum diatur di Environment Variables Vercel.', {
      status: 500,
    });
  }

  if (authHeader) {
    const base64 = authHeader.split(' ')[1] || '';
    const decoded = atob(base64);
    const colonIndex = decoded.indexOf(':');
    const user = decoded.slice(0, colonIndex);
    const pass = decoded.slice(colonIndex + 1);

    if (user === validUser && pass === validPass) {
      return new Response(null, {
        headers: { 'x-middleware-next': '1' },
      });
    }
  }

  return new Response('Akses Dibatasi', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Lorrainime Generator"',
    },
  });
}

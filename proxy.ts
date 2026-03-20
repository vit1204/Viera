import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  // 1. Update session cookie
  const response = await updateSession(request);

  // 2. Kiểm tra Auth để bảo vệ route "/"
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {}, // Middleware chỉ đọc để check, updateSession đã lo phần ghi
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nếu chưa login và không phải đang ở trang login -> Đá về login
  const isAuthPage =
  request.nextUrl.pathname.startsWith("/authentication");

if (!user && !isAuthPage) {
  return NextResponse.redirect(
    new URL("/authentication/login", request.url)
  );
}

// chỉ redirect nếu đang ở auth page
if (user && isAuthPage) {
  return NextResponse.redirect(new URL("/", request.url));
}

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png...)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // ⚠️ DESATIVADO PARA DEBUG
  return NextResponse.next();
}

// IMPORTANTE: comentar qualquer matcher existente
// export const config = { matcher: [...] };

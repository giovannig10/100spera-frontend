"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Lista de rotas onde o Header DEVE aparecer
  const routesWithHeader = ["/garcom", "/caixa", "/cozinha", "/adm"];

  if (routesWithHeader.includes(pathname)) {
    return <Header />;
  }

  return null;
}

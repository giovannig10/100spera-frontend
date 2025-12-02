"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Lista de rotas onde o Header NÃO deve aparecer
  const routesWithoutHeader = ["/"];
  
  if (routesWithoutHeader.includes(pathname)) {
    return null;
  }
  
  return <Header />;
}

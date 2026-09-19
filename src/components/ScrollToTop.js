'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Garante que cada navegação entre páginas comece no topo.
 * O App Router do Next nem sempre reseta o scroll ao trocar de rota
 * (principalmente quando a página anterior estava rolada para baixo).
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

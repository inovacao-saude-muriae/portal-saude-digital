'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function GlobalSearchSection() {
  const [termo, setTermo] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!termo.trim()) return;

    // Redireciona para a página central de busca de todo o site
    router.push(`/busca?q=${encodeURIComponent(termo.trim())}`);
  };

  return (
    <section className={styles.searchSection}>
      <div className={styles.container}>
        <form onSubmit={handleSearch} className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="O que você procura no portal?"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>
            Buscar no site
          </button>
        </form>
      </div>
    </section>
  );
}
import styles from './Loading.module.css';

/**
 * Indicador de carregamento reutilizável do portal.
 *
 * Props:
 * - texto: mensagem exibida abaixo do spinner (opcional)
 * - fullScreen: ocupa a altura da viewport (usado em loading.js de páginas)
 */
export default function Loading({ texto = 'Carregando...', fullScreen = false }) {
  return (
    <div className={`${styles.wrapper} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.spinner} aria-hidden="true"></div>
      {texto && <p className={styles.texto}>{texto}</p>}
      <span className={styles.srOnly}>Carregando conteúdo, aguarde.</span>
    </div>
  );
}

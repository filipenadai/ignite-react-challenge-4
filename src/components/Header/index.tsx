import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <div className={styles.contentContainer}>
        <img src="/logo.svg" alt="spacetraveling" />
      </div>
    </header>
  );
}

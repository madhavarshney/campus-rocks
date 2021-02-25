import Link from 'next/link'

import '../styles/globals.css'
import styles from '../styles/Home.module.css'

function DarkModeToggle({ onToggle }) {
  return (
    <div className='dark-mode-toggle'>
      <button onClick={() => onToggle()}>🌙</button>
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.container}>
      <DarkModeToggle onToggle={() => document.documentElement.classList.toggle('dark-mode')} />

      <main className={styles.main}>
        <h1 className={styles.title}>
          {pageProps.campus?.shortName.toLowerCase() ?? 'campus'}.rocks
        </h1>

        <p className={styles.description}>
          <Link href='/'>Clubs</Link>, <Link href='/communities'>communities</Link>, <Link href='/classes'>classes</Link>, and more at {pageProps.campus?.name || '<404>'}
        </p>

        <Component {...pageProps} />
      </main>

      <footer className={styles.footer}>
        <span>Made with <span style={{ color: '#e25555' }}>♥</span> by&nbsp;</span>
        <a
          href='https://github.com/madhavarshney'
          target='_blank'
          rel='noopener noreferrer'
        >
          Madhav Varshney
        </a>
      </footer>
    </div>
  )
}

export default MyApp

import '../styles/globals.css'

function DarkModeToggle({ onToggle }) {
  return (
    <div className='dark-mode-toggle'>
      <button onClick={() => onToggle()}>🌙</button>
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DarkModeToggle onToggle={() => document.documentElement.classList.toggle('dark-mode')} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

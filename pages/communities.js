import Head from 'next/head'
import { useSpring, animated } from 'react-spring'

import { getCampusInfo, getCommunitiesInfo } from '../lib/data'
import styles from '../styles/Communities.module.css'

export async function getStaticProps() {
  return {
    props: {
      campus: await getCampusInfo(),
      communities: await getCommunitiesInfo(),
    },
  }
}

const SafeLink = ({ href, children, ...rest }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    {...rest}
  >
    {children}
  </a>
)

function Card({ className, children }) {
  const [{ scale }, set] = useSpring(() => ({
    scale: 1,
    // TODO: adjust spring physics
    config: {
      mass: 2,
      tension: 200,
      friction: 18,
    },
  }))

  return (
    <animated.div
      className={className}
      onMouseMove={() => set({ scale: 1.05 })}
      onMouseLeave={() => set({ scale: 1 })}
      style={{ transform: scale.interpolate((scale) => `scale(${scale})`) }}
    >
      {children}
    </animated.div>
  )
}


export default function Communities({ campus, communities }) {
  return (
    <>
      <Head>
        <title>Communities | {campus.shortName} Rocks</title>
      </Head>

      <h2>Communities</h2>

      <div className={styles.cardList}>
        {communities.map(({ name, description, link, linkText, image }) => (
          <Card key={name} className={styles.card}>
            <div className={styles.titleRowWrapper}>
              <h3 className={styles.title}>{name}</h3>
              <div className={styles.avatar}>
                <img src={image} />
              </div>
            </div>
            <div className={styles.description}>{description}</div>
            <SafeLink className={styles.link} href={link}>{linkText}</SafeLink>
          </Card>
        ))}
      </div>
    </>
  )
}

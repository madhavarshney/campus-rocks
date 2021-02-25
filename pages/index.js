import Head from 'next/head'
import Fuse from 'fuse.js'
import { useState, useMemo } from 'react'

import Calendar from '../lib/components/Calendar'
import Modal from '../lib/components/Modal'
import ClubList from '../lib/components/ClubList'
import { useDebounce } from '../lib/useDebounce'
import { getClubsInfo } from '../lib/clubs'
import { getCampusInfo } from '../lib/campus'
import styles from '../styles/Home.module.css'

export async function getStaticProps() {
  const { clubs, categories } = await getClubsInfo()

  return {
    props: {
      campus: await getCampusInfo(),
      clubs,
      categories,
    },
  }
}

export default function Home({ campus, clubs, categories }) {
  const [input, setInput] = useState('')
  const [selectedClub, setSelectedClub] = useState(null)
  const searchTerm = useDebounce(input, 100)

  const filteredClubs = useMemo(() => {
    if (!searchTerm.trim()) {
      return clubs
    }

    const fuse = new Fuse(clubs, {
      threshold: 0.3,
      keys: ['name']
    })

    return fuse.search(searchTerm).map((options) => options.item)
  }, [clubs, searchTerm])

  return (
    <div className={styles.container}>
      <Head>
        <title>{campus.shortName} Rocks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {campus.shortName} Rocks
        </h1>

        <p className={styles.description}>
          Clubs, communities, and more at {campus.name}
        </p>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={`Search ${campus.name}`}
          className={styles.search}
        />

        <Calendar
          categories={categories}
          clubs={filteredClubs}
          onClubSelected={(club) => setSelectedClub(club)}
        />

        <h1>Active Clubs</h1>

        <ClubList
          categories={categories}
          clubs={filteredClubs}
          onClick={(club) => setSelectedClub(club)}
        />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/madhavarshney"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by Madhav Varshney
        </a>
      </footer>

      {selectedClub && (
        <Modal
          categories={categories}
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
        />
      )}
    </div>
  )
}

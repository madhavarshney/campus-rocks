import Head from 'next/head'
import Fuse from 'fuse.js'
import { matchSorter } from 'match-sorter'
import { useState, useMemo, useEffect } from 'react'

import Calendar from '../lib/components/Calendar'
import Modal from '../lib/components/Modal'
import ClubList from '../lib/components/ClubList'
import { useDebounce } from '../lib/useDebounce'
import { getCampusInfo, getClubsInfo } from '../lib/data'
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
    <>
      <Head>
        <title>{campus.shortName} Rocks</title>
      </Head>

      {/* <h1>Clubs</h1> */}

      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={`Search clubs at ${campus.name}`}
        className={styles.search}
      />

      <Calendar
        categories={categories}
        clubs={filteredClubs}
        onClubSelected={(club) => setSelectedClub(club)}
      />

      <ClubList
        categories={categories}
        clubs={filteredClubs}
        onClick={(club) => setSelectedClub(club)}
      />

      {selectedClub && (
        <Modal
          categories={categories}
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
        />
      )}
    </>
  )
}

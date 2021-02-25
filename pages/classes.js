import Head from 'next/head'
import { matchSorter } from 'match-sorter'
import { useState, useMemo, useEffect, Fragment } from 'react'

import { useDebounce } from '../lib/useDebounce'
import { getCampusInfo } from '../lib/data'
import styles from '../styles/Home.module.css'
import styles2 from '../styles/Classes.module.css'

export async function getStaticProps() {
  return {
    props: {
      campus: await getCampusInfo(),
    },
  }
}

function ClassItem({ CRN, section, times, seats, wait_seats }) {
  return (
    <>
      <div className={styles2.mobileRow}>
        <div>
          CRN: <strong>{CRN}</strong>, Section: {section},{' '}
          {seats <= 0 ? `${wait_seats} waitlist` : seats} seats
        </div>
        {times.map(({ days, start_time, end_time, instructor, type }) => (
          <div>
            {start_time === 'TBA' ? 'Async ' : ''}
            {type}{' '}
            {start_time !== 'TBA'
              ? `on ${days}, from ${start_time} - ${end_time}`
              : ''}{' '}
            with {instructor.join(', ')}
          </div>
        ))}
      </div>

      <div>{CRN}</div>
      <div>{section}</div>
      <div style={{ textAlign: 'right' }}>
        {seats <= 0 ? (
          <>
            {wait_seats} <span title='waitlist'>wl.</span>
          </>
        ) : (
          `${seats}`
        )}{' '}
        seats
      </div>

      {times.map(({ days, start_time, end_time, instructor, type }, index) => (
        <Fragment key={index}>
          {index > 0 && <div style={{ gridColumn: 3 }} />}
          <div>{type}</div>
          <div>
            {start_time !== 'TBA'
              ? `${days}, ${start_time} - ${end_time}`
              : 'async'}
          </div>
          <div>{instructor.join(', ')}</div>
        </Fragment>
      ))}
    </>
  )
}

export default function Schedule({ campus }) {
  const ITEMS_PER_PAGE = 10

  // const [deptNames, setDeptNames] = useState(null)
  const [classes, setClasses] = useState(null)
  const [input, setInput] = useState('')
  const [pagesToShow, setPagesToShow] = useState(1)
  const searchTerm = useDebounce(input, 100)

  useEffect(() => {
    const fetchData = async () => {
      // const query = `?year=2020&quarter=fall`
      const query = ``
      const [depts, classes] = await Promise.all([
        fetch(
          `https://opencourse.dev/${campus.openCourseId}/depts${query}`
        ).then((res) => res.json()),
        fetch(
          `https://opencourse.dev/${campus.openCourseId}/classes${query}`
        ).then((res) => res.json()),
      ])

      const deptNames = depts.reduce((depts, { id, name }) => {
        depts[id] = name

        return depts
      }, {})

      // setDeptNames(deptNames)
      setClasses(
        classes.map((clazz) => ({ deptName: deptNames[clazz.dept], ...clazz }))
      )
    }

    fetchData()
  }, [campus.openCourseId])

  const filteredClasses = useMemo(() => {
    if (!classes || !searchTerm) {
      return classes
    }

    const cleanedTerm = searchTerm.trim().replaceAll(/\s+/g, ' ')

    return matchSorter(classes, cleanedTerm, {
      keys: [
        { threshold: matchSorter.rankings.STARTS_WITH, key: 'CRN' },
        { threshold: matchSorter.rankings.STARTS_WITH, key: 'dept' },
        {
          threshold: matchSorter.rankings.CONTAINS,
          key: 'deptName',
        },
        {
          threshold: matchSorter.rankings.WORD_STARTS_WITH,
          key: ({ dept, course }) => `${dept} ${course}`,
        },
        {
          threshold: matchSorter.rankings.WORD_STARTS_WITH,
          key: ({ deptName, course }) => `${deptName} ${course}`,
        },
        {
          threshold: matchSorter.rankings.MATCHES,
          key: ({ dept, deptName, course, title }) =>
            `${dept} ${deptName} ${course} ${title}`,
        },
        {
          minRanking: matchSorter.rankings.MATCHES,
          key: (item) => item.times.map((time) => time.instructor).join(' '),
        },
      ],
    })
  }, [classes, searchTerm])

  const groupedClasses = useMemo(
    () =>
      filteredClasses &&
      filteredClasses.reduce((groups, clazz) => {
        const key = clazz.dept + clazz.course
        const courseClasses = groups[key] || []

        courseClasses.push(clazz)
        groups[key] = courseClasses

        return groups
      }, {}),
    [filteredClasses]
  )

  const onSearchChange = (event) => {
    setInput(event.target.value)
    setPagesToShow(1)
  }

  return (
    <div style={{ width: '100%', maxWidth: '864px' }}>
      <Head>
        <title>Classes | {campus.shortName} Rocks</title>
      </Head>

      <input
        style={{ width: '100%', maxWidth: '100%' }}
        value={input}
        onChange={onSearchChange}
        placeholder={`Search classes at ${campus.name}`}
        className={styles.search}
      />

      {classes && groupedClasses && !Object.keys(groupedClasses).length && (
        <p className={styles2.nothingFound}>
          No classes found! Try typing something else.
        </p>
      )}

      {groupedClasses &&
        Object.entries(groupedClasses)
          .slice(0, pagesToShow * ITEMS_PER_PAGE)
          .map(([key, classes]) => {
            const { dept, course, title, units } = classes[0]

            return (
              <div
                key={key}
                style={{
                  padding: '1em 1em 0.5em',
                  border: 'solid 2px var(--border-color)',
                  margin: '1em 0',
                  borderRadius: '4px',
                }}
              >
                <h4 style={{ margin: '0.2em 0' }}>
                  {dept} {course} ({units.toFixed(1)}) - {title}
                </h4>
                <div className={styles2.sectionsGrid}>
                  {classes.map((clazz) => (
                    <ClassItem key={clazz.CRN} {...clazz} />
                  ))}
                </div>
              </div>
            )
          })}

      {groupedClasses &&
        Object.values(groupedClasses).length > pagesToShow * ITEMS_PER_PAGE && (
          <div className={styles2.showMore}>
            <button onClick={() => setPagesToShow((value) => ++value)}>
              Show More
            </button>
          </div>
        )}
    </div>
  )
}

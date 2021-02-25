import { useState, useEffect, useMemo } from 'react'

import { parseTime } from '../parseTime'
import styles from '../../styles/Calendar.module.css'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Calendar({ categories, clubs, onClubSelected }) {
  const [tabbedView, setTabbedView] = useState(false)
  const [limitItems, setLimitItems] = useState(true)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1000px)')
    const handler = ({ matches }) => setTabbedView(matches);

    handler(query)
    query.addEventListener('change', handler);

    return () => query.removeEventListener('change', handler)
  }, [])

  const timesInfo = useMemo(() => {
    const times = clubs.reduce((times, club) => {
      if (club.meetings) {
        const { day } = club.meetings
        const dayTimes = times[day] || []

        dayTimes.push(club)
        times[day] = dayTimes
      }

      return times
    }, {})

    for (const dayTimes of Object.values(times)) {
      dayTimes.sort((a, b) => parseInt(a.meetings.start_time.slice(0, 2), 10) - parseInt(b.meetings.start_time.slice(0, 2), 10))
    }

    return times
  }, [clubs])

  let itemCountRemaining = 3
  let mainDivs = []
  let showLimiter = false

  for (const day of days) {
    if (!timesInfo[day]) continue
    if (tabbedView && !itemCountRemaining) {
      showLimiter = true
      break
    }

    if (!tabbedView) itemCountRemaining = 3

    const timesDivs = []

    for (const club of timesInfo[day]) {
      if (!itemCountRemaining) {
        showLimiter = true
        break
      }
      if (limitItems) itemCountRemaining--

      const { name, category, meetings: { start_time, end_time, frequency } } = club

      timesDivs.push(
        <div onClick={() => onClubSelected(club)} className={styles.itemCard} style={{ backgroundColor: categories[category].color }}>
          <h4>{name}</h4>
          <div>{parseTime(start_time)} - {parseTime(end_time)}</div>
          <div>{frequency}</div>
        </div>
      )
    }

    if (timesInfo[day]) {
      mainDivs.push(
        <div className={styles.dayColumnContainer}>
          <div className={styles.dayTitle}>
            {day.slice(0, 3).toUpperCase()}
          </div>
          <div className={styles.dayColumn}>
            {timesDivs}
          </div>
        </div>
      )
    }
  }

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.calendar} style={{ flexDirection: tabbedView ? 'column' : 'row' }}>
        {mainDivs}
      </div>
      {limitItems && showLimiter && (
        <div className={styles.showAll}>
          <div className={styles.fadeHider}></div>
          <button onClick={() => setLimitItems(false)}>View All</button>
        </div>
      )}
    </div>
  )

  // return (
  //   <div style={{
  //     width: '100%',
  //     height: '600px',
  //     overflow: 'auto',
  //     margin: '2em',
  //   }}>
  //     <div style={{
  //       display: 'flex',
  //     }}>
  //       <div>
  //         <div style={{ height: '50px' }}></div>
  //         {[...Array(24)].map((_, i) => (
  //           <div style={{ height: '50px', textAlign: 'right', padding: '0 0.5em', marginTop: '-2px' }}>{i ? i : ''}</div>
  //         ))}
  //       </div>
  //       <div style={{ flex: 1 }}>
  //         <div style={{
  //           display: 'flex',
  //           width: '100%',
  //           justifyContent: 'space-around',
  //         }}>
  //           {days.map((day) => (
  //             <div style={{ textAlign: 'center', fontWeight: 'bold', padding: '1em' }}>
  //               {day.slice(0, 3).toUpperCase()}
  //             </div>
  //           ))}
  //         </div>
  //         <div style={{
  //           width: '100%',
  //           // border: 'solid 1px #ddd',
  //           display: 'flex',
  //           flexDirection: 'row',
  //         }}>
  //           {days.map(() => (
  //             <div style={{
  //               flex: 1,
  //               borderLeft: 'solid 1px #eee',
  //               borderRight: 'solid 1px #eee',
  //             }}>
  //               {[...Array(24)].map((_, index) => (
  //                 <div style={{
  //                   width: '100%',
  //                   height: '50px',
  //                   borderTop: 'solid 1px #eee',
  //                   borderBottom: 'solid 1px #eee',
  //                 }}>

  //                 </div>
  //               ))}
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}

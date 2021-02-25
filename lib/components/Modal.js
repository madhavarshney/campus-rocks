import { useEffect, useRef } from 'react'

import styles from '../../styles/Modal.module.css'
import { parseTime } from '../parseTime'

function ClubCard({
  categories,
  name,
  purpose,
  club_representative,
  advisor,
  meetings,
  category,
  email,
}) {
  const { day, start_time, end_time, frequency} = meetings || {}

  return (
    <div className={styles.card}>
      <h3>{name}</h3>
      <p className={styles.description}>{purpose}</p>
      {meetings && (
        <p className={styles.repInfo}>
          Meetings: {day}s {parseTime(start_time)} - {parseTime(end_time)}, {frequency}
        </p>
      )}
      <p className={styles.repInfo}>Category: {categories[category].name}</p>
      {(email || club_representative) && (
        <p className={styles.repInfo}>Email: {email || club_representative.email}</p>
      )}
      {club_representative && (
        <p className={styles.repInfo}>Club Rep: {club_representative.name}</p>
      )}
      {advisor && (
        <p className={styles.repInfo}>Advisor: {advisor.name} {advisor.email || ''}</p>
      )}
    </div>
  )
}

export default function Modal({ categories, club, onClose }) {
  const overlayEl = useRef(null)

  useEffect(() => {
    const escapeListener = (event) => event.keyCode === 27 && onClose()
    const clickOutsideListener = (event) => {
      if (overlayEl.current.contains(event.target)) return

      onClose()
    }

    window.addEventListener('keydown', escapeListener)
    window.addEventListener('mousedown', clickOutsideListener)

    return () => {
      window.removeEventListener('keydown', escapeListener)
      window.removeEventListener('mousedown', clickOutsideListener)
    }
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.modal} ref={overlayEl}>
        <button className={styles.closeButton} onClick={() => onClose()}>&times;</button>
        <ClubCard categories={categories} {...club} />
      </div>
    </div>
  )
}

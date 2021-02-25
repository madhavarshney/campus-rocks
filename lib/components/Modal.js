import { useEffect, useRef } from 'react'

import styles from '../../styles/Modal.module.css'
import { parseTime } from '../parseTime'

function ClubCard({
  // categories,
  name,
  purpose,
  club_representative,
  advisor,
  meetings,
  // category,
  discord,
  email,
}) {
  const { day, start_time, end_time, frequency } = meetings || {}

  return (
    <div className={styles.card}>
      <h3>{name}</h3>
      <p className={styles.description}>{purpose}</p>
      {meetings && (
        <p className={styles.field}>
          <span className={styles.label}>Meetings:</span> {day}s{' '}
          {parseTime(start_time)} - {parseTime(end_time)}, {frequency}
        </p>
      )}
      {discord && (
        <p className={styles.field}>
          <span className={styles.label}>Discord:</span>{' '}
          <a href={discord} target='_blank' rel='noopener noreferrer'>
            {discord}
          </a>
        </p>
      )}
      {/* <p className={styles.field}>Category: {categories[category].name}</p> */}
      {(email || club_representative) && (
        <p className={styles.field}>
          <span className={styles.label}>Email:</span>{' '}
          {email || club_representative.email}
        </p>
      )}
      {club_representative && (
        <p className={styles.field}>
          <span className={styles.label}>Club Representative:</span>{' '}
          {club_representative.name}
        </p>
      )}
      {advisor && (
        <p className={styles.field}>
          <span className={styles.label}>Faculty Advisor:</span> {advisor.name}{' '}
          {advisor.email || ''}
        </p>
      )}
    </div>
  )
}

export default function Modal({ categories, club, onClose }) {
  const overlayEl = useRef(null)

  useEffect(() => {
    document.documentElement.classList.add('noscroll')

    const escapeListener = (event) => event.keyCode === 27 && onClose()
    const clickOutsideListener = (event) => {
      if (overlayEl.current.contains(event.target)) return

      onClose()
    }

    window.addEventListener('keydown', escapeListener)
    window.addEventListener('mousedown', clickOutsideListener)

    return () => {
      document.documentElement.classList.remove('noscroll')

      window.removeEventListener('keydown', escapeListener)
      window.removeEventListener('mousedown', clickOutsideListener)
    }
  }, [onClose])

  return (
    <div className={styles.wrapper}>
      <div className={styles.modal} ref={overlayEl}>
        <button className={styles.closeButton} onClick={() => onClose()}>
          &times;
        </button>
        <ClubCard categories={categories} {...club} />
      </div>
    </div>
  )
}

import styles from '../../styles/ClubList.module.css'
import { parseTime } from '../parseTime'

function ClubCard({
  categories,
  onClick,
  name,
  purpose,
  club_representative,
  advisor,
  discord,
  meetings,
  category,
  email,
}) {
  const { day, start_time, end_time, frequency } = meetings || {}

  return (
    <div
      onClick={() => onClick()}
      className={styles.card}
      style={{ borderLeftColor: categories[category].color }}
    >
      {/* <h3>{name} [{category}]</h3> */}
      <div style={{ display: 'flex' }}>
        <h3 style={{ flex: 1, display: 'inline' }}>{name}</h3>
        {discord && (
          <a href={discord}>
            <img
              alt='Discord purple icon'
              style={{ width: '28px', height: '28px' }}
              src='discord-icon-purple.svg'
            />
          </a>
        )}
      </div>
      <p className={styles.description}>{purpose}</p>
      {meetings && (
        <p className={styles.repInfo}>
          {day}s {parseTime(start_time)} - {parseTime(end_time)}, {frequency}
        </p>
      )}
      {(email || club_representative) && (
        <p className={styles.repInfo}>
          Email: {email || club_representative.email}
        </p>
      )}
      {/* {club_representative && (
        <p className={styles.repInfo}>Club Rep: {club_representative.name}</p>
      )}
      {advisor && (
        <p className={styles.repInfo}>Advisor: {advisor.name} {advisor.email || ''}</p>
      )} */}
    </div>
  )
}

export default function ClubList({ categories, clubs, onClick }) {
  return (
    <div className={styles.grid}>
      {clubs.map((club) => (
        <ClubCard
          key={club.name}
          {...club}
          categories={categories}
          onClick={() => onClick(club)}
        />
      ))}
    </div>
  )
}

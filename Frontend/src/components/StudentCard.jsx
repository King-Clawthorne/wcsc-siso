// The backend sends the photo as a raw base64 string (see API_Requests.md);
// an <img> needs a data: URL, so prefix it unless it's already a URL.
function toPhotoSrc(photo) {
  if (!photo) return null;
  if (photo.startsWith('data:') || photo.startsWith('http')) return photo;
  return `data:image/jpeg;base64,${photo}`;
}

// Presentational card for the student returned by GET /api/student.
export default function StudentCard({ student }) {
  if (!student) return null;

  const {
    name_first,
    name_last,
    year,
    photo,
    currently_out,
    checked_out_equipment = [],
  } = student;

  return (
    <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {photo && (
          <img
            src={toPhotoSrc(photo)}
            alt={`${name_first} ${name_last}`}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        )}
        <div>
          <h2 style={{ margin: 0 }}>
            {name_first} {name_last}
          </h2>
          <p style={{ margin: '0.25rem 0' }}>Year {year}</p>
          <p style={{ margin: 0 }}>
            Status: {currently_out ? 'Out of school' : 'In school'}
          </p>
        </div>
      </div>

      {checked_out_equipment.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <strong>Equipment currently signed out:</strong>
          <ul>
            {checked_out_equipment.map((item) => (
              <li key={item.equipment_id}>
                {item.name} (since {item.time_out})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

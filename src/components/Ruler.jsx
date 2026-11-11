// Fita métrica decorativa: marcas a cada cm, número a cada 5.
export default function Ruler({ count = 40 }) {
  return (
    <div className="ruler" aria-hidden="true">
      {Array.from({ length: count + 1 }, (_, i) => (
        <span key={i} className={i % 5 === 0 ? 'tick tick-lg' : 'tick'}>
          {i % 5 === 0 && <b>{i}</b>}
        </span>
      ))}
    </div>
  )
}

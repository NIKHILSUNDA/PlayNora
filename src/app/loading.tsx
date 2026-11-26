export default function Loading() {
  return (<div className="bg-page min-h-screen px-[6vw] pt-32"><div className="h-12 w-72 animate-pulse rounded bg-white/10" />{[0, 1, 2].map((i) => <div key={i} className="mt-4 h-24 animate-pulse rounded-2xl bg-white/10" />)}</div>);
}

"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (<div className="bg-page grid min-h-[60vh] place-items-center text-center"><div><h2 className="text-3xl font-extrabold">Something went wrong</h2><button className="btn mt-6" onClick={reset}>Try again</button></div></div>);
}

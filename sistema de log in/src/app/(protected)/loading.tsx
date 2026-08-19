export default function ProtectedLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 animate-pulse border-b bg-white" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-24">
        <div className="mx-auto h-10 w-96 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto h-6 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto mt-10 h-14 w-48 animate-pulse rounded-xl bg-gray-200" />
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

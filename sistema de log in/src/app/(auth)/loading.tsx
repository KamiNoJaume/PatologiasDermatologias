export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <div className="space-y-4">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-4">
          <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

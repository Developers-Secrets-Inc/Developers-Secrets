// src/app/confirmation/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    checkoutId: string
  }>
}) {
  const { checkoutId } = await searchParams

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Thank you!</h1>
      <p className="text-xl text-gray-600">
        Your checkout ({checkoutId}) is now being processed.
      </p>
      <p className="mt-4 text-sm text-gray-500">You will receive a confirmation email shortly.</p>
    </div>
  )
}

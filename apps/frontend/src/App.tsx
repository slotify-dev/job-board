import { useState } from 'react'

export function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Board</h1>
        <p className="text-gray-600 mb-4">Frontend is ready!</p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Count is {count}
        </button>
      </div>
    </div>
  )
}
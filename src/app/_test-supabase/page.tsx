import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-20">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {todos && todos.length > 0 ? (
        <ul className="list-disc pl-5">
          {todos.map((todo: any) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No todos found in your Supabase 'todos' table. (Connection is working if you see this message without error).</p>
      )}
      <div className="mt-8">
        <a href="/" className="text-purple-600 hover:underline">← Back to BSt Home</a>
      </div>
    </div>
  )
}

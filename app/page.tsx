import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Yacht Experience</h1>
      <p className="text-xl mb-8">Discover luxury on the waves</p>
      <Button asChild>
        <Link href="/explore">Start Exploring</Link>
      </Button>
    </main>
  )
}


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">KOODOS - About Us</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">About KOODOS</h1>
        <div className="prose prose-lg max-w-none">
          <p>Welcome to KOODOS, your ultimate destination for gaming news, reviews, and entertainment content.</p>
          <p>We are passionate about bringing you the latest updates from the world of gaming, technology, and entertainment.</p>
        </div>
      </main>
    </div>
  )
}
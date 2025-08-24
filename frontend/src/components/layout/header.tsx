import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              KataCore
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link href="/posts" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Posts
            </Link>
            <Link href="/todos" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Todos
            </Link>
            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Documentation
            </a>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link
              href="/login"
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

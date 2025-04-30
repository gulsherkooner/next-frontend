import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Auth App</h1>
      <Link href={'/dashboard'} >Dashboard</Link> <br/>
      <Link href={'/signup'} >Register</Link> <br/>
      <Link href={'/login'} >Login</Link>
    </div>
  );
}

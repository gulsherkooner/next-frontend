import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Welcome to My Auth App</h1>
      <Link href={'/dashboard'} >Dashboard</Link> <br/>
      <Link href={'/register'} >Register</Link> <br/>
      <Link href={'/login'} >Login</Link>
    </div>
  );
}

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Willkommen in Wendessen</h1>
      <p className="mt-4 text-lg text-gray-600">
        Die offizielle Website der Ortschaft Wendessen
      </p>
    </div>
  );
}

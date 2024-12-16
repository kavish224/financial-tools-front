import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar/>
        <div className="flex-grow flex justify-center min-h-screen">
          <h1 className="text-3xl p-16">Empower your Financial Future</h1>
        </div>
      <Footer/>
    </div>
  );
}

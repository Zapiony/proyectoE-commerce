'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Boton from "@/components/ui/buttonGeneral";

export default function Home() {
  const router = useRouter();

  return (
    <div className="homeMain">
      <div className="hero">
        <h1>Sección de encuesta</h1>
        <h2>En una sola tienda</h2>
      </div>
    </div>
  );
}
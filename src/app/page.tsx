'use client';

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Boton from "@/components/ui/buttonGeneral";
import { getClientDetails } from '@/service/clienteDP';

export default function Home() {
  const router = useRouter();

  return (
    <div className="homeMain">
      <div className="hero">
        <h1>Todo lo que buscas</h1>
        <h2>En una sola tienda</h2>
        <Boton texto="Ver productos" onClick={() => router.push('/productos')} />
      </div>
    </div>
  );
}

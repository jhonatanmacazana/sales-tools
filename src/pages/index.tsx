import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { trpc } from "@/utils/trpc";

interface CardProps {
  url: string;
  title?: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ url, title, description }) => {
  return (
    <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-gray-500 p-6 text-center shadow-xl duration-500 hover:scale-105">
      <h2 className="text-lg text-gray-300">{title}</h2>
      <p className="text-sm text-gray-400">{description}</p>
      <Link href={url} passHref>
        <a className="mt-3 cursor-pointer text-sm text-violet-500 underline decoration-dotted underline-offset-2">
          Ver
        </a>
      </Link>
    </div>
  );
};

const Home: NextPage = () => {
  const hello = trpc.proxy.example.hello.useQuery({ text: "desde Cieneguilla" });

  return (
    <>
      <Head>
        <title>Herramientas de venta</title>
        <meta name="description" content="Aplicación web para consumir herramientas de venta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen w-screen flex-col items-center justify-center overflow-y-scroll p-4">
        <h2 className="text-[3rem] font-extrabold text-purple-300 md:text-[5rem] lg:text-[5rem]">
          Exquisicao
        </h2>

        <p className="text-2xl text-gray-300">Herramientas disponibles</p>

        <div className="mt-3 grid w-full grid-cols-1 grid-rows-3 items-center justify-center gap-3 pt-3 md:w-full md:grid-cols-2 md:grid-rows-2 lg:w-2/3 lg:grid-cols-2 lg:grid-rows-2">
          <Card
            title="Caja"
            description="Calculadora y otras herramientas para cerrar caja"
            url="/caja"
          />

          <Card
            title="Inventario"
            description="Si quiere revisar o actualizar el inventario, puede ingresar aqui"
            url="/inventario"
          />
        </div>

        <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
          {hello.data ? <p>{hello.data.greeting}</p> : <p>Cargando..</p>}
        </div>
      </div>
    </>
  );
};

export default Home;

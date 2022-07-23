import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { FaFacebook, FaSignOutAlt } from "react-icons/fa";

import { Link } from "@/components/Link";

const Card: React.FC<{
  url: string;
  title?: string;
  description?: string;
}> = ({ url, title, description }) => {
  return (
    <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-gray-500 p-6 text-center shadow-xl duration-500 hover:scale-105">
      <h2 className="text-lg text-gray-300">{title}</h2>
      <p className="text-sm text-gray-400">{description}</p>
      <Link
        href={url}
        className="mt-3 cursor-pointer text-sm text-violet-500 underline decoration-dotted underline-offset-2"
      >
        Ver
      </Link>
    </div>
  );
};

const UserInformation = () => {
  const { data } = useSession();

  if (!data)
    return (
      <div className="flex w-full flex-col items-center justify-center pt-6 text-lg">
        <p>Hola! Haz click para ingresar</p>
        <div className="p-2" />
        <button
          className="flex items-center gap-2 rounded bg-gray-200 px-4 py-2 text-lg text-black"
          onClick={() => signIn("facebook")}
        >
          <FaFacebook size={24} />
          <span>Ingresar con Facebook</span>
        </button>
      </div>
    );

  return (
    <div className="flex w-full flex-col items-center justify-center pt-6 text-xl">
      <p>{`Hola ${data.user?.name}!`}</p>
      <div className="p-2" />
      <button
        className="flex items-center gap-2 rounded bg-gray-200 px-4 py-2 text-lg text-black"
        onClick={() => signOut()}
      >
        <FaSignOutAlt size={24} />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
};

const Home: NextPage = () => {
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

        <UserInformation />
      </div>
    </>
  );
};

export default Home;

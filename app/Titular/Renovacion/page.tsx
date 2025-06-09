// pages/renovacion.tsx

import Link from "next/link";

export default function RenovacionPage() {
    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Renovación de Licencia
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Seleccione el motivo por el cual desea renovar su licencia.
                </p>

                <div className="flex flex-col gap-4">
                    <Link href="/renovacion/vigencia">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">
                            Por Vigencia
                        </button>
                    </Link>
                    <Link href="/renovacion/cambio-datos">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">
                            Por Cambio de Datos
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

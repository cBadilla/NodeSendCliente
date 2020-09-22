import React, { useState, useEffect, useContext, Fragment } from 'react';

import Layout from '../../components/Layout';
import Alerta from '../../components/Alerta';
import clienteAxios from '../../config/axios';
import appContext from '../../context/app/appContext';



export async function getServerSideProps({ params }) {

    const { enlace } = params;
    const resultado = await clienteAxios.get(`/api/enlaces/${enlace}`);

    return {
        props: {
            enlace: resultado.data
        }
    }
}

export async function getServerSidePaths() {
    const enlaces = await clienteAxios.get('/api/enlaces');

    return {
        paths: enlaces.data.enlaces.map((enlace) => ({
            params: { enlace: enlace.url }
        })),
        fallback: false
    }

}

const enlace = ({ enlace }) => {

    //Extraer el mensaje de error
    const AppContext = useContext(appContext);
    const { descargas, mostrarAlerta, mensaje_archivo } = AppContext;

    const [tienePassword, setTienePassword] = useState(enlace.password);
    const [password, setPassword] = useState('');
    const [nombreArchivo, setNombreAarchivo] = useState('');


    const verificarPassword = async (e) => {
        e.preventDefault();

        const data = {
            password
        }

        try {

            const resultado = await clienteAxios.post(`/api/enlaces/${enlace.enlace}`, data);
            setTienePassword(resultado.data.password);
            setNombreAarchivo(resultado.data.archivo);

        } catch (error) {
            mostrarAlerta(error.response.data.msg)
        }


    }

    useEffect(()=>{
        if(!enlace.password){
            setNombreAarchivo(enlace.archivo);
        }
    },[])

    console.log(process.env.backendURL)

    return (
        <Layout>
            {
                tienePassword ? (
                    <Fragment>
                        <p className="text-center">Ingresa la contraseña del archivo para habilitar la descarga.</p>
                        { mensaje_archivo && <Alerta />}
                        <div className="flex justify-center mt-5">
                            <div className="w-full max-w-lg">
                                <form
                                    className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={e => verificarPassword(e)}
                                >
                                    <div className="mb-4">
                                        <label
                                            className="block text-black text-sm font-bold mb-2"
                                            htmlFor="password"
                                        >Contraseña</label>
                                        <input
                                            type="password"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="password"
                                            placeholder="Contraseña del enlace"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <input
                                        type="submit"
                                        className="bg-red-500 hover:bg-gray-900 rounded w-full p-2 text-white uppercase font-bold"
                                        value="Validar Contraseña"
                                    />
                                </form>
                            </div>
                        </div>
                    </Fragment>
                ) : (
                        <Fragment>
                            <h1 className="text-4xl text-center text-gray-700">Descarga el archivo:</h1>
                            <div className="flex items-center justify-center mt-10">
                                <a
                                    href={ `${process.env.backendURL + '/api/archivos/' + nombreArchivo}` }
                                    className="bg-red-500 text-center px-10 py-3 rounded uppercase font-bold text-white cursor-pointer"
                                    
                                    download
                                >Aquí</a>
                            </div>
                        </Fragment>
                    )
            }

        </Layout>
    )
}

export default enlace;
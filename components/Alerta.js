import React, { useContext } from 'react';

import authContext from '../context/auth/authContext';
import appContext from '../context/app/appContext';

const Alerta = () => {

    //Mensaje de error para el usuarios
    const AuthContext = useContext(authContext);
    const { mensaje } = AuthContext;

    //Mensaje de error del archivo
    const AppContext = useContext(appContext);
    const { mensaje_archivo } = AppContext;


    return (
        <div className="bg-red-500 py-2 px-3 rounded w-full my-3 max-w-lg text-center text-white mx-auto">
            { mensaje || mensaje_archivo}
        </div>
    );
}

export default Alerta;

import axios from "axios"
import Swal from 'sweetalert2'
import {HttpStatus} from "@/core/constants.js";

axios.interceptors.request.use((request) => {
    document.getElementById('loading-component').classList.remove('hidden')
    return request
})

axios.interceptors.response.use(response => {
    document.getElementById('loading-component').classList.add('hidden')
    return response
}, error => {
    console.error('Error petición', error)
    document.getElementById('loading-component').classList.add('hidden')
    const {status} = error.response
    if (status === HttpStatus.BAD_REQUEST) {
        Swal.fire({
            icon: "warning",
            title: "Error de validación de campos",
            text: `${error.response.data.detail.join('\n')}`,
        })
    } else if (status === HttpStatus.UNAUTHORIZED) {
        Swal.fire({
            icon: "warning",
            title: "Sesión expirada",
            text: "La sesión ha expirado",
        })
    } else if (status === HttpStatus.FORBIDDEN) {
        Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "No tiene permisos para realizar esta acción",
        })
    } else if (status === HttpStatus.NOT_FOUND) {
        Swal.fire({
            icon: "warning",
            title: "No encontrado",
            text: `No se encontró la ruta ${error.response.data.path}`,
        })
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        Swal.fire({
            icon: "warning",
            title: "Error interno del servidor",
            text: error.response.data.message,
        })
    }
    return Promise.reject(error)
    // {
    //     "data": {
    //     "message": "Orden Nro 446288 creada exitosamente",
    //         "totalPrice": 20830,
    //         "totalQuantity": 17,
    //         "totalQuantity": 17,
    //         "estimatedDelivered": "2024-02-18T16:47:35.075Z",
    //         "orderCode": "446288"
    // },
    //     "status": 201,
    //     "statusText": "Created",
    //     "headers": {
    //     "content-length": "157",
    //         "content-type": "application/json; charset=utf-8"
    // },
    //     "config": {
    //     "transitional": {
    //         "silentJSONParsing": true,
    //             "forcedJSONParsing": true,
    //             "clarifyTimeoutError": false
    //     },
    //     "adapter": [
    //         "xhr",
    //         "http"
    //     ],
    //         "transformRequest": [
    //         null
    //     ],
    //         "transformResponse": [
    //         null
    //     ],
    //         "timeout": 0,
    //         "xsrfCookieName": "XSRF-TOKEN",
    //         "xsrfHeaderName": "X-XSRF-TOKEN",
    //         "maxContentLength": -1,
    //         "maxBodyLength": -1,
    //         "env": {},
    //     "headers": {
    //         "Accept": "application/json, text/plain, */*",
    //             "Content-Type": "application/json"
    //     },
    //     "method": "post",
    //         "url": "http://localhost:3002/order/create",
    //         "data": "{\"customer\":{\"email\":\"edwint0823@gmail.com\",\"name\":\"EDWIN TOBIAS ARIZA TELLEZ\",\"phone_number\":\"315 568 0091\",\"price_type\":\"detal\"},\"candles\":[{\"candle_option_id\":4,\"name_list\":[{\"name\":\"Salud\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Gratitud\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Respeto\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Sabiduria\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Riqueza\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Dios\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Tranquilidad\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Paz\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Amor\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Esperanza\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Felicidad\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Trabajo\",\"packAlone\":false,\"deceased\":false,\"pet\":false}],\"price\":15000,\"quantity\":12,\"observation\":\"Salud en letra negra\"},{\"candle_option_id\":2,\"name_list\":[{\"name\":\"Edwin\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Tobias\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Ariza \",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Tellez\",\"packAlone\":false,\"deceased\":false,\"pet\":false},{\"name\":\"Familia Puentes Tellez\",\"packAlone\":false,\"deceased\":false,\"pet\":false}],\"price\":5830,\"quantity\":5,\"observation\":\"Sin obsevaciones\"}]}"
    // },
    //     "request": {}
    // }
    // todo identificar codigos de error y lanzar alerta segun codeigo de erro
})

export default axios
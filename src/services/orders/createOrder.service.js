export const getDataClientByEmail = async (email) => {
    return {
        found: false,
        name: 'EDWIN TOBIAS ARIZA TELLEZ',
        tel: '315 568 0091',
        priceType: 'mayorista'//detal
    }
}

export const getCandleListOptions = async () => {
    return {
        minimumSizeBulkPrice: 2,
        candleListOptions: [
            {
                label: 'Vela blanca',
                items: [
                    {
                        id: 1,
                        name: 'Vela blanca letra negra cursiva',
                        urlImage: 'https://res.cloudinary.com/dcrozdskk/image/upload/v1705685076/FOTOS_P_VELITAS_APP/cwzfq9gli2v0zqfzitiv.jpg',
                        isPack: false,
                        packNames: [],
                        bulkPrice: 12000,
                        retailPrice: 14000
                    },
                    {
                        id: 2,
                        name: 'Deseos vela blanca letra negra cursiva',
                        urlImage: 'https://res.cloudinary.com/dcrozdskk/image/upload/v1705685076/FOTOS_P_VELITAS_APP/cwzfq9gli2v0zqfzitiv.jpg',
                        isPack: true,
                        packNames: ['Trabajo', 'Felicidad', 'Esperanza', 'Amor', 'Paz', 'Tranquilidad', 'Dios', 'Riqueza', 'Sabiduria', 'Respeto', 'Gratitud', 'Salud'],
                        bulkPrice: 12000,
                        retailPrice: 14000
                    },
                    {
                        id: 3,
                        name: 'Vela blanca letra negra ST',
                        bulkPrice: 13000,
                        urlImage: 'https://res.cloudinary.com/dcrozdskk/image/upload/v1705685076/FOTOS_P_VELITAS_APP/ag0hpfvdkler2aiv0cqi.jpg',
                        isPack: false,
                        packNames: [],
                        retailPrice: 15000
                    }
                ]
            },
            {
                label: 'Vela de colores',
                items: [
                    {
                        id: 4,
                        name: 'Vela de colores letra negra ST',
                        urlImage: 'https://res.cloudinary.com/dcrozdskk/image/upload/v1705685076/FOTOS_P_VELITAS_APP/dzuvlindvf4n6vxwrb7k.jpg',
                        isPack: false,
                        packNames: [],
                        bulkPrice: 12000,
                        retailPrice: 14000
                    }
                ]
            }]
    }
}
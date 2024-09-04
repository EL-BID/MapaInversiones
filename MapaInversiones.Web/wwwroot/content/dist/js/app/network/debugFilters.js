define(function(){
	return [
        {
            "name": "Región",
            "parameter": "region",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Comunes",
            "items": [
                {
                    "dependsOn": null,
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REGION DEL LLANO",
                    "value": "01",
                    "subTipo": null
                },
                {
                    "dependsOn": null,
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REGION CENTRO SUR AMAZONIA",
                    "value": "02",
                    "subTipo": null
                },
                {
                    "dependsOn": null,
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REGION CARIBE",
                    "value": "03",
                    "subTipo": null
                },
                {
                    "dependsOn": null,
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REGION CENTRO ORIENTE",
                    "value": "04",
                    "subTipo": null
                },
                {
                    "dependsOn": null,
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REGION EJE CAFETERO",
                    "value": "05",
                    "subTipo": null
                },
                {
                    "dependsOn": null,
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REGION PACIFICO",
                    "value": "06",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Departamento",
            "parameter": "departamento",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Comunes",
            "items": [
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "02"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AMAZONAS",
                    "value": "91",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANTIOQUIA",
                    "value": "05",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "01"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARAUCA",
                    "value": "81",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "03"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ATLANTICO",
                    "value": "08",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "04"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOGOTA",
                    "value": "11",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "03"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOLIVAR",
                    "value": "13",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "04"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOYACA",
                    "value": "15",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALDAS",
                    "value": "17",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "02"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAQUETA",
                    "value": "18",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "01"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CASANARE",
                    "value": "85",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "06"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAUCA",
                    "value": "19",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "03"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CESAR",
                    "value": "20",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "06"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHOCO",
                    "value": "27",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "03"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CORDOBA",
                    "value": "23",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "04"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUNDINAMARCA",
                    "value": "25",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "01"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAINIA",
                    "value": "94",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "01"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAVIARE",
                    "value": "95",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "02"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HUILA",
                    "value": "41",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "03"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA GUAJIRA",
                    "value": "44",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "03"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MAGDALENA",
                    "value": "47",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "01"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "META",
                    "value": "50",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "06"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NARIÑO",
                    "value": "52",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "04"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NORTE DE SANTANDER",
                    "value": "54",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "02"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUTUMAYO",
                    "value": "86",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "QUINDIO",
                    "value": "63",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RISARALDA",
                    "value": "66",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "03"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANDRES",
                    "value": "88",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "04"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTANDER",
                    "value": "68",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "03"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUCRE",
                    "value": "70",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "02"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOLIMA",
                    "value": "73",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "06"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALLE",
                    "value": "76",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "01"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VAUPES",
                    "value": "97",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "region",
                            "id": "01"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VICHADA",
                    "value": "99",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Municipio",
            "parameter": "municipio",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Comunes",
            "items": [
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ABEJORRAL, ANTIOQUIA",
                    "value": "05002",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ABREGO, NORTE DE SANTANDER",
                    "value": "54003",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ABRIAQUI, ANTIOQUIA",
                    "value": "05004",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ACACIAS, META",
                    "value": "50006",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ACANDI, CHOCO",
                    "value": "27006",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ACEVEDO, HUILA",
                    "value": "41006",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ACHI, BOLIVAR",
                    "value": "13006",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AGRADO, HUILA",
                    "value": "41013",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AGUA DE DIOS, CUNDINAMARCA",
                    "value": "25001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AGUACHICA, CESAR",
                    "value": "20011",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AGUADA, SANTANDER",
                    "value": "68013",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AGUADAS, CALDAS",
                    "value": "17013",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AGUAZUL, CASANARE",
                    "value": "85010",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AGUSTIN CODAZZI, CESAR",
                    "value": "20013",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AIPE, HUILA",
                    "value": "41016",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALBAN, CUNDINAMARCA",
                    "value": "25019",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALBAN, NARIÑO",
                    "value": "52019",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALBANIA, CAQUETA",
                    "value": "18029",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALBANIA, LA GUAJIRA",
                    "value": "44035",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALBANIA, SANTANDER",
                    "value": "68020",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALCALA, VALLE",
                    "value": "76020",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALDANA, NARIÑO",
                    "value": "52022",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALEJANDRIA, ANTIOQUIA",
                    "value": "05021",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALGARROBO, MAGDALENA",
                    "value": "47030",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALGECIRAS, HUILA",
                    "value": "41020",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALMAGUER, CAUCA",
                    "value": "19022",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALMEIDA, BOYACA",
                    "value": "15022",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALPUJARRA, TOLIMA",
                    "value": "73024",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALTAMIRA, HUILA",
                    "value": "41026",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALTO BAUDO, CHOCO",
                    "value": "27025",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALTOS DEL ROSARIO, BOLIVAR",
                    "value": "13030",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ALVARADO, TOLIMA",
                    "value": "73026",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AMAGA, ANTIOQUIA",
                    "value": "05030",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AMALFI, ANTIOQUIA",
                    "value": "05031",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AMBALEMA, TOLIMA",
                    "value": "73030",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANAPOIMA, CUNDINAMARCA",
                    "value": "25035",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANCUYA, NARIÑO",
                    "value": "52036",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANDALUCIA, VALLE",
                    "value": "76036",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANDES, ANTIOQUIA",
                    "value": "05034",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANGELOPOLIS, ANTIOQUIA",
                    "value": "05036",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANGOSTURA, ANTIOQUIA",
                    "value": "05038",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANOLAIMA, CUNDINAMARCA",
                    "value": "25040",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANORI, ANTIOQUIA",
                    "value": "05040",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANSERMA, CALDAS",
                    "value": "17042",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANSERMANUEVO, VALLE",
                    "value": "76041",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANZA, ANTIOQUIA",
                    "value": "05044",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ANZOATEGUI, TOLIMA",
                    "value": "73043",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "APARTADO, ANTIOQUIA",
                    "value": "05045",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "APIA, RISARALDA",
                    "value": "66045",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "APULO, CUNDINAMARCA",
                    "value": "25599",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AQUITANIA, BOYACA",
                    "value": "15047",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARACATACA, MAGDALENA",
                    "value": "47053",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARANZAZU, CALDAS",
                    "value": "17050",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARATOCA, SANTANDER",
                    "value": "68051",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "81"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARAUCA, ARAUCA",
                    "value": "81001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "81"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARAUQUITA, ARAUCA",
                    "value": "81065",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARBELAEZ, CUNDINAMARCA",
                    "value": "25053",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARBOLEDA, NARIÑO",
                    "value": "52051",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARBOLEDAS, NORTE DE SANTANDER",
                    "value": "54051",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARBOLETES, ANTIOQUIA",
                    "value": "05051",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARCABUCO, BOYACA",
                    "value": "15051",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARENAL, BOLIVAR",
                    "value": "13042",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARGELIA, ANTIOQUIA",
                    "value": "05055",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARGELIA, CAUCA",
                    "value": "19050",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARGELIA, VALLE",
                    "value": "76054",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARIGUANI, MAGDALENA",
                    "value": "47058",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARJONA, BOLIVAR",
                    "value": "13052",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARMENIA, ANTIOQUIA",
                    "value": "05059",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARMENIA, QUINDIO",
                    "value": "63001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARMERO, TOLIMA",
                    "value": "73055",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ARROYOHONDO, BOLIVAR",
                    "value": "13062",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ASTREA, CESAR",
                    "value": "20032",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ATACO, TOLIMA",
                    "value": "73067",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ATRATO, CHOCO",
                    "value": "27050",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "AYAPEL, CORDOBA",
                    "value": "23068",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BAGADO, CHOCO",
                    "value": "27073",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BAHIA SOLANO, CHOCO",
                    "value": "27075",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BAJO BAUDO, CHOCO",
                    "value": "27077",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BALBOA, CAUCA",
                    "value": "19075",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BALBOA, RISARALDA",
                    "value": "66075",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARANOA, ATLANTICO",
                    "value": "08078",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARAYA, HUILA",
                    "value": "41078",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARBACOAS, NARIÑO",
                    "value": "52079",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARBOSA, ANTIOQUIA",
                    "value": "05079",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARBOSA, SANTANDER",
                    "value": "68077",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARICHARA, SANTANDER",
                    "value": "68079",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARRANCA DE UPIA, META",
                    "value": "50110",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARRANCABERMEJA, SANTANDER",
                    "value": "68081",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARRANCAS, LA GUAJIRA",
                    "value": "44078",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARRANCO DE LOBA, BOLIVAR",
                    "value": "13074",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARRANCO MINAS, GUAINIA",
                    "value": "94343",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BARRANQUILLA, ATLANTICO",
                    "value": "08001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BECERRIL, CESAR",
                    "value": "20045",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BELALCAZAR, CALDAS",
                    "value": "17088",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BELEN, BOYACA",
                    "value": "15087",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BELEN, NARIÑO",
                    "value": "52083",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BELEN DE LOS ANDAQUIES, CAQUETA",
                    "value": "18094",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BELEN DE UMBRIA, RISARALDA",
                    "value": "66088",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BELLO, ANTIOQUIA",
                    "value": "05088",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BELMIRA, ANTIOQUIA",
                    "value": "05086",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BELTRAN, CUNDINAMARCA",
                    "value": "25086",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BERBEO, BOYACA",
                    "value": "15090",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BETANIA, ANTIOQUIA",
                    "value": "05091",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BETEITIVA, BOYACA",
                    "value": "15092",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BETULIA, ANTIOQUIA",
                    "value": "05093",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BETULIA, SANTANDER",
                    "value": "68092",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BITUIMA, CUNDINAMARCA",
                    "value": "25095",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOAVITA, BOYACA",
                    "value": "15097",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOCHALEMA, NORTE DE SANTANDER",
                    "value": "54099",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "11"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOGOTA, D.C, BOGOTA",
                    "value": "11001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOJACA, CUNDINAMARCA",
                    "value": "25099",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOJAYA, CHOCO",
                    "value": "27099",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOLIVAR, CAUCA",
                    "value": "19100",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOLIVAR, SANTANDER",
                    "value": "68101",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOLIVAR, VALLE",
                    "value": "76100",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOSCONIA, CESAR",
                    "value": "20060",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BOYACA, BOYACA",
                    "value": "15104",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BRICEÑO, ANTIOQUIA",
                    "value": "05107",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BRICEÑO, BOYACA",
                    "value": "15106",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUCARAMANGA, SANTANDER",
                    "value": "68001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUCARASICA, NORTE DE SANTANDER",
                    "value": "54109",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUENAVENTURA, VALLE",
                    "value": "76109",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUENAVISTA, BOYACA",
                    "value": "15109",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUENAVISTA, CORDOBA",
                    "value": "23079",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUENAVISTA, QUINDIO",
                    "value": "63111",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUENAVISTA, SUCRE",
                    "value": "70110",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUENOS AIRES, CAUCA",
                    "value": "19110",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUESACO, NARIÑO",
                    "value": "52110",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUGALAGRANDE, VALLE",
                    "value": "76113",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BURITICA, ANTIOQUIA",
                    "value": "05113",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "BUSBANZA, BOYACA",
                    "value": "15114",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CABRERA, CUNDINAMARCA",
                    "value": "25120",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CABRERA, SANTANDER",
                    "value": "68121",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CABUYARO, META",
                    "value": "50124",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CACAHUAL, GUAINIA",
                    "value": "94886",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CACERES, ANTIOQUIA",
                    "value": "05120",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CACHIPAY, CUNDINAMARCA",
                    "value": "25123",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CACHIRA, NORTE DE SANTANDER",
                    "value": "54128",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CACOTA, NORTE DE SANTANDER",
                    "value": "54125",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAICEDO, ANTIOQUIA",
                    "value": "05125",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAICEDONIA, VALLE",
                    "value": "76122",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAIMITO, SUCRE",
                    "value": "70124",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAJAMARCA, TOLIMA",
                    "value": "73124",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAJIBIO, CAUCA",
                    "value": "19130",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAJICA, CUNDINAMARCA",
                    "value": "25126",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALAMAR, BOLIVAR",
                    "value": "13140",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "95"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALAMAR, GUAVIARE",
                    "value": "95015",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALARCA, QUINDIO",
                    "value": "63130",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALDAS, ANTIOQUIA",
                    "value": "05129",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALDAS, BOYACA",
                    "value": "15131",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALDONO, CAUCA",
                    "value": "19137",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALI, VALLE",
                    "value": "76001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALIFORNIA, SANTANDER",
                    "value": "68132",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALIMA, VALLE",
                    "value": "76126",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CALOTO, CAUCA",
                    "value": "19142",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAMPAMENTO, ANTIOQUIA",
                    "value": "05134",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAMPO DE LA CRUZ, ATLANTICO",
                    "value": "08137",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAMPOALEGRE, HUILA",
                    "value": "41132",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAMPOHERMOSO, BOYACA",
                    "value": "15135",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CANALETE, CORDOBA",
                    "value": "23090",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CANDELARIA, ATLANTICO",
                    "value": "08141",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CANDELARIA, VALLE",
                    "value": "76130",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CANTAGALLO, BOLIVAR",
                    "value": "13160",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAÑASGORDAS, ANTIOQUIA",
                    "value": "05138",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAPARRAPI, CUNDINAMARCA",
                    "value": "25148",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAPITANEJO, SANTANDER",
                    "value": "68147",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAQUEZA, CUNDINAMARCA",
                    "value": "25151",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARACOLI, ANTIOQUIA",
                    "value": "05142",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARAMANTA, ANTIOQUIA",
                    "value": "05145",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARCASI, SANTANDER",
                    "value": "68152",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAREPA, ANTIOQUIA",
                    "value": "05147",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARMEN DE APICALA, TOLIMA",
                    "value": "73148",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARMEN DE CARUPA, CUNDINAMARCA",
                    "value": "25154",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARMEN DEL DARIEN, CHOCO",
                    "value": "27150",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAROLINA, ANTIOQUIA",
                    "value": "05150",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARTAGENA, BOLIVAR",
                    "value": "13001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARTAGENA DEL CHAIRA, CAQUETA",
                    "value": "18150",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARTAGO, VALLE",
                    "value": "76147",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "97"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CARURU, VAUPES",
                    "value": "97161",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CASABIANCA, TOLIMA",
                    "value": "73152",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CASTILLA LA NUEVA, META",
                    "value": "50150",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CAUCASIA, ANTIOQUIA",
                    "value": "05154",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CEPITA, SANTANDER",
                    "value": "68160",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CERETE, CORDOBA",
                    "value": "23162",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CERINZA, BOYACA",
                    "value": "15162",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CERRITO, SANTANDER",
                    "value": "68162",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CERRO SAN ANTONIO, MAGDALENA",
                    "value": "47161",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CERTEGUI, CHOCO",
                    "value": "27160",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHACHAGÜI, NARIÑO",
                    "value": "52240",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHAGUANI, CUNDINAMARCA",
                    "value": "25168",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHALAN, SUCRE",
                    "value": "70230",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHAMEZA, CASANARE",
                    "value": "85015",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHAPARRAL, TOLIMA",
                    "value": "73168",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHARALA, SANTANDER",
                    "value": "68167",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHARTA, SANTANDER",
                    "value": "68169",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIA, CUNDINAMARCA",
                    "value": "25175",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIGORODO, ANTIOQUIA",
                    "value": "05172",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIMA, CORDOBA",
                    "value": "23168",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIMA, SANTANDER",
                    "value": "68176",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIMICHAGUA, CESAR",
                    "value": "20175",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHINACOTA, NORTE DE SANTANDER",
                    "value": "54172",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHINAVITA, BOYACA",
                    "value": "15172",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHINCHINA, CALDAS",
                    "value": "17174",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHINU, CORDOBA",
                    "value": "23182",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIPAQUE, CUNDINAMARCA",
                    "value": "25178",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIPATA, SANTANDER",
                    "value": "68179",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIQUINQUIRA, BOYACA",
                    "value": "15176",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIQUIZA, BOYACA",
                    "value": "15232",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIRIGUANA, CESAR",
                    "value": "20178",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHISCAS, BOYACA",
                    "value": "15180",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHITA, BOYACA",
                    "value": "15183",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHITAGA, NORTE DE SANTANDER",
                    "value": "54174",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHITARAQUE, BOYACA",
                    "value": "15185",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIVATA, BOYACA",
                    "value": "15187",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIVOLO, MAGDALENA",
                    "value": "47170",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHIVOR, BOYACA",
                    "value": "15236",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHOACHI, CUNDINAMARCA",
                    "value": "25181",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CHOCONTA, CUNDINAMARCA",
                    "value": "25183",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CICUCO, BOLIVAR",
                    "value": "13188",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CIENAGA, MAGDALENA",
                    "value": "47189",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CIENAGA DE ORO, CORDOBA",
                    "value": "23189",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CIENEGA, BOYACA",
                    "value": "15189",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CIMITARRA, SANTANDER",
                    "value": "68190",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CIRCASIA, QUINDIO",
                    "value": "63190",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CISNEROS, ANTIOQUIA",
                    "value": "05190",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CIUDAD BOLIVAR, ANTIOQUIA",
                    "value": "05101",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CLEMENCIA, BOLIVAR",
                    "value": "13222",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COCORNA, ANTIOQUIA",
                    "value": "05197",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COELLO, TOLIMA",
                    "value": "73200",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COGUA, CUNDINAMARCA",
                    "value": "25200",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COLOMBIA, HUILA",
                    "value": "41206",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COLON, NARIÑO",
                    "value": "52203",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COLON, PUTUMAYO",
                    "value": "86219",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COLOSO, SUCRE",
                    "value": "70204",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COMBITA, BOYACA",
                    "value": "15204",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONCEPCION, ANTIOQUIA",
                    "value": "05206",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONCEPCION, SANTANDER",
                    "value": "68207",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONCORDIA, ANTIOQUIA",
                    "value": "05209",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONCORDIA, MAGDALENA",
                    "value": "47205",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONDOTO, CHOCO",
                    "value": "27205",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONFINES, SANTANDER",
                    "value": "68209",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONSACA, NARIÑO",
                    "value": "52207",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONTADERO, NARIÑO",
                    "value": "52210",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONTRATACION, SANTANDER",
                    "value": "68211",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CONVENCION, NORTE DE SANTANDER",
                    "value": "54206",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COPACABANA, ANTIOQUIA",
                    "value": "05212",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COPER, BOYACA",
                    "value": "15212",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CORDOBA, BOLIVAR",
                    "value": "13212",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CORDOBA, NARIÑO",
                    "value": "52215",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CORDOBA, QUINDIO",
                    "value": "63212",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CORINTO, CAUCA",
                    "value": "19212",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COROMORO, SANTANDER",
                    "value": "68217",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COROZAL, SUCRE",
                    "value": "70215",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CORRALES, BOYACA",
                    "value": "15215",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COTA, CUNDINAMARCA",
                    "value": "25214",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COTORRA, CORDOBA",
                    "value": "23300",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COVARACHIA, BOYACA",
                    "value": "15218",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COVEÑAS, SUCRE",
                    "value": "70221",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "COYAIMA, TOLIMA",
                    "value": "73217",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "81"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CRAVO NORTE, ARAUCA",
                    "value": "81220",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUASPUD, NARIÑO",
                    "value": "52224",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUBARA, BOYACA",
                    "value": "15223",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUBARRAL, META",
                    "value": "50223",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUCAITA, BOYACA",
                    "value": "15224",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUCUNUBA, CUNDINAMARCA",
                    "value": "25224",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUCUTA, NORTE DE SANTANDER",
                    "value": "54001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUCUTILLA, NORTE DE SANTANDER",
                    "value": "54223",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUITIVA, BOYACA",
                    "value": "15226",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUMARAL, META",
                    "value": "50226",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "99"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUMARIBO, VICHADA",
                    "value": "99773",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUMBAL, NARIÑO",
                    "value": "52227",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUMBITARA, NARIÑO",
                    "value": "52233",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CUNDAY, TOLIMA",
                    "value": "73226",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CURILLO, CAQUETA",
                    "value": "18205",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CURITI, SANTANDER",
                    "value": "68229",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "CURUMANI, CESAR",
                    "value": "20228",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DABEIBA, ANTIOQUIA",
                    "value": "05234",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DAGUA, VALLE",
                    "value": "76233",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DIBULLA, LA GUAJIRA",
                    "value": "44090",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DISTRACCION, LA GUAJIRA",
                    "value": "44098",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DOLORES, TOLIMA",
                    "value": "73236",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DONMATIAS, ANTIOQUIA",
                    "value": "05237",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DOSQUEBRADAS, RISARALDA",
                    "value": "66170",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DUITAMA, BOYACA",
                    "value": "15238",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "DURANIA, NORTE DE SANTANDER",
                    "value": "54239",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EBEJICO, ANTIOQUIA",
                    "value": "05240",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL AGUILA, VALLE",
                    "value": "76243",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL BAGRE, ANTIOQUIA",
                    "value": "05250",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL BANCO, MAGDALENA",
                    "value": "47245",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CAIRO, VALLE",
                    "value": "76246",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CALVARIO, META",
                    "value": "50245",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CANTON DEL SAN PABLO, CHOCO",
                    "value": "27135",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CARMEN, NORTE DE SANTANDER",
                    "value": "54245",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CARMEN DE ATRATO, CHOCO",
                    "value": "27245",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CARMEN DE BOLIVAR, BOLIVAR",
                    "value": "13244",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CARMEN DE CHUCURI, SANTANDER",
                    "value": "68235",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CARMEN DE VIBORAL, ANTIOQUIA",
                    "value": "05148",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CASTILLO, META",
                    "value": "50251",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CERRITO, VALLE",
                    "value": "76248",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL CHARCO, NARIÑO",
                    "value": "52250",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL COCUY, BOYACA",
                    "value": "15244",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL COLEGIO, CUNDINAMARCA",
                    "value": "25245",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL COPEY, CESAR",
                    "value": "20238",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL DONCELLO, CAQUETA",
                    "value": "18247",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL DORADO, META",
                    "value": "50270",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL DOVIO, VALLE",
                    "value": "76250",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL ENCANTO, AMAZONAS",
                    "value": "91263",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL ESPINO, BOYACA",
                    "value": "15248",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL GUACAMAYO, SANTANDER",
                    "value": "68245",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL GUAMO, BOLIVAR",
                    "value": "13248",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL LITORAL DEL SAN JUAN, CHOCO",
                    "value": "27250",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL MOLINO, LA GUAJIRA",
                    "value": "44110",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL PASO, CESAR",
                    "value": "20250",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL PAUJIL, CAQUETA",
                    "value": "18256",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL PEÑOL, NARIÑO",
                    "value": "52254",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL PEÑON, BOLIVAR",
                    "value": "13268",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL PEÑON, CUNDINAMARCA",
                    "value": "25258",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL PEÑON, SANTANDER",
                    "value": "68250",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL PIÑON, MAGDALENA",
                    "value": "47258",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL PLAYON, SANTANDER",
                    "value": "68255",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL RETEN, MAGDALENA",
                    "value": "47268",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "95"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL RETORNO, GUAVIARE",
                    "value": "95025",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL ROBLE, SUCRE",
                    "value": "70233",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL ROSAL, CUNDINAMARCA",
                    "value": "25260",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL ROSARIO, NARIÑO",
                    "value": "52256",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL SANTUARIO, ANTIOQUIA",
                    "value": "05697",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL TABLON DE GOMEZ, NARIÑO",
                    "value": "52258",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL TAMBO, CAUCA",
                    "value": "19256",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL TAMBO, NARIÑO",
                    "value": "52260",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL TARRA, NORTE DE SANTANDER",
                    "value": "54250",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "EL ZULIA, NORTE DE SANTANDER",
                    "value": "54261",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ELIAS, HUILA",
                    "value": "41244",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ENCINO, SANTANDER",
                    "value": "68264",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ENCISO, SANTANDER",
                    "value": "68266",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ENTRERRIOS, ANTIOQUIA",
                    "value": "05264",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ENVIGADO, ANTIOQUIA",
                    "value": "05266",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ESPINAL, TOLIMA",
                    "value": "73268",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FACATATIVA, CUNDINAMARCA",
                    "value": "25269",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FALAN, TOLIMA",
                    "value": "73270",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FILADELFIA, CALDAS",
                    "value": "17272",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FILANDIA, QUINDIO",
                    "value": "63272",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FIRAVITOBA, BOYACA",
                    "value": "15272",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FLANDES, TOLIMA",
                    "value": "73275",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FLORENCIA, CAQUETA",
                    "value": "18001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FLORENCIA, CAUCA",
                    "value": "19290",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FLORESTA, BOYACA",
                    "value": "15276",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FLORIAN, SANTANDER",
                    "value": "68271",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FLORIDA, VALLE",
                    "value": "76275",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FLORIDABLANCA, SANTANDER",
                    "value": "68276",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FOMEQUE, CUNDINAMARCA",
                    "value": "25279",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FONSECA, LA GUAJIRA",
                    "value": "44279",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "81"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FORTUL, ARAUCA",
                    "value": "81300",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FOSCA, CUNDINAMARCA",
                    "value": "25281",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FRANCISCO PIZARRO, NARIÑO",
                    "value": "52520",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FREDONIA, ANTIOQUIA",
                    "value": "05282",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FRESNO, TOLIMA",
                    "value": "73283",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FRONTINO, ANTIOQUIA",
                    "value": "05284",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FUENTE DE ORO, META",
                    "value": "50287",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FUNDACION, MAGDALENA",
                    "value": "47288",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FUNES, NARIÑO",
                    "value": "52287",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FUNZA, CUNDINAMARCA",
                    "value": "25286",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FUQUENE, CUNDINAMARCA",
                    "value": "25288",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "FUSAGASUGA, CUNDINAMARCA",
                    "value": "25290",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GACHALA, CUNDINAMARCA",
                    "value": "25293",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GACHANCIPA, CUNDINAMARCA",
                    "value": "25295",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GACHANTIVA, BOYACA",
                    "value": "15293",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GACHETA, CUNDINAMARCA",
                    "value": "25297",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GALAN, SANTANDER",
                    "value": "68296",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GALAPA, ATLANTICO",
                    "value": "08296",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GALERAS, SUCRE",
                    "value": "70235",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GAMA, CUNDINAMARCA",
                    "value": "25299",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GAMARRA, CESAR",
                    "value": "20295",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GAMBITA, SANTANDER",
                    "value": "68298",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GAMEZA, BOYACA",
                    "value": "15296",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GARAGOA, BOYACA",
                    "value": "15299",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GARZON, HUILA",
                    "value": "41298",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GENOVA, QUINDIO",
                    "value": "63302",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GIGANTE, HUILA",
                    "value": "41306",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GINEBRA, VALLE",
                    "value": "76306",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GIRALDO, ANTIOQUIA",
                    "value": "05306",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GIRARDOT, CUNDINAMARCA",
                    "value": "25307",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GIRARDOTA, ANTIOQUIA",
                    "value": "05308",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GIRON, SANTANDER",
                    "value": "68307",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GOMEZ PLATA, ANTIOQUIA",
                    "value": "05310",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GONZALEZ, CESAR",
                    "value": "20310",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GRAMALOTE, NORTE DE SANTANDER",
                    "value": "54313",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GRANADA, ANTIOQUIA",
                    "value": "05313",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GRANADA, CUNDINAMARCA",
                    "value": "25312",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GRANADA, META",
                    "value": "50313",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUACA, SANTANDER",
                    "value": "68318",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUACAMAYAS, BOYACA",
                    "value": "15317",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUACARI, VALLE",
                    "value": "76318",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUACHENE, CAUCA",
                    "value": "19300",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUACHETA, CUNDINAMARCA",
                    "value": "25317",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUACHUCAL, NARIÑO",
                    "value": "52317",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUADALAJARA DE BUGA, VALLE",
                    "value": "76111",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUADALUPE, ANTIOQUIA",
                    "value": "05315",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUADALUPE, HUILA",
                    "value": "41319",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUADALUPE, SANTANDER",
                    "value": "68320",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUADUAS, CUNDINAMARCA",
                    "value": "25320",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAITARILLA, NARIÑO",
                    "value": "52320",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUALMATAN, NARIÑO",
                    "value": "52323",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAMAL, MAGDALENA",
                    "value": "47318",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAMAL, META",
                    "value": "50318",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAMO, TOLIMA",
                    "value": "73319",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAPI, CAUCA",
                    "value": "19318",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAPOTA, SANTANDER",
                    "value": "68322",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUARANDA, SUCRE",
                    "value": "70265",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUARNE, ANTIOQUIA",
                    "value": "05318",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUASCA, CUNDINAMARCA",
                    "value": "25322",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUATAPE, ANTIOQUIA",
                    "value": "05321",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUATAQUI, CUNDINAMARCA",
                    "value": "25324",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUATAVITA, CUNDINAMARCA",
                    "value": "25326",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUATEQUE, BOYACA",
                    "value": "15322",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUATICA, RISARALDA",
                    "value": "66318",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAVATA, SANTANDER",
                    "value": "68324",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAYABAL DE SIQUIMA, CUNDINAMARCA",
                    "value": "25328",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAYABETAL, CUNDINAMARCA",
                    "value": "25335",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUAYATA, BOYACA",
                    "value": "15325",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GÜEPSA, SANTANDER",
                    "value": "68327",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GÜICAN, BOYACA",
                    "value": "15332",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "GUTIERREZ, CUNDINAMARCA",
                    "value": "25339",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HACARI, NORTE DE SANTANDER",
                    "value": "54344",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HATILLO DE LOBA, BOLIVAR",
                    "value": "13300",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HATO, SANTANDER",
                    "value": "68344",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HATO COROZAL, CASANARE",
                    "value": "85125",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HATONUEVO, LA GUAJIRA",
                    "value": "44378",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HELICONIA, ANTIOQUIA",
                    "value": "05347",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HERRAN, NORTE DE SANTANDER",
                    "value": "54347",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HERVEO, TOLIMA",
                    "value": "73347",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HISPANIA, ANTIOQUIA",
                    "value": "05353",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HOBO, HUILA",
                    "value": "41349",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "HONDA, TOLIMA",
                    "value": "73349",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "IBAGUE, TOLIMA",
                    "value": "73001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ICONONZO, TOLIMA",
                    "value": "73352",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ILES, NARIÑO",
                    "value": "52352",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "IMUES, NARIÑO",
                    "value": "52354",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "INIRIDA, GUAINIA",
                    "value": "94001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "INZA, CAUCA",
                    "value": "19355",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "IPIALES, NARIÑO",
                    "value": "52356",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "IQUIRA, HUILA",
                    "value": "41357",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ISNOS, HUILA",
                    "value": "41359",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ISTMINA, CHOCO",
                    "value": "27361",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ITAGUI, ANTIOQUIA",
                    "value": "05360",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ITUANGO, ANTIOQUIA",
                    "value": "05361",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "IZA, BOYACA",
                    "value": "15362",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JAMBALO, CAUCA",
                    "value": "19364",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JAMUNDI, VALLE",
                    "value": "76364",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JARDIN, ANTIOQUIA",
                    "value": "05364",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JENESANO, BOYACA",
                    "value": "15367",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JERICO, ANTIOQUIA",
                    "value": "05368",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JERICO, BOYACA",
                    "value": "15368",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JERUSALEN, CUNDINAMARCA",
                    "value": "25368",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JESUS MARIA, SANTANDER",
                    "value": "68368",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JORDAN, SANTANDER",
                    "value": "68370",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JUAN DE ACOSTA, ATLANTICO",
                    "value": "08372",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JUNIN, CUNDINAMARCA",
                    "value": "25372",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "JURADO, CHOCO",
                    "value": "27372",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA APARTADA, CORDOBA",
                    "value": "23350",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA ARGENTINA, HUILA",
                    "value": "41378",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA BELLEZA, SANTANDER",
                    "value": "68377",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA CALERA, CUNDINAMARCA",
                    "value": "25377",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA CAPILLA, BOYACA",
                    "value": "15380",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA CEJA, ANTIOQUIA",
                    "value": "05376",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA CELIA, RISARALDA",
                    "value": "66383",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA CHORRERA, AMAZONAS",
                    "value": "91405",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA CRUZ, NARIÑO",
                    "value": "52378",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA CUMBRE, VALLE",
                    "value": "76377",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA DORADA, CALDAS",
                    "value": "17380",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA ESPERANZA, NORTE DE SANTANDER",
                    "value": "54385",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA ESTRELLA, ANTIOQUIA",
                    "value": "05380",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA FLORIDA, NARIÑO",
                    "value": "52381",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA GLORIA, CESAR",
                    "value": "20383",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA GUADALUPE, GUAINIA",
                    "value": "94885",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA JAGUA DE IBIRICO, CESAR",
                    "value": "20400",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA JAGUA DEL PILAR, LA GUAJIRA",
                    "value": "44420",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA LLANADA, NARIÑO",
                    "value": "52385",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA MACARENA, META",
                    "value": "50350",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA MERCED, CALDAS",
                    "value": "17388",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA MESA, CUNDINAMARCA",
                    "value": "25386",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA MONTAÑITA, CAQUETA",
                    "value": "18410",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PALMA, CUNDINAMARCA",
                    "value": "25394",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PAZ, CESAR",
                    "value": "20621",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PAZ, SANTANDER",
                    "value": "68397",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PEDRERA, AMAZONAS",
                    "value": "91407",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PEÑA, CUNDINAMARCA",
                    "value": "25398",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PINTADA, ANTIOQUIA",
                    "value": "05390",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PLATA, HUILA",
                    "value": "41396",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PLAYA, NORTE DE SANTANDER",
                    "value": "54398",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "99"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA PRIMAVERA, VICHADA",
                    "value": "99524",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA SALINA, CASANARE",
                    "value": "85136",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA SIERRA, CAUCA",
                    "value": "19392",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA TEBAIDA, QUINDIO",
                    "value": "63401",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA TOLA, NARIÑO",
                    "value": "52390",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA UNION, ANTIOQUIA",
                    "value": "05400",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA UNION, NARIÑO",
                    "value": "52399",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA UNION, SUCRE",
                    "value": "70400",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA UNION, VALLE",
                    "value": "76400",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA UVITA, BOYACA",
                    "value": "15403",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA VEGA, CAUCA",
                    "value": "19397",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA VEGA, CUNDINAMARCA",
                    "value": "25402",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA VICTORIA, BOYACA",
                    "value": "15401",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA VICTORIA, VALLE",
                    "value": "76403",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA VICTORIA, AMAZONAS",
                    "value": "91430",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LA VIRGINIA, RISARALDA",
                    "value": "66400",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LABATECA, NORTE DE SANTANDER",
                    "value": "54377",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LABRANZAGRANDE, BOYACA",
                    "value": "15377",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LANDAZURI, SANTANDER",
                    "value": "68385",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LEBRIJA, SANTANDER",
                    "value": "68406",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LEIVA, NARIÑO",
                    "value": "52405",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LEJANIAS, META",
                    "value": "50400",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LENGUAZAQUE, CUNDINAMARCA",
                    "value": "25407",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LERIDA, TOLIMA",
                    "value": "73408",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LETICIA, AMAZONAS",
                    "value": "91001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LIBANO, TOLIMA",
                    "value": "73411",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LIBORINA, ANTIOQUIA",
                    "value": "05411",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LINARES, NARIÑO",
                    "value": "52411",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LLORO, CHOCO",
                    "value": "27413",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LOPEZ, CAUCA",
                    "value": "19418",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LORICA, CORDOBA",
                    "value": "23417",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LOS ANDES, NARIÑO",
                    "value": "52418",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LOS CORDOBAS, CORDOBA",
                    "value": "23419",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LOS PALMITOS, SUCRE",
                    "value": "70418",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LOS PATIOS, NORTE DE SANTANDER",
                    "value": "54405",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LOS SANTOS, SANTANDER",
                    "value": "68418",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LOURDES, NORTE DE SANTANDER",
                    "value": "54418",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "LURUACO, ATLANTICO",
                    "value": "08421",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MACANAL, BOYACA",
                    "value": "15425",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MACARAVITA, SANTANDER",
                    "value": "68425",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MACEO, ANTIOQUIA",
                    "value": "05425",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MACHETA, CUNDINAMARCA",
                    "value": "25426",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MADRID, CUNDINAMARCA",
                    "value": "25430",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MAGANGUE, BOLIVAR",
                    "value": "13430",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MAGÜI, NARIÑO",
                    "value": "52427",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MAHATES, BOLIVAR",
                    "value": "13433",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MAICAO, LA GUAJIRA",
                    "value": "44430",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MAJAGUAL, SUCRE",
                    "value": "70429",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MALAGA, SANTANDER",
                    "value": "68432",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MALAMBO, ATLANTICO",
                    "value": "08433",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MALLAMA, NARIÑO",
                    "value": "52435",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MANATI, ATLANTICO",
                    "value": "08436",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MANAURE, CESAR",
                    "value": "20443",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MANAURE, LA GUAJIRA",
                    "value": "44560",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MANI, CASANARE",
                    "value": "85139",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MANIZALES, CALDAS",
                    "value": "17001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MANTA, CUNDINAMARCA",
                    "value": "25436",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MANZANARES, CALDAS",
                    "value": "17433",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MAPIRIPAN, META",
                    "value": "50325",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MAPIRIPANA, GUAINIA",
                    "value": "94663",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MARGARITA, BOLIVAR",
                    "value": "13440",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MARIA LA BAJA, BOLIVAR",
                    "value": "13442",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MARINILLA, ANTIOQUIA",
                    "value": "05440",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MARIPI, BOYACA",
                    "value": "15442",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MARMATO, CALDAS",
                    "value": "17442",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MARQUETALIA, CALDAS",
                    "value": "17444",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MARSELLA, RISARALDA",
                    "value": "66440",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MARULANDA, CALDAS",
                    "value": "17446",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MATANZA, SANTANDER",
                    "value": "68444",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MEDELLIN, ANTIOQUIA",
                    "value": "05001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MEDINA, CUNDINAMARCA",
                    "value": "25438",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MEDIO ATRATO, CHOCO",
                    "value": "27425",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MEDIO BAUDO, CHOCO",
                    "value": "27430",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MEDIO SAN JUAN, CHOCO",
                    "value": "27450",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MELGAR, TOLIMA",
                    "value": "73449",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MERCADERES, CAUCA",
                    "value": "19450",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MESETAS, META",
                    "value": "50330",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MILAN, CAQUETA",
                    "value": "18460",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MIRAFLORES, BOYACA",
                    "value": "15455",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "95"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MIRAFLORES, GUAVIARE",
                    "value": "95200",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MIRANDA, CAUCA",
                    "value": "19455",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MIRITI - PARANA, AMAZONAS",
                    "value": "91460",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MISTRATO, RISARALDA",
                    "value": "66456",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "97"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MITU, VAUPES",
                    "value": "97001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOCOA, PUTUMAYO",
                    "value": "86001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOGOTES, SANTANDER",
                    "value": "68464",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOLAGAVITA, SANTANDER",
                    "value": "68468",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOMIL, CORDOBA",
                    "value": "23464",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOMPOS, BOLIVAR",
                    "value": "13468",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONGUA, BOYACA",
                    "value": "15464",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONGUI, BOYACA",
                    "value": "15466",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONIQUIRA, BOYACA",
                    "value": "15469",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONTEBELLO, ANTIOQUIA",
                    "value": "05467",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONTECRISTO, BOLIVAR",
                    "value": "13458",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONTELIBANO, CORDOBA",
                    "value": "23466",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONTENEGRO, QUINDIO",
                    "value": "63470",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONTERIA, CORDOBA",
                    "value": "23001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MONTERREY, CASANARE",
                    "value": "85162",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOÑITOS, CORDOBA",
                    "value": "23500",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MORALES, BOLIVAR",
                    "value": "13473",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MORALES, CAUCA",
                    "value": "19473",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MORELIA, CAQUETA",
                    "value": "18479",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MORICHAL, GUAINIA",
                    "value": "94888",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MORROA, SUCRE",
                    "value": "70473",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOSQUERA, CUNDINAMARCA",
                    "value": "25473",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOSQUERA, NARIÑO",
                    "value": "52473",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MOTAVITA, BOYACA",
                    "value": "15476",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MURILLO, TOLIMA",
                    "value": "73461",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MURINDO, ANTIOQUIA",
                    "value": "05475",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MUTATA, ANTIOQUIA",
                    "value": "05480",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MUTISCUA, NORTE DE SANTANDER",
                    "value": "54480",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "MUZO, BOYACA",
                    "value": "15480",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NARIÑO, ANTIOQUIA",
                    "value": "05483",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NARIÑO, CUNDINAMARCA",
                    "value": "25483",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NARIÑO, NARIÑO",
                    "value": "52480",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NATAGA, HUILA",
                    "value": "41483",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NATAGAIMA, TOLIMA",
                    "value": "73483",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NECHI, ANTIOQUIA",
                    "value": "05495",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NECOCLI, ANTIOQUIA",
                    "value": "05490",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NEIRA, CALDAS",
                    "value": "17486",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NEIVA, HUILA",
                    "value": "41001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NEMOCON, CUNDINAMARCA",
                    "value": "25486",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NILO, CUNDINAMARCA",
                    "value": "25488",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NIMAIMA, CUNDINAMARCA",
                    "value": "25489",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NOBSA, BOYACA",
                    "value": "15491",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NOCAIMA, CUNDINAMARCA",
                    "value": "25491",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NORCASIA, CALDAS",
                    "value": "17495",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NOROSI, BOLIVAR",
                    "value": "13490",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NOVITA, CHOCO",
                    "value": "27491",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NUEVA GRANADA, MAGDALENA",
                    "value": "47460",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NUEVO COLON, BOYACA",
                    "value": "15494",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NUNCHIA, CASANARE",
                    "value": "85225",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "NUQUI, CHOCO",
                    "value": "27495",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OBANDO, VALLE",
                    "value": "76497",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OCAMONTE, SANTANDER",
                    "value": "68498",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OCAÑA, NORTE DE SANTANDER",
                    "value": "54498",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OIBA, SANTANDER",
                    "value": "68500",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OICATA, BOYACA",
                    "value": "15500",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OLAYA, ANTIOQUIA",
                    "value": "05501",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OLAYA HERRERA, NARIÑO",
                    "value": "52490",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ONZAGA, SANTANDER",
                    "value": "68502",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OPORAPA, HUILA",
                    "value": "41503",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ORITO, PUTUMAYO",
                    "value": "86320",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OROCUE, CASANARE",
                    "value": "85230",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ORTEGA, TOLIMA",
                    "value": "73504",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OSPINA, NARIÑO",
                    "value": "52506",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OTANCHE, BOYACA",
                    "value": "15507",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "OVEJAS, SUCRE",
                    "value": "70508",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PACHAVITA, BOYACA",
                    "value": "15511",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PACHO, CUNDINAMARCA",
                    "value": "25513",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "97"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PACOA, VAUPES",
                    "value": "97511",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PACORA, CALDAS",
                    "value": "17513",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PADILLA, CAUCA",
                    "value": "19513",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAEZ, BOYACA",
                    "value": "15514",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAEZ, CAUCA",
                    "value": "19517",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAICOL, HUILA",
                    "value": "41518",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAILITAS, CESAR",
                    "value": "20517",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAIME, CUNDINAMARCA",
                    "value": "25518",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAIPA, BOYACA",
                    "value": "15516",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAJARITO, BOYACA",
                    "value": "15518",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALERMO, HUILA",
                    "value": "41524",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALESTINA, CALDAS",
                    "value": "17524",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALESTINA, HUILA",
                    "value": "41530",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALMAR, SANTANDER",
                    "value": "68522",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALMAR DE VARELA, ATLANTICO",
                    "value": "08520",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALMAS DEL SOCORRO, SANTANDER",
                    "value": "68524",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALMIRA, VALLE",
                    "value": "76520",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALMITO, SUCRE",
                    "value": "70523",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PALOCABILDO, TOLIMA",
                    "value": "73520",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAMPLONA, NORTE DE SANTANDER",
                    "value": "54518",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAMPLONITA, NORTE DE SANTANDER",
                    "value": "54520",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PANA PANA, GUAINIA",
                    "value": "94887",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PANDI, CUNDINAMARCA",
                    "value": "25524",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PANQUEBA, BOYACA",
                    "value": "15522",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "97"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAPUNAUA, VAUPES",
                    "value": "97777",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PARAMO, SANTANDER",
                    "value": "68533",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PARATEBUENO, CUNDINAMARCA",
                    "value": "25530",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PASCA, CUNDINAMARCA",
                    "value": "25535",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PASTO, NARIÑO",
                    "value": "52001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PATIA, CAUCA",
                    "value": "19532",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAUNA, BOYACA",
                    "value": "15531",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAYA, BOYACA",
                    "value": "15533",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAZ DE ARIPORO, CASANARE",
                    "value": "85250",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PAZ DE RIO, BOYACA",
                    "value": "15537",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PEDRAZA, MAGDALENA",
                    "value": "47541",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PELAYA, CESAR",
                    "value": "20550",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PENSILVANIA, CALDAS",
                    "value": "17541",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PEÑOL, ANTIOQUIA",
                    "value": "05541",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PEQUE, ANTIOQUIA",
                    "value": "05543",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PEREIRA, RISARALDA",
                    "value": "66001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PESCA, BOYACA",
                    "value": "15542",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PIAMONTE, CAUCA",
                    "value": "19533",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PIEDECUESTA, SANTANDER",
                    "value": "68547",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PIEDRAS, TOLIMA",
                    "value": "73547",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PIENDAMO, CAUCA",
                    "value": "19548",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PIJAO, QUINDIO",
                    "value": "63548",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PIJIÑO DEL CARMEN, MAGDALENA",
                    "value": "47545",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PINCHOTE, SANTANDER",
                    "value": "68549",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PINILLOS, BOLIVAR",
                    "value": "13549",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PIOJO, ATLANTICO",
                    "value": "08549",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PISBA, BOYACA",
                    "value": "15550",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PITAL, HUILA",
                    "value": "41548",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PITALITO, HUILA",
                    "value": "41551",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PIVIJAY, MAGDALENA",
                    "value": "47551",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PLANADAS, TOLIMA",
                    "value": "73555",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PLANETA RICA, CORDOBA",
                    "value": "23555",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PLATO, MAGDALENA",
                    "value": "47555",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "POLICARPA, NARIÑO",
                    "value": "52540",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "POLONUEVO, ATLANTICO",
                    "value": "08558",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PONEDERA, ATLANTICO",
                    "value": "08560",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "POPAYAN, CAUCA",
                    "value": "19001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PORE, CASANARE",
                    "value": "85263",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "POTOSI, NARIÑO",
                    "value": "52560",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PRADERA, VALLE",
                    "value": "76563",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PRADO, TOLIMA",
                    "value": "73563",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PROVIDENCIA, NARIÑO",
                    "value": "52565",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "88"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PROVIDENCIA, SAN ANDRES",
                    "value": "88564",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUEBLO BELLO, CESAR",
                    "value": "20570",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUEBLO NUEVO, CORDOBA",
                    "value": "23570",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUEBLO RICO, RISARALDA",
                    "value": "66572",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUEBLORRICO, ANTIOQUIA",
                    "value": "05576",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUEBLOVIEJO, MAGDALENA",
                    "value": "47570",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUENTE NACIONAL, SANTANDER",
                    "value": "68572",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERRES, NARIÑO",
                    "value": "52573",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO ALEGRIA, AMAZONAS",
                    "value": "91530",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO ARICA, AMAZONAS",
                    "value": "91536",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO ASIS, PUTUMAYO",
                    "value": "86568",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO BERRIO, ANTIOQUIA",
                    "value": "05579",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO BOYACA, BOYACA",
                    "value": "15572",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO CAICEDO, PUTUMAYO",
                    "value": "86569",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "99"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO CARREÑO, VICHADA",
                    "value": "99001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO COLOMBIA, ATLANTICO",
                    "value": "08573",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO COLOMBIA, GUAINIA",
                    "value": "94884",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO CONCORDIA, META",
                    "value": "50450",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO ESCONDIDO, CORDOBA",
                    "value": "23574",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO GAITAN, META",
                    "value": "50568",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO GUZMAN, PUTUMAYO",
                    "value": "86571",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO LEGUIZAMO, PUTUMAYO",
                    "value": "86573",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO LIBERTADOR, CORDOBA",
                    "value": "23580",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO LLERAS, META",
                    "value": "50577",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO LOPEZ, META",
                    "value": "50573",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO NARE, ANTIOQUIA",
                    "value": "05585",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO NARIÑO, AMAZONAS",
                    "value": "91540",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO PARRA, SANTANDER",
                    "value": "68573",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO RICO, CAQUETA",
                    "value": "18592",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO RICO, META",
                    "value": "50590",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "81"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO RONDON, ARAUCA",
                    "value": "81591",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO SALGAR, CUNDINAMARCA",
                    "value": "25572",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO SANTANDER, NORTE DE SANTANDER",
                    "value": "54553",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO SANTANDER, AMAZONAS",
                    "value": "91669",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO TEJADA, CAUCA",
                    "value": "19573",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO TRIUNFO, ANTIOQUIA",
                    "value": "05591",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUERTO WILCHES, SANTANDER",
                    "value": "68575",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PULI, CUNDINAMARCA",
                    "value": "25580",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PUPIALES, NARIÑO",
                    "value": "52585",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PURACE, CAUCA",
                    "value": "19585",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PURIFICACION, TOLIMA",
                    "value": "73585",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "PURISIMA, CORDOBA",
                    "value": "23586",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "QUEBRADANEGRA, CUNDINAMARCA",
                    "value": "25592",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "QUETAME, CUNDINAMARCA",
                    "value": "25594",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "QUIBDO, CHOCO",
                    "value": "27001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "QUIMBAYA, QUINDIO",
                    "value": "63594",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "QUINCHIA, RISARALDA",
                    "value": "66594",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "QUIPAMA, BOYACA",
                    "value": "15580",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "QUIPILE, CUNDINAMARCA",
                    "value": "25596",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RAGONVALIA, NORTE DE SANTANDER",
                    "value": "54599",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RAMIRIQUI, BOYACA",
                    "value": "15599",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RAQUIRA, BOYACA",
                    "value": "15600",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RECETOR, CASANARE",
                    "value": "85279",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REGIDOR, BOLIVAR",
                    "value": "13580",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REMEDIOS, ANTIOQUIA",
                    "value": "05604",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REMOLINO, MAGDALENA",
                    "value": "47605",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "REPELON, ATLANTICO",
                    "value": "08606",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RESTREPO, META",
                    "value": "50606",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RESTREPO, VALLE",
                    "value": "76606",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RETIRO, ANTIOQUIA",
                    "value": "05607",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RICAURTE, CUNDINAMARCA",
                    "value": "25612",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RICAURTE, NARIÑO",
                    "value": "52612",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIO DE ORO, CESAR",
                    "value": "20614",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIO IRO, CHOCO",
                    "value": "27580",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIO QUITO, CHOCO",
                    "value": "27600",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIO VIEJO, BOLIVAR",
                    "value": "13600",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIOBLANCO, TOLIMA",
                    "value": "73616",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIOFRIO, VALLE",
                    "value": "76616",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIOHACHA, LA GUAJIRA",
                    "value": "44001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIONEGRO, ANTIOQUIA",
                    "value": "05615",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIONEGRO, SANTANDER",
                    "value": "68615",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIOSUCIO, CALDAS",
                    "value": "17614",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIOSUCIO, CHOCO",
                    "value": "27615",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RISARALDA, CALDAS",
                    "value": "17616",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RIVERA, HUILA",
                    "value": "41615",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ROBERTO PAYAN, NARIÑO",
                    "value": "52621",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ROLDANILLO, VALLE",
                    "value": "76622",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RONCESVALLES, TOLIMA",
                    "value": "73622",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "RONDON, BOYACA",
                    "value": "15621",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ROSAS, CAUCA",
                    "value": "19622",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ROVIRA, TOLIMA",
                    "value": "73624",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SABANA DE TORRES, SANTANDER",
                    "value": "68655",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SABANAGRANDE, ATLANTICO",
                    "value": "08634",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SABANALARGA, ANTIOQUIA",
                    "value": "05628",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SABANALARGA, ATLANTICO",
                    "value": "08638",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SABANALARGA, CASANARE",
                    "value": "85300",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SABANAS DE SAN ANGEL, MAGDALENA",
                    "value": "47660",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SABANETA, ANTIOQUIA",
                    "value": "05631",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SABOYA, BOYACA",
                    "value": "15632",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SACAMA, CASANARE",
                    "value": "85315",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SACHICA, BOYACA",
                    "value": "15638",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAHAGUN, CORDOBA",
                    "value": "23660",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SALADOBLANCO, HUILA",
                    "value": "41660",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SALAMINA, CALDAS",
                    "value": "17653",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SALAMINA, MAGDALENA",
                    "value": "47675",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SALAZAR, NORTE DE SANTANDER",
                    "value": "54660",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SALDAÑA, TOLIMA",
                    "value": "73671",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "63"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SALENTO, QUINDIO",
                    "value": "63690",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SALGAR, ANTIOQUIA",
                    "value": "05642",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAMACA, BOYACA",
                    "value": "15646",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAMANA, CALDAS",
                    "value": "17662",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAMANIEGO, NARIÑO",
                    "value": "52678",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAMPUES, SUCRE",
                    "value": "70670",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN AGUSTIN, HUILA",
                    "value": "41668",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ALBERTO, CESAR",
                    "value": "20710",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANDRES, SANTANDER",
                    "value": "68669",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "88"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANDRES, SAN ANDRES",
                    "value": "88001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANDRES DE CUERQUIA, ANTIOQUIA",
                    "value": "05647",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANDRES DE TUMACO, NARIÑO",
                    "value": "52835",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANDRES SOTAVENTO, CORDOBA",
                    "value": "23670",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANTERO, CORDOBA",
                    "value": "23672",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANTONIO, TOLIMA",
                    "value": "73675",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ANTONIO DEL TEQUENDAMA, CUNDINAMARCA",
                    "value": "25645",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN BENITO, SANTANDER",
                    "value": "68673",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN BENITO ABAD, SUCRE",
                    "value": "70678",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN BERNARDO, CUNDINAMARCA",
                    "value": "25649",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN BERNARDO, NARIÑO",
                    "value": "52685",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN BERNARDO DEL VIENTO, CORDOBA",
                    "value": "23675",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN CALIXTO, NORTE DE SANTANDER",
                    "value": "54670",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN CARLOS, ANTIOQUIA",
                    "value": "05649",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN CARLOS, CORDOBA",
                    "value": "23678",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN CARLOS DE GUAROA, META",
                    "value": "50680",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN CAYETANO, CUNDINAMARCA",
                    "value": "25653",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN CAYETANO, NORTE DE SANTANDER",
                    "value": "54673",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN CRISTOBAL, BOLIVAR",
                    "value": "13620",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN DIEGO, CESAR",
                    "value": "20750",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN EDUARDO, BOYACA",
                    "value": "15660",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ESTANISLAO, BOLIVAR",
                    "value": "13647",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "94"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN FELIPE, GUAINIA",
                    "value": "94883",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN FERNANDO, BOLIVAR",
                    "value": "13650",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN FRANCISCO, ANTIOQUIA",
                    "value": "05652",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN FRANCISCO, CUNDINAMARCA",
                    "value": "25658",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN FRANCISCO, PUTUMAYO",
                    "value": "86755",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN GIL, SANTANDER",
                    "value": "68679",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JACINTO, BOLIVAR",
                    "value": "13654",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JACINTO DEL CAUCA, BOLIVAR",
                    "value": "13655",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JERONIMO, ANTIOQUIA",
                    "value": "05656",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOAQUIN, SANTANDER",
                    "value": "68682",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOSE, CALDAS",
                    "value": "17665",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOSE DE LA MONTAÑA, ANTIOQUIA",
                    "value": "05658",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOSE DE MIRANDA, SANTANDER",
                    "value": "68684",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOSE DE PARE, BOYACA",
                    "value": "15664",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOSE DE URE, CORDOBA",
                    "value": "23682",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOSE DEL FRAGUA, CAQUETA",
                    "value": "18610",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "95"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOSE DEL GUAVIARE, GUAVIARE",
                    "value": "95001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JOSE DEL PALMAR, CHOCO",
                    "value": "27660",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JUAN DE ARAMA, META",
                    "value": "50683",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JUAN DE BETULIA, SUCRE",
                    "value": "70702",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JUAN DE RIO SECO, CUNDINAMARCA",
                    "value": "25662",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JUAN DE URABA, ANTIOQUIA",
                    "value": "05659",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JUAN DEL CESAR, LA GUAJIRA",
                    "value": "44650",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JUAN NEPOMUCENO, BOLIVAR",
                    "value": "13657",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN JUANITO, META",
                    "value": "50686",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN LORENZO, NARIÑO",
                    "value": "52687",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN LUIS, ANTIOQUIA",
                    "value": "05660",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN LUIS, TOLIMA",
                    "value": "73678",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN LUIS DE GACENO, BOYACA",
                    "value": "15667",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN LUIS DE PALENQUE, CASANARE",
                    "value": "85325",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN LUIS DE SINCE, SUCRE",
                    "value": "70742",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN MARCOS, SUCRE",
                    "value": "70708",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN MARTIN, CESAR",
                    "value": "20770",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN MARTIN, META",
                    "value": "50689",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN MARTIN DE LOBA, BOLIVAR",
                    "value": "13667",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN MATEO, BOYACA",
                    "value": "15673",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN MIGUEL, SANTANDER",
                    "value": "68686",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN MIGUEL, PUTUMAYO",
                    "value": "86757",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN MIGUEL DE SEMA, BOYACA",
                    "value": "15676",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ONOFRE, SUCRE",
                    "value": "70713",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PABLO, BOLIVAR",
                    "value": "13670",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PABLO, NARIÑO",
                    "value": "52693",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PABLO DE BORBUR, BOYACA",
                    "value": "15681",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PEDRO, SUCRE",
                    "value": "70717",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PEDRO, VALLE",
                    "value": "76670",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PEDRO DE CARTAGO, NARIÑO",
                    "value": "52694",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PEDRO DE LOS MILAGROS, ANTIOQUIA",
                    "value": "05664",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PEDRO DE URABA, ANTIOQUIA",
                    "value": "05665",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN PELAYO, CORDOBA",
                    "value": "23686",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN RAFAEL, ANTIOQUIA",
                    "value": "05667",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ROQUE, ANTIOQUIA",
                    "value": "05670",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN SEBASTIAN, CAUCA",
                    "value": "19693",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN SEBASTIAN DE BUENAVISTA, MAGDALENA",
                    "value": "47692",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN SEBASTIAN DE MARIQUITA, TOLIMA",
                    "value": "73443",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN VICENTE, ANTIOQUIA",
                    "value": "05674",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN VICENTE DE CHUCURI, SANTANDER",
                    "value": "68689",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN VICENTE DEL CAGUAN, CAQUETA",
                    "value": "18753",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAN ZENON, MAGDALENA",
                    "value": "47703",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANDONA, NARIÑO",
                    "value": "52683",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ANA, MAGDALENA",
                    "value": "47707",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA BARBARA, ANTIOQUIA",
                    "value": "05679",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA BARBARA, NARIÑO",
                    "value": "52696",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA BARBARA, SANTANDER",
                    "value": "68705",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA BARBARA DE PINTO, MAGDALENA",
                    "value": "47720",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA CATALINA, BOLIVAR",
                    "value": "13673",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA HELENA DEL OPON, SANTANDER",
                    "value": "68720",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ISABEL, TOLIMA",
                    "value": "73686",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA LUCIA, ATLANTICO",
                    "value": "08675",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA MARIA, BOYACA",
                    "value": "15690",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA MARIA, HUILA",
                    "value": "41676",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA MARTA, MAGDALENA",
                    "value": "47001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ROSA, BOLIVAR",
                    "value": "13683",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ROSA, CAUCA",
                    "value": "19701",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ROSA DE CABAL, RISARALDA",
                    "value": "66682",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ROSA DE OSOS, ANTIOQUIA",
                    "value": "05686",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ROSA DE VITERBO, BOYACA",
                    "value": "15693",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ROSA DEL SUR, BOLIVAR",
                    "value": "13688",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "99"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA ROSALIA, VICHADA",
                    "value": "99624",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTA SOFIA, BOYACA",
                    "value": "15696",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTACRUZ, NARIÑO",
                    "value": "52699",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTAFE DE ANTIOQUIA, ANTIOQUIA",
                    "value": "05042",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTANA, BOYACA",
                    "value": "15686",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTANDER DE QUILICHAO, CAUCA",
                    "value": "19698",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTIAGO, NORTE DE SANTANDER",
                    "value": "54680",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTIAGO, PUTUMAYO",
                    "value": "86760",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTIAGO DE TOLU, SUCRE",
                    "value": "70820",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTO DOMINGO, ANTIOQUIA",
                    "value": "05690",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTO TOMAS, ATLANTICO",
                    "value": "08685",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "66"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SANTUARIO, RISARALDA",
                    "value": "66687",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SAPUYES, NARIÑO",
                    "value": "52720",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "81"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SARAVENA, ARAUCA",
                    "value": "81736",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SARDINATA, NORTE DE SANTANDER",
                    "value": "54720",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SASAIMA, CUNDINAMARCA",
                    "value": "25718",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SATIVANORTE, BOYACA",
                    "value": "15720",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SATIVASUR, BOYACA",
                    "value": "15723",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SEGOVIA, ANTIOQUIA",
                    "value": "05736",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SESQUILE, CUNDINAMARCA",
                    "value": "25736",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SEVILLA, VALLE",
                    "value": "76736",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SIACHOQUE, BOYACA",
                    "value": "15740",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SIBATE, CUNDINAMARCA",
                    "value": "25740",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SIBUNDOY, PUTUMAYO",
                    "value": "86749",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SILOS, NORTE DE SANTANDER",
                    "value": "54743",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SILVANIA, CUNDINAMARCA",
                    "value": "25743",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SILVIA, CAUCA",
                    "value": "19743",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SIMACOTA, SANTANDER",
                    "value": "68745",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SIMIJACA, CUNDINAMARCA",
                    "value": "25745",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SIMITI, BOLIVAR",
                    "value": "13744",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SINCELEJO, SUCRE",
                    "value": "70001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SIPI, CHOCO",
                    "value": "27745",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SITIONUEVO, MAGDALENA",
                    "value": "47745",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOACHA, CUNDINAMARCA",
                    "value": "25754",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOATA, BOYACA",
                    "value": "15753",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOCHA, BOYACA",
                    "value": "15757",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOCORRO, SANTANDER",
                    "value": "68755",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOCOTA, BOYACA",
                    "value": "15755",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOGAMOSO, BOYACA",
                    "value": "15759",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOLANO, CAQUETA",
                    "value": "18756",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOLEDAD, ATLANTICO",
                    "value": "08758",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOLITA, CAQUETA",
                    "value": "18785",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOMONDOCO, BOYACA",
                    "value": "15761",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SONSON, ANTIOQUIA",
                    "value": "05756",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOPETRAN, ANTIOQUIA",
                    "value": "05761",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOPLAVIENTO, BOLIVAR",
                    "value": "13760",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOPO, CUNDINAMARCA",
                    "value": "25758",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SORA, BOYACA",
                    "value": "15762",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SORACA, BOYACA",
                    "value": "15764",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOTAQUIRA, BOYACA",
                    "value": "15763",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SOTARA, CAUCA",
                    "value": "19760",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUAITA, SANTANDER",
                    "value": "68770",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUAN, ATLANTICO",
                    "value": "08770",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUAREZ, CAUCA",
                    "value": "19780",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUAREZ, TOLIMA",
                    "value": "73770",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUAZA, HUILA",
                    "value": "41770",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUBACHOQUE, CUNDINAMARCA",
                    "value": "25769",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUCRE, CAUCA",
                    "value": "19785",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUCRE, SANTANDER",
                    "value": "68773",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUCRE, SUCRE",
                    "value": "70771",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUESCA, CUNDINAMARCA",
                    "value": "25772",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUPATA, CUNDINAMARCA",
                    "value": "25777",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUPIA, CALDAS",
                    "value": "17777",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SURATA, SANTANDER",
                    "value": "68780",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUSA, CUNDINAMARCA",
                    "value": "25779",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUSACON, BOYACA",
                    "value": "15774",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUTAMARCHAN, BOYACA",
                    "value": "15776",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUTATAUSA, CUNDINAMARCA",
                    "value": "25781",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "SUTATENZA, BOYACA",
                    "value": "15778",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TABIO, CUNDINAMARCA",
                    "value": "25785",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TADO, CHOCO",
                    "value": "27787",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TALAIGUA NUEVO, BOLIVAR",
                    "value": "13780",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TAMALAMEQUE, CESAR",
                    "value": "20787",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TAMARA, CASANARE",
                    "value": "85400",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "81"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TAME, ARAUCA",
                    "value": "81794",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TAMESIS, ANTIOQUIA",
                    "value": "05789",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TAMINANGO, NARIÑO",
                    "value": "52786",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TANGUA, NARIÑO",
                    "value": "52788",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "97"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TARAIRA, VAUPES",
                    "value": "97666",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "91"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TARAPACA, AMAZONAS",
                    "value": "91798",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TARAZA, ANTIOQUIA",
                    "value": "05790",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TARQUI, HUILA",
                    "value": "41791",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TARSO, ANTIOQUIA",
                    "value": "05792",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TASCO, BOYACA",
                    "value": "15790",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TAURAMENA, CASANARE",
                    "value": "85410",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TAUSA, CUNDINAMARCA",
                    "value": "25793",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TELLO, HUILA",
                    "value": "41799",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TENA, CUNDINAMARCA",
                    "value": "25797",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TENERIFE, MAGDALENA",
                    "value": "47798",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TENJO, CUNDINAMARCA",
                    "value": "25799",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TENZA, BOYACA",
                    "value": "15798",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TEORAMA, NORTE DE SANTANDER",
                    "value": "54800",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TERUEL, HUILA",
                    "value": "41801",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TESALIA, HUILA",
                    "value": "41797",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIBACUY, CUNDINAMARCA",
                    "value": "25805",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIBANA, BOYACA",
                    "value": "15804",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIBASOSA, BOYACA",
                    "value": "15806",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIBIRITA, CUNDINAMARCA",
                    "value": "25807",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIBU, NORTE DE SANTANDER",
                    "value": "54810",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIERRALTA, CORDOBA",
                    "value": "23807",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIMANA, HUILA",
                    "value": "41807",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIMBIO, CAUCA",
                    "value": "19807",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIMBIQUI, CAUCA",
                    "value": "19809",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TINJACA, BOYACA",
                    "value": "15808",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIPACOQUE, BOYACA",
                    "value": "15810",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TIQUISIO, BOLIVAR",
                    "value": "13810",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TITIRIBI, ANTIOQUIA",
                    "value": "05809",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOCA, BOYACA",
                    "value": "15814",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOCAIMA, CUNDINAMARCA",
                    "value": "25815",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOCANCIPA, CUNDINAMARCA",
                    "value": "25817",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOGÜI, BOYACA",
                    "value": "15816",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOLEDO, ANTIOQUIA",
                    "value": "05819",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOLEDO, NORTE DE SANTANDER",
                    "value": "54820",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "70"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOLU VIEJO, SUCRE",
                    "value": "70823",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TONA, SANTANDER",
                    "value": "68820",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOPAGA, BOYACA",
                    "value": "15820",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOPAIPI, CUNDINAMARCA",
                    "value": "25823",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TORIBIO, CAUCA",
                    "value": "19821",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TORO, VALLE",
                    "value": "76823",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOTA, BOYACA",
                    "value": "15822",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TOTORO, CAUCA",
                    "value": "19824",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TRINIDAD, CASANARE",
                    "value": "85430",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TRUJILLO, VALLE",
                    "value": "76828",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TUBARA, ATLANTICO",
                    "value": "08832",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TUCHIN, CORDOBA",
                    "value": "23815",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TULUA, VALLE",
                    "value": "76834",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TUNJA, BOYACA",
                    "value": "15001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TUNUNGUA, BOYACA",
                    "value": "15832",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TUQUERRES, NARIÑO",
                    "value": "52838",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TURBACO, BOLIVAR",
                    "value": "13836",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TURBANA, BOLIVAR",
                    "value": "13838",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TURBO, ANTIOQUIA",
                    "value": "05837",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TURMEQUE, BOYACA",
                    "value": "15835",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TUTA, BOYACA",
                    "value": "15837",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "TUTAZA, BOYACA",
                    "value": "15839",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "UBALA, CUNDINAMARCA",
                    "value": "25839",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "UBAQUE, CUNDINAMARCA",
                    "value": "25841",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ULLOA, VALLE",
                    "value": "76845",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "UMBITA, BOYACA",
                    "value": "15842",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "UNE, CUNDINAMARCA",
                    "value": "25845",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "UNGUIA, CHOCO",
                    "value": "27800",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "27"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "UNION PANAMERICANA, CHOCO",
                    "value": "27810",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "URAMITA, ANTIOQUIA",
                    "value": "05842",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "URIBE, META",
                    "value": "50370",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "URIBIA, LA GUAJIRA",
                    "value": "44847",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "URRAO, ANTIOQUIA",
                    "value": "05847",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "URUMITA, LA GUAJIRA",
                    "value": "44855",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "08"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "USIACURI, ATLANTICO",
                    "value": "08849",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "UTICA, CUNDINAMARCA",
                    "value": "25851",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALDIVIA, ANTIOQUIA",
                    "value": "05854",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "23"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALENCIA, CORDOBA",
                    "value": "23855",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALLE DE SAN JOSE, SANTANDER",
                    "value": "68855",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALLE DE SAN JUAN, TOLIMA",
                    "value": "73854",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALLE DEL GUAMUEZ, PUTUMAYO",
                    "value": "86865",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "20"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALLEDUPAR, CESAR",
                    "value": "20001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALPARAISO, ANTIOQUIA",
                    "value": "05856",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "18"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VALPARAISO, CAQUETA",
                    "value": "18860",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VEGACHI, ANTIOQUIA",
                    "value": "05858",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VELEZ, SANTANDER",
                    "value": "68861",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VENADILLO, TOLIMA",
                    "value": "73861",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VENECIA, ANTIOQUIA",
                    "value": "05861",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VENECIA, CUNDINAMARCA",
                    "value": "25506",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VENTAQUEMADA, BOYACA",
                    "value": "15861",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VERGARA, CUNDINAMARCA",
                    "value": "25862",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VERSALLES, VALLE",
                    "value": "76863",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VETAS, SANTANDER",
                    "value": "68867",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VIANI, CUNDINAMARCA",
                    "value": "25867",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VICTORIA, CALDAS",
                    "value": "17867",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VIGIA DEL FUERTE, ANTIOQUIA",
                    "value": "05873",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VIJES, VALLE",
                    "value": "76869",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLA CARO, NORTE DE SANTANDER",
                    "value": "54871",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLA DE LEYVA, BOYACA",
                    "value": "15407",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLA DE SAN DIEGO DE UBATE, CUNDINAMARCA",
                    "value": "25843",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "54"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLA DEL ROSARIO, NORTE DE SANTANDER",
                    "value": "54874",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "19"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLA RICA, CAUCA",
                    "value": "19845",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "86"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLAGARZON, PUTUMAYO",
                    "value": "86885",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLAGOMEZ, CUNDINAMARCA",
                    "value": "25871",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLAHERMOSA, TOLIMA",
                    "value": "73870",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLAMARIA, CALDAS",
                    "value": "17873",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLANUEVA, BOLIVAR",
                    "value": "13873",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "44"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLANUEVA, LA GUAJIRA",
                    "value": "44874",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLANUEVA, SANTANDER",
                    "value": "68872",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLANUEVA, CASANARE",
                    "value": "85440",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLAPINZON, CUNDINAMARCA",
                    "value": "25873",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "73"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLARRICA, TOLIMA",
                    "value": "73873",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLAVICENCIO, META",
                    "value": "50001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLAVIEJA, HUILA",
                    "value": "41872",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VILLETA, CUNDINAMARCA",
                    "value": "25875",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VIOTA, CUNDINAMARCA",
                    "value": "25878",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VIRACACHA, BOYACA",
                    "value": "15879",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "50"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VISTAHERMOSA, META",
                    "value": "50711",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "17"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "VITERBO, CALDAS",
                    "value": "17877",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YACOPI, CUNDINAMARCA",
                    "value": "25885",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "52"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YACUANQUER, NARIÑO",
                    "value": "52885",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "41"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YAGUARA, HUILA",
                    "value": "41885",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YALI, ANTIOQUIA",
                    "value": "05885",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YARUMAL, ANTIOQUIA",
                    "value": "05887",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "97"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YAVARATE, VAUPES",
                    "value": "97889",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YOLOMBO, ANTIOQUIA",
                    "value": "05890",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YONDO, ANTIOQUIA",
                    "value": "05893",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "85"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YOPAL, CASANARE",
                    "value": "85001",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YOTOCO, VALLE",
                    "value": "76890",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "YUMBO, VALLE",
                    "value": "76892",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "13"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZAMBRANO, BOLIVAR",
                    "value": "13894",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "68"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZAPATOCA, SANTANDER",
                    "value": "68895",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZAPAYAN, MAGDALENA",
                    "value": "47960",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "05"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZARAGOZA, ANTIOQUIA",
                    "value": "05895",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "76"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZARZAL, VALLE",
                    "value": "76895",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "15"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZETAQUIRA, BOYACA",
                    "value": "15897",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZIPACON, CUNDINAMARCA",
                    "value": "25898",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "25"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZIPAQUIRA, CUNDINAMARCA",
                    "value": "25899",
                    "subTipo": null
                },
                {
                    "dependsOn": [
                        {
                            "type": "departamento",
                            "id": "47"
                        }
                    ],
                    "topLeft": null,
                    "bottomRight": null,
                    "name": "ZONA BANANERA, MAGDALENA",
                    "value": "47980",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Estados del proyecto",
            "parameter": "estado",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Proyectos",
            "items": [
                {
                    "name": "APROBADO",
                    "value": "1",
                    "subTipo": null
                },
                {
                    "name": "REGISTRADO ACTUALIZADO",
                    "value": "2",
                    "subTipo": null
                },
                {
                    "name": "VIABILIDAD",
                    "value": "3",
                    "subTipo": null
                },
                {
                    "name": "VERIFICACIÓN",
                    "value": "4",
                    "subTipo": null
                },
                {
                    "name": "EN ACTUALIZACION",
                    "value": "5",
                    "subTipo": null
                },
                {
                    "name": "NO VIABLE",
                    "value": "6",
                    "subTipo": null
                },
                {
                    "name": "FORMULADO PARA REGISTRAR",
                    "value": "8",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Sector del proyecto",
            "parameter": "sector",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Proyectos",
            "items": [
                {
                    "name": "PLANEACION",
                    "value": "1979",
                    "subTipo": null
                },
                {
                    "name": "ESTADISTICA",
                    "value": "1980",
                    "subTipo": null
                },
                {
                    "name": "RELACIONES EXTERIORES",
                    "value": "1984",
                    "subTipo": null
                },
                {
                    "name": "DEFENSA",
                    "value": "1987",
                    "subTipo": null
                },
                {
                    "name": "AGRICULTURA",
                    "value": "1989",
                    "subTipo": null
                },
                {
                    "name": "MINAS Y ENERGIA",
                    "value": "1990",
                    "subTipo": null
                },
                {
                    "name": "EDUCACION",
                    "value": "1991",
                    "subTipo": null
                },
                {
                    "name": "COMUNICACIONES",
                    "value": "1992",
                    "subTipo": null
                },
                {
                    "name": "TRANSPORTE",
                    "value": "1993",
                    "subTipo": null
                },
                {
                    "name": "AMBIENTE Y DESARROLLO SOSTENIBLE",
                    "value": "1999",
                    "subTipo": null
                },
                {
                    "name": "CULTURA, DEPORTE Y RECREACION",
                    "value": "2000",
                    "subTipo": null
                },
                {
                    "name": "COMERCIO, INDUSTRIA Y TURISMO",
                    "value": "2002",
                    "subTipo": null
                },
                {
                    "name": "TRABAJO",
                    "value": "2003",
                    "subTipo": null
                },
                {
                    "name": "INTERIOR",
                    "value": "2004",
                    "subTipo": null
                },
                {
                    "name": "CIENCIA Y TECNOLOGÍA",
                    "value": "2006",
                    "subTipo": null
                },
                {
                    "name": "JUSTICIA Y DEL DERECHO",
                    "value": "2007",
                    "subTipo": null
                },
                {
                    "name": "VIVIENDA, CIUDAD Y TERRITORIO",
                    "value": "2008",
                    "subTipo": null
                },
                {
                    "name": "SALUD Y PROTECCION SOCIAL",
                    "value": "2120",
                    "subTipo": null
                },
                {
                    "name": "INCLUSIÓN SOCIAL Y RECONCILIACIÓN ",
                    "value": "2121",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Periodos",
            "parameter": "periods",
            "esMultiple": true,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Proyectos",
            "items": [
                {
                    "name": "2012",
                    "value": "2012",
                    "subTipo": null
                },
                {
                    "name": "2013",
                    "value": "2013",
                    "subTipo": null
                },
                {
                    "name": "2014",
                    "value": "2014",
                    "subTipo": null
                },
                {
                    "name": "2015",
                    "value": "2015",
                    "subTipo": null
                },
                {
                    "name": "2016",
                    "value": "2016",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Fuentes",
            "parameter": "fuentes",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Recursos",
            "items": [
                {
                    "name": "AHORRO PENSIONAL TERRITORIAL",
                    "value": "101",
                    "subTipo": null
                },
                {
                    "name": "ASIGNACIONES DIRECTAS",
                    "value": "1",
                    "subTipo": null
                },
                {
                    "name": "FONDO  DE COMPENSACIÓN REGIONAL",
                    "value": "2",
                    "subTipo": null
                },
                {
                    "name": "FONDO  DE DESARROLLO REGIONAL",
                    "value": "3",
                    "subTipo": null
                },
                {
                    "name": "FONDO DE AHORRO Y ESTABILIZACIÓN",
                    "value": "102",
                    "subTipo": null
                },
                {
                    "name": "FONDO DE CIENCIA, TECNOLOGÍA E INNOVACIÓN",
                    "value": "4",
                    "subTipo": null
                },
                {
                    "name": "Todas las Fuentes",
                    "value": "-1",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Periodos",
            "parameter": "periodosRecursos",
            "esMultiple": true,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Recursos",
            "items": [
                {
                    "name": "2012",
                    "value": "2012",
                    "subTipo": null
                },
                {
                    "name": "2013",
                    "value": "2013",
                    "subTipo": null
                },
                {
                    "name": "2014",
                    "value": "2014",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Recurso natural no renovable",
            "parameter": "recursoNatural",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Produccion",
            "items": [
                {
                    "name": "ARCILLAS CERAMICAS",
                    "value": "39",
                    "subTipo": null
                },
                {
                    "name": "ARCILLAS MISCELANEAS",
                    "value": "41",
                    "subTipo": null
                },
                {
                    "name": "ARENA DE CANTERA",
                    "value": "141",
                    "subTipo": null
                },
                {
                    "name": "ARENA DE RIO",
                    "value": "142",
                    "subTipo": null
                },
                {
                    "name": "ARENAS SILICEAS",
                    "value": "43",
                    "subTipo": null
                },
                {
                    "name": "AZUFRE",
                    "value": "36",
                    "subTipo": null
                },
                {
                    "name": "CALIZA",
                    "value": "148",
                    "subTipo": null
                },
                {
                    "name": "CALIZAS",
                    "value": "2",
                    "subTipo": null
                },
                {
                    "name": "CARBON",
                    "value": "1",
                    "subTipo": null
                },
                {
                    "name": "CRUDO",
                    "value": "O",
                    "subTipo": null
                },
                {
                    "name": "ESMERALDAS EN BRUTO",
                    "value": "52",
                    "subTipo": null
                },
                {
                    "name": "ESMERALDAS ENGASTADA",
                    "value": "53",
                    "subTipo": null
                },
                {
                    "name": "ESMERALDAS SEMIPRECIOSA",
                    "value": "51",
                    "subTipo": null
                },
                {
                    "name": "ESMERALDAS TALLADAS",
                    "value": "54",
                    "subTipo": null
                },
                {
                    "name": "GAS",
                    "value": "G",
                    "subTipo": null
                },
                {
                    "name": "GRAVA DE RIO",
                    "value": "146",
                    "subTipo": null
                },
                {
                    "name": "GRAVAS DE CANTERA",
                    "value": "145",
                    "subTipo": null
                },
                {
                    "name": "HIERRO",
                    "value": "7",
                    "subTipo": null
                },
                {
                    "name": "NIQUEL",
                    "value": "4",
                    "subTipo": null
                },
                {
                    "name": "NIQUEL",
                    "value": "5",
                    "subTipo": null
                },
                {
                    "name": "ORO",
                    "value": "61",
                    "subTipo": null
                },
                {
                    "name": "OTROS MINERALES",
                    "value": "76",
                    "subTipo": null
                },
                {
                    "name": "PLATA",
                    "value": "62",
                    "subTipo": null
                },
                {
                    "name": "PLATINO",
                    "value": "63",
                    "subTipo": null
                },
                {
                    "name": "RECEBO",
                    "value": "147",
                    "subTipo": null
                },
                {
                    "name": "ROCA FOSFORICA",
                    "value": "20",
                    "subTipo": null
                },
                {
                    "name": "SAL",
                    "value": "3",
                    "subTipo": null
                },
                {
                    "name": "SAL MARITIMA",
                    "value": "31",
                    "subTipo": null
                },
                {
                    "name": "SAL TERRESTRE",
                    "value": "32",
                    "subTipo": null
                },
                {
                    "name": "SAL TERRESTRE ZONA DE UPIN",
                    "value": "33",
                    "subTipo": null
                },
                {
                    "name": "YESO",
                    "value": "17",
                    "subTipo": null
                },
                {
                    "name": "Todos los recursos naturales",
                    "value": "-1",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Mina/Campo",
            "parameter": "campoProyecto",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Produccion",
            "items": [
                {
                    "name": "ABANICO  ",
                    "value": "N01110298",
                    "subTipo": null
                },
                {
                    "name": "ABANICO-12 ABANICO ",
                    "value": "N01111820",
                    "subTipo": null
                },
                {
                    "name": "ABARCO NARE ASOCIACION PESADO",
                    "value": "P00261276",
                    "subTipo": null
                },
                {
                    "name": "ABEDUS CRAVOVIEJO ",
                    "value": "N21751778",
                    "subTipo": null
                },
                {
                    "name": "ABEJAS ESTERO ",
                    "value": "N00670187",
                    "subTipo": null
                },
                {
                    "name": "ABONOS DEL ORIENTE LTDA",
                    "value": "JAL-08002X",
                    "subTipo": null
                },
                {
                    "name": "ACACIA ESTE LAS QUINCHAS PESADO",
                    "value": "P21711310",
                    "subTipo": null
                },
                {
                    "name": "ACAE-SAN MIGUEL (PTO COLON) ORITO ",
                    "value": "N00280088",
                    "subTipo": null
                },
                {
                    "name": "AGAPANTO MARANTA ",
                    "value": "N23121975",
                    "subTipo": null
                },
                {
                    "name": "AGUAS BLANCAS DE MARES ",
                    "value": "N00150002",
                    "subTipo": null
                },
                {
                    "name": "AKACIAS CP0-9 PESADO",
                    "value": "P22431622",
                    "subTipo": null
                },
                {
                    "name": "AKIRA CABRESTERO ",
                    "value": "N23031959",
                    "subTipo": null
                },
                {
                    "name": "AKIRA CABRESTERO PAREX ",
                    "value": "N23171959",
                    "subTipo": null
                },
                {
                    "name": "AKIRA CABRESTERO PAREX PESADO",
                    "value": "P23171959",
                    "subTipo": null
                },
                {
                    "name": "AKIRA CABRESTERO PESADO",
                    "value": "P23031959",
                    "subTipo": null
                },
                {
                    "name": "ALBORADA ORITO ",
                    "value": "N00280190",
                    "subTipo": null
                },
                {
                    "name": "ALEPE NASHIRA ",
                    "value": "N21991878",
                    "subTipo": null
                },
                {
                    "name": "ALMAGRO  ",
                    "value": "N21240515",
                    "subTipo": null
                },
                {
                    "name": "ALMAGRO _ECOPETROL ",
                    "value": "N23190515",
                    "subTipo": null
                },
                {
                    "name": "ALTAIR  ",
                    "value": "N22311558",
                    "subTipo": null
                },
                {
                    "name": "ALVA SUR NASHIRA ",
                    "value": "N21991876",
                    "subTipo": null
                },
                {
                    "name": "AMBAR QUIFA PESADO",
                    "value": "P22001648",
                    "subTipo": null
                },
                {
                    "name": "AMBROSIA  ",
                    "value": "N21410523",
                    "subTipo": null
                },
                {
                    "name": "AMBROSIA  PESADO",
                    "value": "P21410523",
                    "subTipo": null
                },
                {
                    "name": "ANDALUCIA SUR ALTO MAGDALENA ",
                    "value": "N14620003",
                    "subTipo": null
                },
                {
                    "name": "ANDARRIOS CACHICAMO-026-22008 ",
                    "value": "N22541666",
                    "subTipo": null
                },
                {
                    "name": "APAMATE LA CRECIENTE ",
                    "value": "N21891717",
                    "subTipo": null
                },
                {
                    "name": "APIAY  ",
                    "value": "N00010004",
                    "subTipo": null
                },
                {
                    "name": "APIAY  Incremental INCREMENTAL",
                    "value": "I21320004",
                    "subTipo": null
                },
                {
                    "name": "APIAY  PESADO",
                    "value": "P00010004",
                    "subTipo": null
                },
                {
                    "name": "APIAY ESTE APIAY ",
                    "value": "N00010005",
                    "subTipo": null
                },
                {
                    "name": "APIAY ESTE APIAY Incremental INCREMENTAL",
                    "value": "I21320005",
                    "subTipo": null
                },
                {
                    "name": "APIAY ESTE APIAY PESADO",
                    "value": "P00010005",
                    "subTipo": null
                },
                {
                    "name": "Araguato CHIPIRON ",
                    "value": "N11291130",
                    "subTipo": null
                },
                {
                    "name": "ARAUCA  ",
                    "value": "N00020006",
                    "subTipo": null
                },
                {
                    "name": "ARAUCO E&E CUBIRO ",
                    "value": "N21731304",
                    "subTipo": null
                },
                {
                    "name": "AREA TECA-COCORNA OPERACION-DIRECTA ECOPETROL ",
                    "value": "N22771812",
                    "subTipo": null
                },
                {
                    "name": "ARIANNA ESPERANZA ",
                    "value": "N21591167",
                    "subTipo": null
                },
                {
                    "name": "ARRAYAN ALTO MAGDALENA ",
                    "value": "N14621425",
                    "subTipo": null
                },
                {
                    "name": "ATARRAYA CPO-07 ",
                    "value": "N22971864",
                    "subTipo": null
                },
                {
                    "name": "AULLADOR PLAYON INCREMENTAL",
                    "value": "I22681928",
                    "subTipo": null
                },
                {
                    "name": "AURELIANO FORTUNA ",
                    "value": "N21651247",
                    "subTipo": null
                },
                {
                    "name": "AUSTRAL APIAY ",
                    "value": "N00010167",
                    "subTipo": null
                },
                {
                    "name": "AUTORRETENEDORES",
                    "value": "VARIOS",
                    "subTipo": null
                },
                {
                    "name": "AZOR E&E ARRENDAJO INCREMENTAL",
                    "value": "I22811818",
                    "subTipo": null
                },
                {
                    "name": "BALAY E&P EL  ",
                    "value": "N22281550",
                    "subTipo": null
                },
                {
                    "name": "BALCON PALERMO ",
                    "value": "N00310018",
                    "subTipo": null
                },
                {
                    "name": "BALCON PALERMO ECOPETROL ",
                    "value": "N23020018",
                    "subTipo": null
                },
                {
                    "name": "BALLENA 2 GUAJIRA ",
                    "value": "N00221857",
                    "subTipo": null
                },
                {
                    "name": "BALLENA GUAJIRA ",
                    "value": "N00220008",
                    "subTipo": null
                },
                {
                    "name": "BARQUEREÑA CASANARE ",
                    "value": "N00080009",
                    "subTipo": null
                },
                {
                    "name": "BARRANCA-LEBRIJA BARRANCAS LEBRIJA ",
                    "value": "N00040010",
                    "subTipo": null
                },
                {
                    "name": "BARRANQUERO E&E CUBIRO ",
                    "value": "N21731505",
                    "subTipo": null
                },
                {
                    "name": "BASTIDAS CRAVOVIEJO ",
                    "value": "N21751255",
                    "subTipo": null
                },
                {
                    "name": "BAUL LAS QUINCHAS PESADO",
                    "value": "P21711606",
                    "subTipo": null
                },
                {
                    "name": "BENJAMÍN GÓMEZ SANTOS",
                    "value": "GJ4-081 ",
                    "subTipo": null
                },
                {
                    "name": "BOA CORCEL ",
                    "value": "N21811471",
                    "subTipo": null
                },
                {
                    "name": "BOLIVAR BUENAVISTA ",
                    "value": "N21531115",
                    "subTipo": null
                },
                {
                    "name": "BONANZA PROVINCIA ",
                    "value": "N00740221",
                    "subTipo": null
                },
                {
                    "name": "BONANZA PROVINCIA INCREMENTAL INCREMENTAL",
                    "value": "I22520221",
                    "subTipo": null
                },
                {
                    "name": "BONGA E&P SAMAN ",
                    "value": "N23101946",
                    "subTipo": null
                },
                {
                    "name": "BONGA E&P SAMAN PENALIZADO",
                    "value": "Q23101946",
                    "subTipo": null
                },
                {
                    "name": "BOQUETE CICUCO ",
                    "value": "N00090029",
                    "subTipo": null
                },
                {
                    "name": "BORAL CEE RIO VERDE PESADO",
                    "value": "P21501411",
                    "subTipo": null
                },
                {
                    "name": "BRILLANTE SIERRA NEVADA ",
                    "value": "N22261679",
                    "subTipo": null
                },
                {
                    "name": "BRILLANTE SIERRA NEVADA PENALIZADO",
                    "value": "Q22261679",
                    "subTipo": null
                },
                {
                    "name": "BRINSA S.A.",
                    "value": "DID-082",
                    "subTipo": null
                },
                {
                    "name": "BRISAS ALTO MAGDALENA ",
                    "value": "N14620013",
                    "subTipo": null
                },
                {
                    "name": "BRISAS ALTO MAGDALENA Incremental INCREMENTAL",
                    "value": "I21330013",
                    "subTipo": null
                },
                {
                    "name": "BURDINE CDND/I NANCY, , MAXINE ",
                    "value": "N21770014",
                    "subTipo": null
                },
                {
                    "name": "CABILDO INDIGENA DE PURACE",
                    "value": "DDT-091",
                    "subTipo": null
                },
                {
                    "name": "CABIONA  ",
                    "value": "N21741238",
                    "subTipo": null
                },
                {
                    "name": "CAIPAL ECOP-OP-DIRECTA ",
                    "value": "N00200015",
                    "subTipo": null
                },
                {
                    "name": "CAIPAL ECOP-OP-DIRECTA-INCREMENTAL INCREMENTAL",
                    "value": "I21310015",
                    "subTipo": null
                },
                {
                    "name": "CALAMARO RONDON ",
                    "value": "N00641630",
                    "subTipo": null
                },
                {
                    "name": "CAMOA CDND  _ECOPETROL PESADO",
                    "value": "P23200153",
                    "subTipo": null
                },
                {
                    "name": "CAMOA CDND  PESADO",
                    "value": "P21510153",
                    "subTipo": null
                },
                {
                    "name": "CAMPO RICO  ",
                    "value": "N21380633",
                    "subTipo": null
                },
                {
                    "name": "CANACABARE ALCARAVAN ",
                    "value": "N01050397",
                    "subTipo": null
                },
                {
                    "name": "CAÑAFLECHA ESPERANZA ",
                    "value": "N21591405",
                    "subTipo": null
                },
                {
                    "name": "Canaguaro  E&P-016 del 2006 INCREMENTAL",
                    "value": "I22591723",
                    "subTipo": null
                },
                {
                    "name": "CANAGUEY COSECHA ",
                    "value": "N21791270",
                    "subTipo": null
                },
                {
                    "name": "CANDALAY GARCERO ",
                    "value": "N00681161",
                    "subTipo": null
                },
                {
                    "name": "CANDELILLA GUATIQUIA ",
                    "value": "N22221508",
                    "subTipo": null
                },
                {
                    "name": "CANDELILLA GUATIQUIA PENALIZADO",
                    "value": "Q22221508",
                    "subTipo": null
                },
                {
                    "name": "CAÑO DUYA COROCORA ",
                    "value": "N00900265",
                    "subTipo": null
                },
                {
                    "name": "CAÑO GANDUL COROCORA ",
                    "value": "N00900305",
                    "subTipo": null
                },
                {
                    "name": "CAÑO GARZA CASANARE ",
                    "value": "N00080016",
                    "subTipo": null
                },
                {
                    "name": "CAÑO GARZA ESTE CASANARE ",
                    "value": "N00080257",
                    "subTipo": null
                },
                {
                    "name": "CAÑO GARZA NORTE CASANARE ",
                    "value": "N00080017",
                    "subTipo": null
                },
                {
                    "name": "CAÑO LIMON CRAVO NORTE ",
                    "value": "N00120121",
                    "subTipo": null
                },
                {
                    "name": "CAÑO RONDON ESTE RONDON ",
                    "value": "N00641776",
                    "subTipo": null
                },
                {
                    "name": "CAÑO RONDON RONDON ",
                    "value": "N00640178",
                    "subTipo": null
                },
                {
                    "name": "CAÑO YARUMAL CRAVO NORTE ",
                    "value": "N00120123",
                    "subTipo": null
                },
                {
                    "name": "CAPELLA OMBU PESADO",
                    "value": "P22071397",
                    "subTipo": null
                },
                {
                    "name": "CAPORO LA LOMA PENALIZADO",
                    "value": "Q21861300",
                    "subTipo": null
                },
                {
                    "name": "CAPYBARA CASTOR ",
                    "value": "N22441626",
                    "subTipo": null
                },
                {
                    "name": "CARACARA SUR A CARACARA ",
                    "value": "N16321193",
                    "subTipo": null
                },
                {
                    "name": "CARACARA SUR B y C CARACARA ",
                    "value": "N16321234",
                    "subTipo": null
                },
                {
                    "name": "CARBONERA-LA SILLA CARBONERA CDNDI ",
                    "value": "N21520020",
                    "subTipo": null
                },
                {
                    "name": "CARBONES DE LA JAGUA",
                    "value": "285-95",
                    "subTipo": null
                },
                {
                    "name": "CARBONES DE LA JAGUA",
                    "value": "GBKG-02",
                    "subTipo": null
                },
                {
                    "name": "CARBONES DE LA JAGUA",
                    "value": "GGBD-04",
                    "subTipo": null
                },
                {
                    "name": "CARBONES DE LA JAGUA",
                    "value": "GGBD-05",
                    "subTipo": null
                },
                {
                    "name": "CARBONES EL TESORO",
                    "value": "132-97",
                    "subTipo": null
                },
                {
                    "name": "CARBONES EL TESORO",
                    "value": "GION-01",
                    "subTipo": null
                },
                {
                    "name": "CARDENAL CORCEL ",
                    "value": "N21811663",
                    "subTipo": null
                },
                {
                    "name": "CARETO E&E CUBIRO ",
                    "value": "N21731232",
                    "subTipo": null
                },
                {
                    "name": "CARIBE ORITO ",
                    "value": "N00280021",
                    "subTipo": null
                },
                {
                    "name": "CARIBE ORITO Incremental INCREMENTAL",
                    "value": "I21340021",
                    "subTipo": null
                },
                {
                    "name": "CARICARE RONDON ",
                    "value": "N00641145",
                    "subTipo": null
                },
                {
                    "name": "CARLOS ARTURO POSADA ZAPATA",
                    "value": "LF3-08011",
                    "subTipo": null
                },
                {
                    "name": "CARRIZALES CRAVOVIEJO ",
                    "value": "N21751290",
                    "subTipo": null
                },
                {
                    "name": "CARRIZALES CRAVOVIEJO PESADO",
                    "value": "P21751290",
                    "subTipo": null
                },
                {
                    "name": "Carupana YAMU ",
                    "value": "N21551129",
                    "subTipo": null
                },
                {
                    "name": "CARUTO CORCEL ",
                    "value": "N21811624",
                    "subTipo": null
                },
                {
                    "name": "CASABE  ",
                    "value": "N00070022",
                    "subTipo": null
                },
                {
                    "name": "CASABE  INCREMENTAL INCREMENTAL",
                    "value": "I21660022",
                    "subTipo": null
                },
                {
                    "name": "CASABE  PENALIZADO",
                    "value": "Q00070022",
                    "subTipo": null
                },
                {
                    "name": "CASABE SUR CASABE ",
                    "value": "N00071528",
                    "subTipo": null
                },
                {
                    "name": "CASABE SUR CASABE PENALIZADO",
                    "value": "Q00071528",
                    "subTipo": null
                },
                {
                    "name": "CASTILLA CUBARRAL ",
                    "value": "N00140023",
                    "subTipo": null
                },
                {
                    "name": "CASTILLA CUBARRAL Incremental INCREMENTAL",
                    "value": "I21350023",
                    "subTipo": null
                },
                {
                    "name": "CASTILLA CUBARRAL PESADO",
                    "value": "P00140023",
                    "subTipo": null
                },
                {
                    "name": "CASTILLA ESTE APIAY ",
                    "value": "N00010163",
                    "subTipo": null
                },
                {
                    "name": "CASTILLA ESTE APIAY Incremental INCREMENTAL",
                    "value": "I21320163",
                    "subTipo": null
                },
                {
                    "name": "CASTILLA NORTE APIAY ",
                    "value": "N00010162",
                    "subTipo": null
                },
                {
                    "name": "CASTILLA NORTE APIAY Incremental INCREMENTAL",
                    "value": "I21320162",
                    "subTipo": null
                },
                {
                    "name": "CASTILLA NORTE APIAY PESADO",
                    "value": "P00010162",
                    "subTipo": null
                },
                {
                    "name": "CATALINA BOLIVAR ",
                    "value": "N01030279",
                    "subTipo": null
                },
                {
                    "name": "CEBU ALTO MAGDALENA ",
                    "value": "N14620024",
                    "subTipo": null
                },
                {
                    "name": "CEBU ALTO MAGDALENA Incremental INCREMENTAL",
                    "value": "I21330024",
                    "subTipo": null
                },
                {
                    "name": "CELEUS E&P Llanos 17 ",
                    "value": "N23111953",
                    "subTipo": null
                },
                {
                    "name": "CEMEX",
                    "value": "022-90M",
                    "subTipo": null
                },
                {
                    "name": "CEMT",
                    "value": "GAHC-01",
                    "subTipo": null
                },
                {
                    "name": "CENCELLA ORITO ",
                    "value": "N00280173",
                    "subTipo": null
                },
                {
                    "name": "CENTAURO SUR CAMPO RICO ",
                    "value": "N21381216",
                    "subTipo": null
                },
                {
                    "name": "CENTAURO SUR CAMPO RICO PESADO",
                    "value": "P21381216",
                    "subTipo": null
                },
                {
                    "name": "CERNICALO E&E CUBIRO ",
                    "value": "N21731833",
                    "subTipo": null
                },
                {
                    "name": "CERRITO  ",
                    "value": "N17430248",
                    "subTipo": null
                },
                {
                    "name": "CERRO GORDO BLOQUE CARBONERA ",
                    "value": "N21841296",
                    "subTipo": null
                },
                {
                    "name": "CERRO GORDO BLOQUE CARBONERA PENALIZADO",
                    "value": "Q21841296",
                    "subTipo": null
                },
                {
                    "name": "Cerro Matoso S.A",
                    "value": "051-96",
                    "subTipo": null
                },
                {
                    "name": "Cerro Matoso S.A",
                    "value": "1727",
                    "subTipo": null
                },
                {
                    "name": "Cerro Matoso S.A",
                    "value": "866",
                    "subTipo": null
                },
                {
                    "name": "CERRO TASAJERO",
                    "value": "267-95",
                    "subTipo": null
                },
                {
                    "name": "CHAMAN E&P SABANERO PESADO",
                    "value": "P22412005",
                    "subTipo": null
                },
                {
                    "name": "CHAPARRITO ESTERO ",
                    "value": "N00670185",
                    "subTipo": null
                },
                {
                    "name": "CHAPARRO CAGUAN ECOPETROL ",
                    "value": "N22751326",
                    "subTipo": null
                },
                {
                    "name": "CHAPARRO CAGUAN ECOPETROL PENALIZADO",
                    "value": "Q22751326",
                    "subTipo": null
                },
                {
                    "name": "CHENCHE  CDND/I ",
                    "value": "N21430289",
                    "subTipo": null
                },
                {
                    "name": "CHICALA NARE ASOCIACION PESADO",
                    "value": "P00260175",
                    "subTipo": null
                },
                {
                    "name": "CHICHIMENE CUBARRAL ",
                    "value": "N00140025",
                    "subTipo": null
                },
                {
                    "name": "CHICHIMENE CUBARRAL Incremental INCREMENTAL",
                    "value": "I21350025",
                    "subTipo": null
                },
                {
                    "name": "CHICHIMENE CUBARRAL PESADO",
                    "value": "P00140025",
                    "subTipo": null
                },
                {
                    "name": "CHICHIMENE SW CUBARRAL ",
                    "value": "N00141384",
                    "subTipo": null
                },
                {
                    "name": "CHICHIMENE SW CUBARRAL PESADO",
                    "value": "P00141384",
                    "subTipo": null
                },
                {
                    "name": "CHILACO CORCEL ",
                    "value": "N21811855",
                    "subTipo": null
                },
                {
                    "name": "CHIPIRON  ",
                    "value": "N11291745",
                    "subTipo": null
                },
                {
                    "name": "CHUCHUPA 2 GUAJIRA ",
                    "value": "N00221860",
                    "subTipo": null
                },
                {
                    "name": "CHUCHUPA GUAJIRA ",
                    "value": "N00220027",
                    "subTipo": null
                },
                {
                    "name": "CHUIRA E&P MIDAS ",
                    "value": "N22241514",
                    "subTipo": null
                },
                {
                    "name": "CHURUYACO ORITO ",
                    "value": "N00280028",
                    "subTipo": null
                },
                {
                    "name": "CICUCO  ",
                    "value": "N00090129",
                    "subTipo": null
                },
                {
                    "name": "CIRIGUELO  ",
                    "value": "N22121435",
                    "subTipo": null
                },
                {
                    "name": "CIRIGUELO  PESADO",
                    "value": "P22121435",
                    "subTipo": null
                },
                {
                    "name": "CMU",
                    "value": "109-90",
                    "subTipo": null
                },
                {
                    "name": "CNR-LA FRANCIA",
                    "value": "5160",
                    "subTipo": null
                },
                {
                    "name": "CNR-LA FRANCIA",
                    "value": "EDUH-01",
                    "subTipo": null
                },
                {
                    "name": "CNR-LA FRANCIA",
                    "value": "GAK-152",
                    "subTipo": null
                },
                {
                    "name": "COBRA CORCEL ",
                    "value": "N21811762",
                    "subTipo": null
                },
                {
                    "name": "COBRA CORCEL PESADO",
                    "value": "P21811762",
                    "subTipo": null
                },
                {
                    "name": "COHEMBI CPI SUR ORIENTE ",
                    "value": "N21460209",
                    "subTipo": null
                },
                {
                    "name": "COLON E&P LA PALOMA ",
                    "value": "N22291554",
                    "subTipo": null
                },
                {
                    "name": "COLORADO DE MARES ",
                    "value": "N00150032",
                    "subTipo": null
                },
                {
                    "name": "COLSALMINAS LTDA",
                    "value": "HIQO-01",
                    "subTipo": null
                },
                {
                    "name": "COLSALMINAS LTDA",
                    "value": "HIQO-01, HIQO-",
                    "subTipo": null
                },
                {
                    "name": "COLSALMINAS LTDA ",
                    "value": "HIQO-03",
                    "subTipo": null
                },
                {
                    "name": "COLSALMINAS LTDA",
                    "value": "NEMOCON",
                    "subTipo": null
                },
                {
                    "name": "COLSALMINAS LTDA ",
                    "value": "ZIPAQUIRA",
                    "subTipo": null
                },
                {
                    "name": "CONTRATO DE ASOCIACION",
                    "value": "00-1976",
                    "subTipo": null
                },
                {
                    "name": "CONTRATO LA COMUNIDAD",
                    "value": "11",
                    "subTipo": null
                },
                {
                    "name": "CONTRATO LA COMUNIDAD",
                    "value": "ECDA-01",
                    "subTipo": null
                },
                {
                    "name": "CONTRATO OREGANAL",
                    "value": "081-91",
                    "subTipo": null
                },
                {
                    "name": "CONTRATO OREGANAL",
                    "value": "GBSC-02",
                    "subTipo": null
                },
                {
                    "name": "CONTRATO PATILLA",
                    "value": "067-2001",
                    "subTipo": null
                },
                {
                    "name": "CONTRATO PATILLA",
                    "value": "HBSK-01",
                    "subTipo": null
                },
                {
                    "name": "COPA A SUR E&E CUBIRO ",
                    "value": "N21731788",
                    "subTipo": null
                },
                {
                    "name": "COPA B E&E CUBIRO ",
                    "value": "N21731787",
                    "subTipo": null
                },
                {
                    "name": "COPA E&E CUBIRO ",
                    "value": "N21731566",
                    "subTipo": null
                },
                {
                    "name": "CORAZON 9 LAS MONAS ",
                    "value": "N00251489",
                    "subTipo": null
                },
                {
                    "name": "CORAZON LAS MONAS ",
                    "value": "N00250280",
                    "subTipo": null
                },
                {
                    "name": "CORAZON WEST 4 LAS MONAS ",
                    "value": "N00251684",
                    "subTipo": null
                },
                {
                    "name": "CORAZON WEST LAS MONAS ",
                    "value": "N00251218",
                    "subTipo": null
                },
                {
                    "name": "CORCEL A CORCEL ",
                    "value": "N21811278",
                    "subTipo": null
                },
                {
                    "name": "CORCEL C CORCEL ",
                    "value": "N21811419",
                    "subTipo": null
                },
                {
                    "name": "CORCEL D CORCEL ",
                    "value": "N21811420",
                    "subTipo": null
                },
                {
                    "name": "CORCEL E CORCEL ",
                    "value": "N21811451",
                    "subTipo": null
                },
                {
                    "name": "COREN COROCORA ",
                    "value": "N00901564",
                    "subTipo": null
                },
                {
                    "name": "COROCORA  ",
                    "value": "N00900517",
                    "subTipo": null
                },
                {
                    "name": "CORRALES -1-D BUENAVISTA ",
                    "value": "N21531659",
                    "subTipo": null
                },
                {
                    "name": "CORRALES -1-D BUENAVISTA PENALIZADO",
                    "value": "Q21531659",
                    "subTipo": null
                },
                {
                    "name": "CORRALES -3  BUENAVISTA ",
                    "value": "N21531942",
                    "subTipo": null
                },
                {
                    "name": "CORRALES 1-1 BUENAVISTA ",
                    "value": "N21531941",
                    "subTipo": null
                },
                {
                    "name": "CORRALES 1-1 BUENAVISTA PENALIZADO",
                    "value": "Q21531941",
                    "subTipo": null
                },
                {
                    "name": "COSTAYACO CHAZA ",
                    "value": "N21761258",
                    "subTipo": null
                },
                {
                    "name": "COTORRA E&P Guama ",
                    "value": "N22621826",
                    "subTipo": null
                },
                {
                    "name": "COTORRA E&P Guama PENALIZADO",
                    "value": "Q22621826",
                    "subTipo": null
                },
                {
                    "name": "CRAVO ESTE CASANARE ",
                    "value": "N00080033",
                    "subTipo": null
                },
                {
                    "name": "CRISTALINA  ",
                    "value": "N00550166",
                    "subTipo": null
                },
                {
                    "name": "CSE-8 CAÑO SUR E&P PESADO",
                    "value": "P22571738",
                    "subTipo": null
                },
                {
                    "name": "CUBARRO TIPLE ",
                    "value": "N22381582",
                    "subTipo": null
                },
                {
                    "name": "CUERVA ESTE CUERVA ",
                    "value": "N22082029",
                    "subTipo": null
                },
                {
                    "name": "CUERVA NOROESTE CUERVA ",
                    "value": "N22082028",
                    "subTipo": null
                },
                {
                    "name": "CUERVA OESTE CUERVA ",
                    "value": "N22081616",
                    "subTipo": null
                },
                {
                    "name": "CUERVA SUR CUERVA ",
                    "value": "N22081732",
                    "subTipo": null
                },
                {
                    "name": "CUERVA SUROESTE CUERVA ",
                    "value": "N22081671",
                    "subTipo": null
                },
                {
                    "name": "CUMBRE E&p Llanos-20 Contrato No. 46  ",
                    "value": "N22941847",
                    "subTipo": null
                },
                {
                    "name": "CUPIAGUA ECOP-SDLA-OP-DIRECTA ",
                    "value": "N22340259",
                    "subTipo": null
                },
                {
                    "name": "CUPIAGUA ECOP-SDLA-OP-DIRECTA PENALIZADO",
                    "value": "Q22340259",
                    "subTipo": null
                },
                {
                    "name": "CUPIAGUA ECOP-SDLA-OP-DIRECTA-INCREMENTAL INCREMENTAL",
                    "value": "I23230259",
                    "subTipo": null
                },
                {
                    "name": "CUPIAGUA LIRIA RECETOR EQUION ",
                    "value": "N22501098",
                    "subTipo": null
                },
                {
                    "name": "CUPIAGUA LIRIA RECETOR EQUION PENALIZADO",
                    "value": "Q22501098",
                    "subTipo": null
                },
                {
                    "name": "CUPIAGUA SUR ECOP-SDLA-OP-DIRECTA ",
                    "value": "N22340308",
                    "subTipo": null
                },
                {
                    "name": "CUPIAGUA SUR ECOP-SDLA-OP-DIRECTA PENALIZADO",
                    "value": "Q22340308",
                    "subTipo": null
                },
                {
                    "name": "CUPIAGUA SUR ECOP-SDLA-OP-DIRECTA-INCREMENTAL INCREMENTAL",
                    "value": "I23230308",
                    "subTipo": null
                },
                {
                    "name": "CUSIANA NORTE  ",
                    "value": "N22581699",
                    "subTipo": null
                },
                {
                    "name": "CUSIANA NORTE  PENALIZADO",
                    "value": "Q22581699",
                    "subTipo": null
                },
                {
                    "name": "CUSIANA RIO CHITAMENA EQUION ",
                    "value": "N22460048",
                    "subTipo": null
                },
                {
                    "name": "CUSIANA RIO CHITAMENA EQUION PENALIZADO",
                    "value": "Q22460048",
                    "subTipo": null
                },
                {
                    "name": "CUSIANA TAURAMENA EQUION ",
                    "value": "N22480048",
                    "subTipo": null
                },
                {
                    "name": "CUSIANA TAURAMENA EQUION PENALIZADO",
                    "value": "Q22480048",
                    "subTipo": null
                },
                {
                    "name": "DELE RECETOR EQUION ",
                    "value": "N22501284",
                    "subTipo": null
                },
                {
                    "name": "DELE RECETOR EQUION PENALIZADO",
                    "value": "Q22501284",
                    "subTipo": null
                },
                {
                    "name": "DELTA BUGANVILES ",
                    "value": "N22051379",
                    "subTipo": null
                },
                {
                    "name": "DINA CRETACEO ALTO MAGDALENA ",
                    "value": "N14620036",
                    "subTipo": null
                },
                {
                    "name": "DINA CRETACEO ALTO MAGDALENA Incremental INCREMENTAL",
                    "value": "I21330036",
                    "subTipo": null
                },
                {
                    "name": "DINA TERCIARIO ALTO MAGDALENA ",
                    "value": "N14620038",
                    "subTipo": null
                },
                {
                    "name": "DINA TERCIARIO ALTO MAGDALENA Incremental INCREMENTAL",
                    "value": "I21330038",
                    "subTipo": null
                },
                {
                    "name": "DINA TERCIARIO ALTO MAGDALENA PENALIZADO",
                    "value": "Q14620038",
                    "subTipo": null
                },
                {
                    "name": "DISA MAPACHE ",
                    "value": "N22091730",
                    "subTipo": null
                },
                {
                    "name": "DON PEDRO DOIMA ",
                    "value": "N21781377",
                    "subTipo": null
                },
                {
                    "name": "DON PEDRO NORTE CPI ORTEGA INCREMENTAL",
                    "value": "I21471810",
                    "subTipo": null
                },
                {
                    "name": "DOÑA MARIA LEBRIJA ",
                    "value": "N00370051",
                    "subTipo": null
                },
                {
                    "name": "DORCAS CPO-17 PESADO",
                    "value": "P22881830",
                    "subTipo": null
                },
                {
                    "name": "DOROTEA A DOROTEA ",
                    "value": "N22041368",
                    "subTipo": null
                },
                {
                    "name": "DOROTEA B DOROTEA ",
                    "value": "N22041369",
                    "subTipo": null
                },
                {
                    "name": "Drummond - El Descanso",
                    "value": "144-97",
                    "subTipo": null
                },
                {
                    "name": "Drummond - La Loma",
                    "value": "078-88",
                    "subTipo": null
                },
                {
                    "name": "EDGAR OCTAVIO PEREZ VANEGAS",
                    "value": "ADD-161 (918-15)",
                    "subTipo": null
                },
                {
                    "name": "EL HATILLO",
                    "value": "147-97",
                    "subTipo": null
                },
                {
                    "name": "ELIZITA CARACARA ",
                    "value": "N16320450",
                    "subTipo": null
                },
                {
                    "name": "EMBRUJO CAÑO SUR E&P PESADO",
                    "value": "P22571883",
                    "subTipo": null
                },
                {
                    "name": "EMPRESA DE FOSFATOS DE BOYACA",
                    "value": "1056-15",
                    "subTipo": null
                },
                {
                    "name": "EMPRESA DE FOSFATOS DE BOYACA",
                    "value": "696R",
                    "subTipo": null
                },
                {
                    "name": "EMPRESA DE FOSFATOS DE BOYACA",
                    "value": "AH9-151",
                    "subTipo": null
                },
                {
                    "name": "EMPRESA DE FOSFATOS DEL HUILA",
                    "value": "10015",
                    "subTipo": null
                },
                {
                    "name": "EMPRESA MINERA DE TENCUA LTDA.",
                    "value": "HCQL-01",
                    "subTipo": null
                },
                {
                    "name": "ENTRERRIOS  CDND/I ",
                    "value": "N12500197",
                    "subTipo": null
                },
                {
                    "name": "ESPINO CAGUAN ECOPETROL ",
                    "value": "N22750630",
                    "subTipo": null
                },
                {
                    "name": "ESPINO CAGUAN ECOPETROL PENALIZADO",
                    "value": "Q22750630",
                    "subTipo": null
                },
                {
                    "name": "ESTERO ALCARAVAN ",
                    "value": "N01050634",
                    "subTipo": null
                },
                {
                    "name": "FAUNO CAÑO SUR E&P PESADO",
                    "value": "P22571712",
                    "subTipo": null
                },
                {
                    "name": "FENIX E&P  ",
                    "value": "N22361571",
                    "subTipo": null
                },
                {
                    "name": "FENIX E&P  PESADO",
                    "value": "P22361571",
                    "subTipo": null
                },
                {
                    "name": "FERTILIZANTES DEL PAEZ - FERTIPAEZ S A",
                    "value": "HID-10001",
                    "subTipo": null
                },
                {
                    "name": "FLAMI E&P LLANOS 27  ",
                    "value": "N22991925",
                    "subTipo": null
                },
                {
                    "name": "FLOREÑA MIRADOR PIEDEMONTE EQUION ",
                    "value": "N22471949",
                    "subTipo": null
                },
                {
                    "name": "FLOREÑA MIRADOR PIEDEMONTE EQUION PENALIZADO",
                    "value": "Q22471949",
                    "subTipo": null
                },
                {
                    "name": "FLOREÑA PIEDEMONTE EQUION ",
                    "value": "N22470301",
                    "subTipo": null
                },
                {
                    "name": "FLOREÑA PIEDEMONTE EQUION PENALIZADO",
                    "value": "Q22470301",
                    "subTipo": null
                },
                {
                    "name": "FONTANA CAÑO SUR E&P PESADO",
                    "value": "P22572003",
                    "subTipo": null
                },
                {
                    "name": "GALA DE MARES ",
                    "value": "N00150040",
                    "subTipo": null
                },
                {
                    "name": "GALAN DE MARES ",
                    "value": "N00150041",
                    "subTipo": null
                },
                {
                    "name": "GARZAS DORADAS LAS GARZAS ",
                    "value": "N21981359",
                    "subTipo": null
                },
                {
                    "name": "GARZAS YARIGUI- ",
                    "value": "N00440042",
                    "subTipo": null
                },
                {
                    "name": "GAVAN APIAY ",
                    "value": "N00010262",
                    "subTipo": null
                },
                {
                    "name": "GAVAN APIAY PESADO",
                    "value": "P00010262",
                    "subTipo": null
                },
                {
                    "name": "GIBRALTAR CONVENIO DE EXPLORACION Y EXPLOTACION DE HIDROCARBUROS AREA SIRIRI ",
                    "value": "N22631747",
                    "subTipo": null
                },
                {
                    "name": "GIBRALTAR CONVENIO DE EXPLORACION Y EXPLOTACION DE HIDROCARBUROS AREA SIRIRI PENALIZADO",
                    "value": "Q22631747",
                    "subTipo": null
                },
                {
                    "name": "GIGANTE MATAMBO ",
                    "value": "N01060291",
                    "subTipo": null
                },
                {
                    "name": "GIRASOL NARE ASOCIACION PESADO",
                    "value": "P00261158",
                    "subTipo": null
                },
                {
                    "name": "GRETA OTO CACHICAMO-026-22008 ",
                    "value": "N22541930",
                    "subTipo": null
                },
                {
                    "name": "GUACHARACA CACHICAMO-026-22008 ",
                    "value": "N22541667",
                    "subTipo": null
                },
                {
                    "name": "GUADUAS DINDAL - RIO SECO ",
                    "value": "N00910636",
                    "subTipo": null
                },
                {
                    "name": "GUAHIBOS GUACHIRIA ",
                    "value": "N21690217",
                    "subTipo": null
                },
                {
                    "name": "GUALA CORCEL ",
                    "value": "N21811894",
                    "subTipo": null
                },
                {
                    "name": "GUANAPALO ESTERO ",
                    "value": "N00670196",
                    "subTipo": null
                },
                {
                    "name": "GUANDO BOQUERON ",
                    "value": "N01090296",
                    "subTipo": null
                },
                {
                    "name": "GUANDO SW BOQUERON ",
                    "value": "N01091972",
                    "subTipo": null
                },
                {
                    "name": "GUARILAQUE OROCUE ",
                    "value": "N00870255",
                    "subTipo": null
                },
                {
                    "name": "GUARIQUIES RAMSHORL-ECOPETROL INCREMENTAL",
                    "value": "I21671202",
                    "subTipo": null
                },
                {
                    "name": "GUARIQUIES RAMSHORL-ECOPETROL PENALIZADO",
                    "value": "Q21671202",
                    "subTipo": null
                },
                {
                    "name": "GUARROJO E&E  ",
                    "value": "N22011780",
                    "subTipo": null
                },
                {
                    "name": "GUASAR GARCERO ",
                    "value": "N00680256",
                    "subTipo": null
                },
                {
                    "name": "GUATIQUIA APIAY ",
                    "value": "N00010044",
                    "subTipo": null
                },
                {
                    "name": "GUATIQUIA APIAY Incremental INCREMENTAL",
                    "value": "I21320044",
                    "subTipo": null
                },
                {
                    "name": "GUATIQUIA APIAY PESADO",
                    "value": "P00010044",
                    "subTipo": null
                },
                {
                    "name": "GUAYURIBA APIAY ",
                    "value": "N00010176",
                    "subTipo": null
                },
                {
                    "name": "GUAYURIBA APIAY Incremental INCREMENTAL",
                    "value": "I21320176",
                    "subTipo": null
                },
                {
                    "name": "GUAYUYACO  ",
                    "value": "N14331163",
                    "subTipo": null
                },
                {
                    "name": "HEREDIA CRAVOVIEJO ",
                    "value": "N21751719",
                    "subTipo": null
                },
                {
                    "name": "HICOTEA LA LOMA PENALIZADO",
                    "value": "Q21861522",
                    "subTipo": null
                },
                {
                    "name": "HOATZIN  ",
                    "value": "N22111433",
                    "subTipo": null
                },
                {
                    "name": "HOLCIM",
                    "value": "066-94M",
                    "subTipo": null
                },
                {
                    "name": "HOLCIM",
                    "value": "125-95M",
                    "subTipo": null
                },
                {
                    "name": "HOLCIM",
                    "value": "125-95M (937-15)",
                    "subTipo": null
                },
                {
                    "name": "HORMIGA ORITO ",
                    "value": "N00280046",
                    "subTipo": null
                },
                {
                    "name": "HURON NISCOTA ",
                    "value": "N23242008",
                    "subTipo": null
                },
                {
                    "name": "IBATA QUESADA CARLOS ENRIQUE",
                    "value": "NF4-09571",
                    "subTipo": null
                },
                {
                    "name": "IBOGA E&P LLANOS 31 ",
                    "value": "N22731862",
                    "subTipo": null
                },
                {
                    "name": "IGUANA LA LOMA PENALIZADO",
                    "value": "Q21861409",
                    "subTipo": null
                },
                {
                    "name": "INFANTAS DE MARES ",
                    "value": "N00150047",
                    "subTipo": null
                },
                {
                    "name": "INFANTAS DE MARES PENALIZADO",
                    "value": "Q00150047",
                    "subTipo": null
                },
                {
                    "name": "INFANTAS LA CIRA- INCREMENTAL INCREMENTAL",
                    "value": "I21580047",
                    "subTipo": null
                },
                {
                    "name": "INFANTAS LA CIRA- INCREMENTAL PENALIZADO",
                    "value": "Q21580047",
                    "subTipo": null
                },
                {
                    "name": "JAGUAR SOUTH WEST CARACARA ",
                    "value": "N16321477",
                    "subTipo": null
                },
                {
                    "name": "JAVA E&P Llanos 16 Contrato # 45 ",
                    "value": "N22421850",
                    "subTipo": null
                },
                {
                    "name": "JAZMIN NARE ASOCIACION ",
                    "value": "N00260277",
                    "subTipo": null
                },
                {
                    "name": "JIBA CHIPIRON ",
                    "value": "N11291126",
                    "subTipo": null
                },
                {
                    "name": "JIBA UNIFICADO CHIPIRON ",
                    "value": "N11291415",
                    "subTipo": null
                },
                {
                    "name": "JILGUERO GARIBAY ",
                    "value": "N22391583",
                    "subTipo": null
                },
                {
                    "name": "JILGUERO SUR TIPLE ",
                    "value": "N22381690",
                    "subTipo": null
                },
                {
                    "name": "JORCAN GARCERO ",
                    "value": "N00681198",
                    "subTipo": null
                },
                {
                    "name": "JORDAN GARCERO ",
                    "value": "N00680192",
                    "subTipo": null
                },
                {
                    "name": "JUANAMBU GUAYUYACO ",
                    "value": "N14331260",
                    "subTipo": null
                },
                {
                    "name": "JUGLAR E&P LA PALOMA ",
                    "value": "N22291977",
                    "subTipo": null
                },
                {
                    "name": "KATANA ESPERANZA ",
                    "value": "N21591407",
                    "subTipo": null
                },
                {
                    "name": "KATMANDÚ CERRERO ",
                    "value": "N23061903",
                    "subTipo": null
                },
                {
                    "name": "KITARO CABRESTERO ",
                    "value": "N23031887",
                    "subTipo": null
                },
                {
                    "name": "KITARO CABRESTERO PAREX ",
                    "value": "N23171887",
                    "subTipo": null
                },
                {
                    "name": "KONA E&P Llanos 16 Contrato # 45 ",
                    "value": "N22421620",
                    "subTipo": null
                },
                {
                    "name": "LA CAÑADA SAN JACINTO ",
                    "value": "N21720049",
                    "subTipo": null
                },
                {
                    "name": "LA CASONA EL EDEN PAREX ",
                    "value": "N23141979",
                    "subTipo": null
                },
                {
                    "name": "LA CIRA -INFANTAS INCREMENTAL INCREMENTAL",
                    "value": "I21580050",
                    "subTipo": null
                },
                {
                    "name": "LA CIRA -INFANTAS INCREMENTAL PENALIZADO",
                    "value": "Q21580050",
                    "subTipo": null
                },
                {
                    "name": "LA CIRA DE MARES ",
                    "value": "N00150050",
                    "subTipo": null
                },
                {
                    "name": "LA CIRA DE MARES PENALIZADO",
                    "value": "Q00150050",
                    "subTipo": null
                },
                {
                    "name": "LA CRECIENTE  ",
                    "value": "N21891312",
                    "subTipo": null
                },
                {
                    "name": "LA CRECIENTE-D  LA CRECIENTE ",
                    "value": "N21891921",
                    "subTipo": null
                },
                {
                    "name": "LA FLORA CASANARE ",
                    "value": "N00080164",
                    "subTipo": null
                },
                {
                    "name": "LA GLORIA CASANARE ",
                    "value": "N00080145",
                    "subTipo": null
                },
                {
                    "name": "LA GLORIA NORTE CASANARE ",
                    "value": "N00080043",
                    "subTipo": null
                },
                {
                    "name": "LA HOCHA RIO PAEZ ",
                    "value": "N01150306",
                    "subTipo": null
                },
                {
                    "name": "LA JAGUA TELLO ",
                    "value": "N00361176",
                    "subTipo": null
                },
                {
                    "name": "LA PINTA SIERRA NEVADA ",
                    "value": "N22261520",
                    "subTipo": null
                },
                {
                    "name": "LA PUNTA  - CDND/I ",
                    "value": "N21420199",
                    "subTipo": null
                },
                {
                    "name": "LA REFORMA APIAY ",
                    "value": "N00010200",
                    "subTipo": null
                },
                {
                    "name": "LA ROMPIDA  CDND/I ",
                    "value": "N00750222",
                    "subTipo": null
                },
                {
                    "name": "LA SALINA LAS MONAS ",
                    "value": "N00250084",
                    "subTipo": null
                },
                {
                    "name": "LABRADOR E&P LLANOS 23 ",
                    "value": "N23161995",
                    "subTipo": null
                },
                {
                    "name": "LAS ACACIAS CAMPO RICO ",
                    "value": "N21381576",
                    "subTipo": null
                },
                {
                    "name": "LAS ACACIAS CAMPO RICO PESADO",
                    "value": "P21381576",
                    "subTipo": null
                },
                {
                    "name": "LAS MARACAS E&P LOS OCARROS ",
                    "value": "N22711795",
                    "subTipo": null
                },
                {
                    "name": "LAS MARACAS E&P LOS OCARROS PAREX ",
                    "value": "N23131795",
                    "subTipo": null
                },
                {
                    "name": "LEONA B LEONA ",
                    "value": "N21871342",
                    "subTipo": null
                },
                {
                    "name": "LEONA B NORTE LEONA ",
                    "value": "N21872018",
                    "subTipo": null
                },
                {
                    "name": "LEONA B SUR LEONA ",
                    "value": "N21871612",
                    "subTipo": null
                },
                {
                    "name": "LEONA C LEONA ",
                    "value": "N21871964",
                    "subTipo": null
                },
                {
                    "name": "LIBERTAD APIAY ",
                    "value": "N00010448",
                    "subTipo": null
                },
                {
                    "name": "LIBERTAD NORTE APIAY ",
                    "value": "N00010201",
                    "subTipo": null
                },
                {
                    "name": "LIBERTAD NORTE APIAY PESADO",
                    "value": "P00010201",
                    "subTipo": null
                },
                {
                    "name": "LIBERTAD NORTE LIBERTAD-REFORMA INCREMENTAL INCREMENTAL",
                    "value": "I21490201",
                    "subTipo": null
                },
                {
                    "name": "LIEBRE EL PIÑAL ",
                    "value": "N01010272",
                    "subTipo": null
                },
                {
                    "name": "LILIA OPON ",
                    "value": "N00820242",
                    "subTipo": null
                },
                {
                    "name": "LINDA SANTANA ",
                    "value": "N00620182",
                    "subTipo": null
                },
                {
                    "name": "LISA GUASIMO ",
                    "value": "N22181461",
                    "subTipo": null
                },
                {
                    "name": "LISAMA DE MARES ",
                    "value": "N00150053",
                    "subTipo": null
                },
                {
                    "name": "LISAMA DE MARES PENALIZADO",
                    "value": "Q00150053",
                    "subTipo": null
                },
                {
                    "name": "LISAMA PROFUNDO DE MARES ",
                    "value": "N00151227",
                    "subTipo": null
                },
                {
                    "name": "LLANITO DE MARES ",
                    "value": "N00150054",
                    "subTipo": null
                },
                {
                    "name": "LLANOS 58 E&P  ",
                    "value": "N23262012",
                    "subTipo": null
                },
                {
                    "name": "LOMA LARGA ALTO MAGDALENA ",
                    "value": "N14620644",
                    "subTipo": null
                },
                {
                    "name": "LOMA LARGA ALTO MAGDALENA PENALIZADO",
                    "value": "Q14620644",
                    "subTipo": null
                },
                {
                    "name": "LORO ORITO ",
                    "value": "N00280055",
                    "subTipo": null
                },
                {
                    "name": "LOS ACEITES GUACHIRIA ",
                    "value": "N21691439",
                    "subTipo": null
                },
                {
                    "name": "LOS ANGELES Tisquirama  B ",
                    "value": "N01370056",
                    "subTipo": null
                },
                {
                    "name": "LOS HATOS ALCARAVAN ",
                    "value": "N01051187",
                    "subTipo": null
                },
                {
                    "name": "LOS POTROS CAMPO RICO ",
                    "value": "N21381560",
                    "subTipo": null
                },
                {
                    "name": "LOS TOROS ESTERO ",
                    "value": "N00670188",
                    "subTipo": null
                },
                {
                    "name": "LUIS ANTONIO NOSSA NIÑO",
                    "value": "01033-15",
                    "subTipo": null
                },
                {
                    "name": "MACAPAY CORCEL ",
                    "value": "N21811714",
                    "subTipo": null
                },
                {
                    "name": "MACAPAY CORCEL PESADO",
                    "value": "P21811714",
                    "subTipo": null
                },
                {
                    "name": "MALAWI E&P Llanos 16 Contrato # 45 ",
                    "value": "N22421898",
                    "subTipo": null
                },
                {
                    "name": "MAMBO CORCEL ",
                    "value": "N21811951",
                    "subTipo": null
                },
                {
                    "name": "MAMEY E&P SAMAN ",
                    "value": "N23101945",
                    "subTipo": null
                },
                {
                    "name": "MAMEY E&P SAMAN PENALIZADO",
                    "value": "Q23101945",
                    "subTipo": null
                },
                {
                    "name": "MANA  ",
                    "value": "N21481103",
                    "subTipo": null
                },
                {
                    "name": "MANATUS PUNTERO ",
                    "value": "N22911842",
                    "subTipo": null
                },
                {
                    "name": "MANATUS PUNTERO PESADO",
                    "value": "P22911842",
                    "subTipo": null
                },
                {
                    "name": "MANI E&P LLANOS 27  ",
                    "value": "N22991870",
                    "subTipo": null
                },
                {
                    "name": "MANICEÑO E&P LLANOS 32 ",
                    "value": "N23001874",
                    "subTipo": null
                },
                {
                    "name": "MANSOYA ORITO ",
                    "value": "N00280165",
                    "subTipo": null
                },
                {
                    "name": "MANTIS CASIMENA ",
                    "value": "N22271642",
                    "subTipo": null
                },
                {
                    "name": "MANTIS CASIMENA PESADO",
                    "value": "P22271642",
                    "subTipo": null
                },
                {
                    "name": "MAPACHE  ",
                    "value": "N22091418",
                    "subTipo": null
                },
                {
                    "name": "MARY SANTANA ",
                    "value": "N00620219",
                    "subTipo": null
                },
                {
                    "name": "MATACHIN NORTE ESPINAL ",
                    "value": "N00800268",
                    "subTipo": null
                },
                {
                    "name": "MATACHIN SUR ESPINAL ",
                    "value": "N00800478",
                    "subTipo": null
                },
                {
                    "name": "MATANEGRA OESTE CHIPIRON ",
                    "value": "N11290125",
                    "subTipo": null
                },
                {
                    "name": "MATEGUAFA TAPIR ",
                    "value": "N01120299",
                    "subTipo": null
                },
                {
                    "name": "MATEMARRANO CRAVOVIEJO ",
                    "value": "N21751292",
                    "subTipo": null
                },
                {
                    "name": "MAURITIA ESTE E & P MORICHE PESADO",
                    "value": "P21801604",
                    "subTipo": null
                },
                {
                    "name": "MAURITIA NORTE E & P MORICHE PESADO",
                    "value": "P21801285",
                    "subTipo": null
                },
                {
                    "name": "MAX E&P LLANOS 34 PESADO",
                    "value": "P23091933",
                    "subTipo": null
                },
                {
                    "name": "MAYA CORCEL ",
                    "value": "N21811966",
                    "subTipo": null
                },
                {
                    "name": "MEDINA CONDOR ",
                    "value": "N21831293",
                    "subTipo": null
                },
                {
                    "name": "MELERO GARIBAY ",
                    "value": "N22391749",
                    "subTipo": null
                },
                {
                    "name": "MERLIN CPO-17 PESADO",
                    "value": "P22881923",
                    "subTipo": null
                },
                {
                    "name": "MINAS PAZ DEL RIO",
                    "value": "15065",
                    "subTipo": null
                },
                {
                    "name": "MIRAFLOR SANTANA ",
                    "value": "N00620260",
                    "subTipo": null
                },
                {
                    "name": "MIRTO  E&P ",
                    "value": "N22191463",
                    "subTipo": null
                },
                {
                    "name": "MITO CAÑO SUR E&P PESADO",
                    "value": "P22571695",
                    "subTipo": null
                },
                {
                    "name": "MIZAR ALTAIR ",
                    "value": "N22311906",
                    "subTipo": null
                },
                {
                    "name": "MOCHELO RIO ARIARI PESADO",
                    "value": "P22211639",
                    "subTipo": null
                },
                {
                    "name": "MONO ARAÑA Valle Medio del Magdalena ",
                    "value": "N23151983",
                    "subTipo": null
                },
                {
                    "name": "MOQUETA CHAZA ",
                    "value": "N21761574",
                    "subTipo": null
                },
                {
                    "name": "MORICHAL CASANARE ",
                    "value": "N00080059",
                    "subTipo": null
                },
                {
                    "name": "MORICHAL CASANARE PENALIZADO",
                    "value": "Q00080059",
                    "subTipo": null
                },
                {
                    "name": "MORICHE NARE ASOCIACION PESADO",
                    "value": "P00260156",
                    "subTipo": null
                },
                {
                    "name": "MORROCOY COSECHA ",
                    "value": "N21791347",
                    "subTipo": null
                },
                {
                    "name": "NANCY CDND/I , BURDINE, MAXINE ",
                    "value": "N21770060",
                    "subTipo": null
                },
                {
                    "name": "NARE  ASOCIACION ",
                    "value": "N00260061",
                    "subTipo": null
                },
                {
                    "name": "NASHIRA NORTE NASHIRA ",
                    "value": "N21991361",
                    "subTipo": null
                },
                {
                    "name": "NELSON ESPERANZA ",
                    "value": "N21591728",
                    "subTipo": null
                },
                {
                    "name": "NORCARBON",
                    "value": "031-92",
                    "subTipo": null
                },
                {
                    "name": "NORCARBON",
                    "value": "GCMM-01",
                    "subTipo": null
                },
                {
                    "name": "NUNDA E&E CUISINDE ",
                    "value": "N21971755",
                    "subTipo": null
                },
                {
                    "name": "NUTRIA DE MARES ",
                    "value": "N00150062",
                    "subTipo": null
                },
                {
                    "name": "OCELOTE E&E GUARROJO ",
                    "value": "N22011367",
                    "subTipo": null
                },
                {
                    "name": "ONCA PUNTERO ",
                    "value": "N22912020",
                    "subTipo": null
                },
                {
                    "name": "OPALO QUIFA PESADO",
                    "value": "P22001736",
                    "subTipo": null
                },
                {
                    "name": "OPON  ",
                    "value": "N00820278",
                    "subTipo": null
                },
                {
                    "name": "ORITO  ",
                    "value": "N00280258",
                    "subTipo": null
                },
                {
                    "name": "ORITO  Incremental INCREMENTAL",
                    "value": "I21340258",
                    "subTipo": null
                },
                {
                    "name": "OROPENDOLA  PERENCO ",
                    "value": "N22691443",
                    "subTipo": null
                },
                {
                    "name": "OROPENDOLA  PERENCO INCREMENTAL",
                    "value": "I22691443",
                    "subTipo": null
                },
                {
                    "name": "ORTEGA  ",
                    "value": "N00290065",
                    "subTipo": null
                },
                {
                    "name": "ORTEGA CPI  INCREMENTAL",
                    "value": "I21470065",
                    "subTipo": null
                },
                {
                    "name": "OTROS",
                    "value": "OTROS",
                    "subTipo": null
                },
                {
                    "name": "PACANDE CPI ORTEGA INCREMENTAL",
                    "value": "I21470151",
                    "subTipo": null
                },
                {
                    "name": "PACANDE ORTEGA ",
                    "value": "N00290151",
                    "subTipo": null
                },
                {
                    "name": "PALAGUA  ",
                    "value": "N00300068",
                    "subTipo": null
                },
                {
                    "name": "PALAGUA -INCREMENTAL INCREMENTAL",
                    "value": "I21290068",
                    "subTipo": null
                },
                {
                    "name": "PALERMO  ",
                    "value": "N00310086",
                    "subTipo": null
                },
                {
                    "name": "PALERMO  ECOPETROL ",
                    "value": "N23020086",
                    "subTipo": null
                },
                {
                    "name": "PALMARITO GARCERO ",
                    "value": "N00680189",
                    "subTipo": null
                },
                {
                    "name": "PALMERO TIPLE ",
                    "value": "N22381885",
                    "subTipo": null
                },
                {
                    "name": "PALOGRANDE ALTO MAGDALENA ",
                    "value": "N14620069",
                    "subTipo": null
                },
                {
                    "name": "PARAVARE GARCERO ",
                    "value": "N00680195",
                    "subTipo": null
                },
                {
                    "name": "PASTINACA CPO-10 PESADO",
                    "value": "P23212001",
                    "subTipo": null
                },
                {
                    "name": "PASTORA CHIPIRON ",
                    "value": "N11290631",
                    "subTipo": null
                },
                {
                    "name": "PAUTO SUR PIEDEMONTE EQUION ",
                    "value": "N22470302",
                    "subTipo": null
                },
                {
                    "name": "PAUTO SUR PIEDEMONTE EQUION PENALIZADO",
                    "value": "Q22470302",
                    "subTipo": null
                },
                {
                    "name": "PAUTO SUR RECETOR RECETOR EQUION ",
                    "value": "N22501298",
                    "subTipo": null
                },
                {
                    "name": "PAUTO SUR RECETOR RECETOR EQUION PENALIZADO",
                    "value": "Q22501298",
                    "subTipo": null
                },
                {
                    "name": "PAVAS  CACHIRA ",
                    "value": "N00320070",
                    "subTipo": null
                },
                {
                    "name": "PAYOA LAS MONAS ",
                    "value": "N00250071",
                    "subTipo": null
                },
                {
                    "name": "PAYOA WEST LAS MONAS ",
                    "value": "N00251245",
                    "subTipo": null
                },
                {
                    "name": "PAZ DEL RIO",
                    "value": "006-85M",
                    "subTipo": null
                },
                {
                    "name": "PAZ DEL RIO",
                    "value": "070-89",
                    "subTipo": null
                },
                {
                    "name": "PEGUITA CARACARA ",
                    "value": "N16320635",
                    "subTipo": null
                },
                {
                    "name": "PEGUITA II CARACARA ",
                    "value": "N16321132",
                    "subTipo": null
                },
                {
                    "name": "PEGUITA III CARACARA ",
                    "value": "N16321140",
                    "subTipo": null
                },
                {
                    "name": "PEÑAS BLANCAS CASABE ",
                    "value": "N00070072",
                    "subTipo": null
                },
                {
                    "name": "PEÑAS BLANCAS CASABE INCREMENTAL INCREMENTAL",
                    "value": "I21660072",
                    "subTipo": null
                },
                {
                    "name": "PENDARE CPO-13 PESADO",
                    "value": "P23081919",
                    "subTipo": null
                },
                {
                    "name": "PEROLES DE MARES ",
                    "value": "N00150073",
                    "subTipo": null
                },
                {
                    "name": "PETIRROJO E&E CUBIRO ",
                    "value": "N21731740",
                    "subTipo": null
                },
                {
                    "name": "PETIRROJO SUR E&E CUBIRO ",
                    "value": "N21731988",
                    "subTipo": null
                },
                {
                    "name": "PETROLEA BARCO ",
                    "value": "N00030074",
                    "subTipo": null
                },
                {
                    "name": "PIJAO ALTO MAGDALENA ",
                    "value": "N14620075",
                    "subTipo": null
                },
                {
                    "name": "PIMIENTO FORTUNA ",
                    "value": "N21651956",
                    "subTipo": null
                },
                {
                    "name": "PINTADO E&E GUARROJO ",
                    "value": "N22011814",
                    "subTipo": null
                },
                {
                    "name": "PIRITO GARCERO ",
                    "value": "N00680293",
                    "subTipo": null
                },
                {
                    "name": "PISINGO CASIMENA ",
                    "value": "N22271782",
                    "subTipo": null
                },
                {
                    "name": "PLATANILLO  ",
                    "value": "N21850207",
                    "subTipo": null
                },
                {
                    "name": "POMPEYA APIAY ",
                    "value": "N00010149",
                    "subTipo": null
                },
                {
                    "name": "POMPEYA APIAY Incremental INCREMENTAL",
                    "value": "I21320149",
                    "subTipo": null
                },
                {
                    "name": "PRIMAVERA GUACHIRIA ",
                    "value": "N21691441",
                    "subTipo": null
                },
                {
                    "name": "PRODECO",
                    "value": "044-89",
                    "subTipo": null
                },
                {
                    "name": "PRODUCTOS QUIMICOS PANAMERICANOS S A",
                    "value": "18868",
                    "subTipo": null
                },
                {
                    "name": "PRODUCTOS QUIMICOS PANAMERICANOS S A",
                    "value": "19914",
                    "subTipo": null
                },
                {
                    "name": "PROVINCIA  ",
                    "value": "N00740226",
                    "subTipo": null
                },
                {
                    "name": "PROVINCIA  PENALIZADO",
                    "value": "Q00740226",
                    "subTipo": null
                },
                {
                    "name": "PUERTO GAITAN CPO-6 ",
                    "value": "N22761806",
                    "subTipo": null
                },
                {
                    "name": "PULI  109 ",
                    "value": "N21400215",
                    "subTipo": null
                },
                {
                    "name": "PURIFICACION ESPINAL ",
                    "value": "N00800237",
                    "subTipo": null
                },
                {
                    "name": "QUEBRADA ROJA  ",
                    "value": "N21601169",
                    "subTipo": null
                },
                {
                    "name": "QUERUBIN Tisquirama  B PESADO",
                    "value": "P01371568",
                    "subTipo": null
                },
                {
                    "name": "QUIFA  ",
                    "value": "N22001363",
                    "subTipo": null
                },
                {
                    "name": "QUILILI ORITO ",
                    "value": "N00280080",
                    "subTipo": null
                },
                {
                    "name": "QUILLACINGA CPI SUR ORIENTE ",
                    "value": "N21460212",
                    "subTipo": null
                },
                {
                    "name": "QUIMBAYA ORTEGA ",
                    "value": "N00290146",
                    "subTipo": null
                },
                {
                    "name": "QUIRIYANA Convenio Exploracion Area Occidental ",
                    "value": "N22151445",
                    "subTipo": null
                },
                {
                    "name": "RAMIRIQUI E&P LLANOS 22 ",
                    "value": "N22901840",
                    "subTipo": null
                },
                {
                    "name": "RANCHO HERMOSO  SPR ",
                    "value": "N21260203",
                    "subTipo": null
                },
                {
                    "name": "RANCHO HERMOSO  SPR-CANACOL ",
                    "value": "N22960203",
                    "subTipo": null
                },
                {
                    "name": "RANCHO HERMOSO 4 RANCHO HERMOSO ACUERDO PART CASANARE ",
                    "value": "N12821484",
                    "subTipo": null
                },
                {
                    "name": "RANCHO HERMOSO 4 RANCHO HERMOSO ACUERDO PART CASANARE-CANACOL ",
                    "value": "N22951484",
                    "subTipo": null
                },
                {
                    "name": "RANCHO HERMOSO 4 RANCHO HERMOSO ACUERDO PART CASANARE-CANACOL PESADO",
                    "value": "P22951484",
                    "subTipo": null
                },
                {
                    "name": "RANCHO QUEMADO CARACARA ",
                    "value": "N16321240",
                    "subTipo": null
                },
                {
                    "name": "REDONDO CRAVO NORTE ",
                    "value": "N00120126",
                    "subTipo": null
                },
                {
                    "name": "REDONDO ESTE CRAVO NORTE ",
                    "value": "N00120295",
                    "subTipo": null
                },
                {
                    "name": "REMACHE NORTE COROCORA ",
                    "value": "N00901159",
                    "subTipo": null
                },
                {
                    "name": "REMACHE SUR COROCORA ",
                    "value": "N00900395",
                    "subTipo": null
                },
                {
                    "name": "RIO CEIBAS CAGUAN ECOPETROL ",
                    "value": "N22750114",
                    "subTipo": null
                },
                {
                    "name": "RIO CEIBAS CAGUAN ECOPETROL PENALIZADO",
                    "value": "Q22750114",
                    "subTipo": null
                },
                {
                    "name": "RIO OPIA  ",
                    "value": "N21370522",
                    "subTipo": null
                },
                {
                    "name": "RIO SALDAÑA TOLIMA - B ",
                    "value": "N00700115",
                    "subTipo": null
                },
                {
                    "name": "RIO ZULIA ZULIA ",
                    "value": "N00450134",
                    "subTipo": null
                },
                {
                    "name": "RIOHACHA 2 GUAJIRA ",
                    "value": "N00221998",
                    "subTipo": null
                },
                {
                    "name": "RIOHACHA GUAJIRA ",
                    "value": "N00220083",
                    "subTipo": null
                },
                {
                    "name": "RODRIGUEZ FORERO RAFAEL ALBERTO",
                    "value": "18557",
                    "subTipo": null
                },
                {
                    "name": "RUBIALES  ",
                    "value": "N00510128",
                    "subTipo": null
                },
                {
                    "name": "RUBIALES PIRIRI ",
                    "value": "N00490128",
                    "subTipo": null
                },
                {
                    "name": "RUIZ RINCON JOSE DAGOBERTO",
                    "value": "NGA-08581",
                    "subTipo": null
                },
                {
                    "name": "RUMBERO PLAYON INCREMENTAL",
                    "value": "I22681764",
                    "subTipo": null
                },
                {
                    "name": "SABANERO E&P  PESADO",
                    "value": "P22411608",
                    "subTipo": null
                },
                {
                    "name": "SAIMIRI CRAVOVIEJO ",
                    "value": "N21751891",
                    "subTipo": null
                },
                {
                    "name": "SALCOL S.A.",
                    "value": "UPIN",
                    "subTipo": null
                },
                {
                    "name": "SALCOL S.A.",
                    "value": "UPIN - HIQL-01",
                    "subTipo": null
                },
                {
                    "name": "SALINAS DE GALERAS",
                    "value": "HIQO-02",
                    "subTipo": null
                },
                {
                    "name": "SAN ANTONIO ORITO ",
                    "value": "N00280085",
                    "subTipo": null
                },
                {
                    "name": "SAN FRANCISCO PALERMO ",
                    "value": "N00310130",
                    "subTipo": null
                },
                {
                    "name": "SAN FRANCISCO PALERMO ECOPETROL ",
                    "value": "N23020130",
                    "subTipo": null
                },
                {
                    "name": "SAN FRANCISCO PALERMO ECOPETROL PENALIZADO",
                    "value": "Q23020130",
                    "subTipo": null
                },
                {
                    "name": "SAN LUIS DE MARES ",
                    "value": "N00150087",
                    "subTipo": null
                },
                {
                    "name": "SAN ROQUE TISQUIRAMA-C ",
                    "value": "N00390287",
                    "subTipo": null
                },
                {
                    "name": "SAN ROQUE TISQUIRAMA-C INCREMENTAL INCREMENTAL",
                    "value": "I22560287",
                    "subTipo": null
                },
                {
                    "name": "SAN SILVESTRE DE MARES ",
                    "value": "N00150089",
                    "subTipo": null
                },
                {
                    "name": "SANTA CLARA ALTO MAGDALENA ",
                    "value": "N14620105",
                    "subTipo": null
                },
                {
                    "name": "SANTA CLARA ALTO MAGDALENA Incremental INCREMENTAL",
                    "value": "I21330105",
                    "subTipo": null
                },
                {
                    "name": "SANTA LUCIA TISQUIRAMA-A ",
                    "value": "N00380281",
                    "subTipo": null
                },
                {
                    "name": "SANTIAGO UPIA ",
                    "value": "N00420090",
                    "subTipo": null
                },
                {
                    "name": "SANTIAGO UPIA-ECOPETROL ",
                    "value": "N22920090",
                    "subTipo": null
                },
                {
                    "name": "SANTO DOMINGO CDNDI ",
                    "value": "N23071910",
                    "subTipo": null
                },
                {
                    "name": "SANTO DOMINGO CDNDI PESADO",
                    "value": "P23071910",
                    "subTipo": null
                },
                {
                    "name": "SANTO DOMINGO NORTE CDNDI ",
                    "value": "N23071969",
                    "subTipo": null
                },
                {
                    "name": "SARDINAS GARCERO ",
                    "value": "N00680194",
                    "subTipo": null
                },
                {
                    "name": "SARDINATA BARCO ",
                    "value": "N00030276",
                    "subTipo": null
                },
                {
                    "name": "SAURIO APIAY ",
                    "value": "N00010204",
                    "subTipo": null
                },
                {
                    "name": "SAURIO APIAY PESADO",
                    "value": "P00010204",
                    "subTipo": null
                },
                {
                    "name": "SERAFIN Tisquirama  B ",
                    "value": "N01371651",
                    "subTipo": null
                },
                {
                    "name": "SIBUNDOY ORITO ",
                    "value": "N00280174",
                    "subTipo": null
                },
                {
                    "name": "SILFIDE FORTUNA ",
                    "value": "N21651200",
                    "subTipo": null
                },
                {
                    "name": "SIRENAS GARCERO ",
                    "value": "N00680267",
                    "subTipo": null
                },
                {
                    "name": "SOLOPIÑA SURIMENA ",
                    "value": "N22981866",
                    "subTipo": null
                },
                {
                    "name": "SUCIO ORITO ",
                    "value": "N00280094",
                    "subTipo": null
                },
                {
                    "name": "SUCUMBIOS ORITO ",
                    "value": "N00280133",
                    "subTipo": null
                },
                {
                    "name": "SULAWESI E&P Llanos 16 Contrato # 45 ",
                    "value": "N22421767",
                    "subTipo": null
                },
                {
                    "name": "SURIA APIAY ",
                    "value": "N00010097",
                    "subTipo": null
                },
                {
                    "name": "SURIA APIAY Incremental INCREMENTAL",
                    "value": "I21320097",
                    "subTipo": null
                },
                {
                    "name": "SURIA APIAY PESADO",
                    "value": "P00010097",
                    "subTipo": null
                },
                {
                    "name": "SURIA SUR APIAY ",
                    "value": "N00010148",
                    "subTipo": null
                },
                {
                    "name": "SURIA SUR APIAY Incremental INCREMENTAL",
                    "value": "I21320148",
                    "subTipo": null
                },
                {
                    "name": "SURIA SUR APIAY PESADO",
                    "value": "P00010148",
                    "subTipo": null
                },
                {
                    "name": "TELLO  ",
                    "value": "N00360098",
                    "subTipo": null
                },
                {
                    "name": "TELLO  ECP-ANH INCREMENTAL INCREMENTAL",
                    "value": "I21620098",
                    "subTipo": null
                },
                {
                    "name": "TELLO  ECP-ANH INCREMENTAL PENALIZADO",
                    "value": "Q21620098",
                    "subTipo": null
                },
                {
                    "name": "TEMPRANILLO ALTO MAGDALENA ",
                    "value": "N14621427",
                    "subTipo": null
                },
                {
                    "name": "TEMPRANILLO NORTE ALTO MAGDALENA ",
                    "value": "N14621536",
                    "subTipo": null
                },
                {
                    "name": "TENAX ALTO MAGDALENA ",
                    "value": "N14621320",
                    "subTipo": null
                },
                {
                    "name": "TENAY 11 ALTO MAGDALENA ",
                    "value": "N14621704",
                    "subTipo": null
                },
                {
                    "name": "TENAY ALTO MAGDALENA ",
                    "value": "N14620100",
                    "subTipo": null
                },
                {
                    "name": "TENAY ALTO MAGDALENA Incremental INCREMENTAL",
                    "value": "I21330100",
                    "subTipo": null
                },
                {
                    "name": "TERECAY COSECHA ",
                    "value": "N21791268",
                    "subTipo": null
                },
                {
                    "name": "TESORO DE MARES ",
                    "value": "N00150102",
                    "subTipo": null
                },
                {
                    "name": "TIBU BARCO ",
                    "value": "N00030103",
                    "subTipo": null
                },
                {
                    "name": "TIBU BARCO INCREMENTAL INCREMENTAL",
                    "value": "I21920103",
                    "subTipo": null
                },
                {
                    "name": "TIJERETO E&E CUBIRO ",
                    "value": "N21731889",
                    "subTipo": null
                },
                {
                    "name": "TILODIRAN CEE RIO VERDE ",
                    "value": "N21501105",
                    "subTipo": null
                },
                {
                    "name": "TILODIRAN CEE RIO VERDE PESADO",
                    "value": "P21501105",
                    "subTipo": null
                },
                {
                    "name": "TISQUIRAMA -C ",
                    "value": "N00390154",
                    "subTipo": null
                },
                {
                    "name": "TISQUIRAMA ESTE TISQUIRAMA-C ",
                    "value": "N00391835",
                    "subTipo": null
                },
                {
                    "name": "TISQUIRAMA ESTE TISQUIRAMA-C PESADO",
                    "value": "P00391835",
                    "subTipo": null
                },
                {
                    "name": "TOCA  ",
                    "value": "N21611172",
                    "subTipo": null
                },
                {
                    "name": "TOCARIA CASANARE ",
                    "value": "N00080106",
                    "subTipo": null
                },
                {
                    "name": "TOCARIA CASANARE PENALIZADO",
                    "value": "Q00080106",
                    "subTipo": null
                },
                {
                    "name": "TOLDADO ORTEGA ",
                    "value": "N00290107",
                    "subTipo": null
                },
                {
                    "name": "TONINA CRAVO NORTE ",
                    "value": "N00120304",
                    "subTipo": null
                },
                {
                    "name": "TOPOYACO E&P  PESADO",
                    "value": "P22891838",
                    "subTipo": null
                },
                {
                    "name": "TOQUI-TOQUI PULI ",
                    "value": "N00500147",
                    "subTipo": null
                },
                {
                    "name": "TORCAZ BOCACHICO ",
                    "value": "N01160307",
                    "subTipo": null
                },
                {
                    "name": "TORMENTO E&P LLANOS 19 INCREMENTAL",
                    "value": "I23051901",
                    "subTipo": null
                },
                {
                    "name": "TORO SENTADO CARACARA ",
                    "value": "N16321353",
                    "subTipo": null
                },
                {
                    "name": "TORO SENTADO NORTE CARACARA ",
                    "value": "N16321413",
                    "subTipo": null
                },
                {
                    "name": "TORO SENTADO WEST CARACARA ",
                    "value": "N16321479",
                    "subTipo": null
                },
                {
                    "name": "TOROYACO SANTANA ",
                    "value": "N00620183",
                    "subTipo": null
                },
                {
                    "name": "TOTARE ARMERO ",
                    "value": "N00530158",
                    "subTipo": null
                },
                {
                    "name": "TOTUMAL FORTUNA ",
                    "value": "N21650108",
                    "subTipo": null
                },
                {
                    "name": "TOY ORTEGA ",
                    "value": "N00290109",
                    "subTipo": null
                },
                {
                    "name": "TRASGO CAÑO SUR E&P PESADO",
                    "value": "P22571751",
                    "subTipo": null
                },
                {
                    "name": "TRINIDAD YALEA ",
                    "value": "N00430110",
                    "subTipo": null
                },
                {
                    "name": "TROMPILLOS UPIA ",
                    "value": "N00420220",
                    "subTipo": null
                },
                {
                    "name": "TROMPILLOS UPIA-ECOPETROL ",
                    "value": "N22920220",
                    "subTipo": null
                },
                {
                    "name": "TRONOS Tisquirama  B ",
                    "value": "N01371852",
                    "subTipo": null
                },
                {
                    "name": "TUA E&P LLANOS 34 ",
                    "value": "N23091937",
                    "subTipo": null
                },
                {
                    "name": "TUA E&P LLANOS 34 PESADO",
                    "value": "P23091937",
                    "subTipo": null
                },
                {
                    "name": "TUCUSO MAPACHE ",
                    "value": "N22091828",
                    "subTipo": null
                },
                {
                    "name": "TUCUSO MAPACHE PESADO",
                    "value": "P22091828",
                    "subTipo": null
                },
                {
                    "name": "TULIPAN GUACHIRIA SUR PESADO",
                    "value": "P22351562",
                    "subTipo": null
                },
                {
                    "name": "UNDERRIVER NARE ASOCIACION PESADO",
                    "value": "P00260275",
                    "subTipo": null
                },
                {
                    "name": "VALDIVIA  ",
                    "value": "N01130300",
                    "subTipo": null
                },
                {
                    "name": "VALDIVIA  ECOPETROL ",
                    "value": "N23180300",
                    "subTipo": null
                },
                {
                    "name": "VARICHEM DE COLOMBIA LTDA",
                    "value": "1259-15",
                    "subTipo": null
                },
                {
                    "name": "VARIOS",
                    "value": "GRAVA DE RIO",
                    "subTipo": null
                },
                {
                    "name": "VENTILADOR ABANICO ",
                    "value": "N01111273",
                    "subTipo": null
                },
                {
                    "name": "VENUS CPO-11 ",
                    "value": "N23252010",
                    "subTipo": null
                },
                {
                    "name": "VIGIA CAMPO RICO ",
                    "value": "N21381121",
                    "subTipo": null
                },
                {
                    "name": "VIGIA SUR CAMPO RICO ",
                    "value": "N21381991",
                    "subTipo": null
                },
                {
                    "name": "VIGIA SUR CAMPO RICO PESADO",
                    "value": "P21381991",
                    "subTipo": null
                },
                {
                    "name": "VIREO OROPENDOLA PERENCO ",
                    "value": "N22691457",
                    "subTipo": null
                },
                {
                    "name": "VIREO OROPENDOLA PERENCO INCREMENTAL",
                    "value": "I22691457",
                    "subTipo": null
                },
                {
                    "name": "VIVIANA E&P LLANOS 30 ",
                    "value": "N23282022",
                    "subTipo": null
                },
                {
                    "name": "YAGUARA HOBO ECOPETROL ",
                    "value": "N22740168",
                    "subTipo": null
                },
                {
                    "name": "YAGUARA HOBO ECOPETROL PENALIZADO",
                    "value": "Q22740168",
                    "subTipo": null
                },
                {
                    "name": "Yamu  ",
                    "value": "N21551496",
                    "subTipo": null
                },
                {
                    "name": "Yarigui-Cantagallo  ",
                    "value": "N00051308",
                    "subTipo": null
                },
                {
                    "name": "Yarigui-Cantagallo  INCREMENTAL INCREMENTAL",
                    "value": "I22201308",
                    "subTipo": null
                },
                {
                    "name": "Yarigui-Cantagallo  INCREMENTAL PENALIZADO",
                    "value": "Q22201308",
                    "subTipo": null
                },
                {
                    "name": "Yarigui-Cantagallo  PENALIZADO",
                    "value": "Q00051308",
                    "subTipo": null
                },
                {
                    "name": "YATAY GUATIQUIA ",
                    "value": "N22221635",
                    "subTipo": null
                },
                {
                    "name": "YATAY GUATIQUIA PENALIZADO",
                    "value": "Q22221635",
                    "subTipo": null
                },
                {
                    "name": "YENAC CASIMENA ",
                    "value": "N22271540",
                    "subTipo": null
                },
                {
                    "name": "YENAC CASIMENA PESADO",
                    "value": "P22271540",
                    "subTipo": null
                },
                {
                    "name": "YESOS PRADA",
                    "value": "063-94M",
                    "subTipo": null
                },
                {
                    "name": "YESOS PRADA",
                    "value": "2491",
                    "subTipo": null
                },
                {
                    "name": "YESOS PRADA",
                    "value": "2492",
                    "subTipo": null
                },
                {
                    "name": "YESOS PRADA",
                    "value": "2833",
                    "subTipo": null
                },
                {
                    "name": "YOPO E&E CUBIRO ",
                    "value": "N21731804",
                    "subTipo": null
                },
                {
                    "name": "YURILLA ORITO ",
                    "value": "N00280172",
                    "subTipo": null
                },
                {
                    "name": "ZOE E&P MIDAS ",
                    "value": "N22241597",
                    "subTipo": null
                },
                {
                    "name": "ZOPILOTE CRAVOVIEJO ",
                    "value": "N21751653",
                    "subTipo": null
                },
                {
                    "name": "ZOPILOTE CRAVOVIEJO PESADO",
                    "value": "P21751653",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Periodos",
            "parameter": "periodosProduccion",
            "esMultiple": true,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Produccion",
            "items": [
                {
                    "name": "2012",
                    "value": "2012",
                    "subTipo": null
                },
                {
                    "name": "2013",
                    "value": "2013",
                    "subTipo": null
                },
                {
                    "name": "2014",
                    "value": "2014",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Recurso natural no renovable",
            "parameter": "recursoNaturalFiscalizacion",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Fiscalizacion",
            "items": [
                {
                    "name": "AFINES",
                    "value": "72",
                    "subTipo": "M"
                },
                {
                    "name": "AGREGADO",
                    "value": "196",
                    "subTipo": "M"
                },
                {
                    "name": "AGREGADO PETREOS",
                    "value": "39",
                    "subTipo": "M"
                },
                {
                    "name": "AGREGADOS PARA CONSTRUCCION",
                    "value": "50",
                    "subTipo": "M"
                },
                {
                    "name": "AGREGADOS PARA CONSTRUCCION_",
                    "value": "153211",
                    "subTipo": "M"
                },
                {
                    "name": "AGREGADOS PETREOS",
                    "value": "15321",
                    "subTipo": "M"
                },
                {
                    "name": "ALUMINA",
                    "value": "85",
                    "subTipo": "M"
                },
                {
                    "name": "ALUMINIO",
                    "value": "215",
                    "subTipo": "M"
                },
                {
                    "name": "ANHIDRITA",
                    "value": "83",
                    "subTipo": "M"
                },
                {
                    "name": "ANTIMONIO",
                    "value": "231",
                    "subTipo": "M"
                },
                {
                    "name": "ANTRACITAS",
                    "value": "11011",
                    "subTipo": "M"
                },
                {
                    "name": "ANTRACITICO",
                    "value": "209",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLA",
                    "value": "183",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLA BENTONITICA",
                    "value": "131",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLA CAOLINITICA",
                    "value": "113",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLA CERAMICA",
                    "value": "227",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLA COMUN (CERAMICAS, FERRUGINOSAS, MISCELANEAS)",
                    "value": "154005",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLA FERRUGINOSA",
                    "value": "12",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLA PIZARROSA",
                    "value": "108",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLA ROSA",
                    "value": "152",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLAS (EXCEPTO ARCILLAS DILATADAS)",
                    "value": "15400",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLAS ESPECIALES",
                    "value": "154007",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLAS MICELANEAS",
                    "value": "124",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLAS REFRACTARIAS",
                    "value": "154006",
                    "subTipo": "M"
                },
                {
                    "name": "ARCILLOLITAS",
                    "value": "86",
                    "subTipo": "M"
                },
                {
                    "name": "ARENA",
                    "value": "225",
                    "subTipo": "M"
                },
                {
                    "name": "ARENA CUARCIFERA",
                    "value": "166",
                    "subTipo": "M"
                },
                {
                    "name": "ARENA DE PE?A",
                    "value": "38",
                    "subTipo": "M"
                },
                {
                    "name": "ARENA DE PEÑA",
                    "value": "153124",
                    "subTipo": "M"
                },
                {
                    "name": "ARENA SILICEA",
                    "value": "8",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS ARCILLOSAS",
                    "value": "153111",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS FELDESPATICAS",
                    "value": "153112",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS INDUSTRIALES",
                    "value": "79",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS INDUSTRIALES (MIG)",
                    "value": "153123",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS NEGRAS",
                    "value": "143",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS PUZOLANICAS",
                    "value": "33",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS TITANIFERAS",
                    "value": "2",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS Y GRAVAS NATURALES Y SILICEAS",
                    "value": "1531",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS Y GRAVAS SILICEAS",
                    "value": "153121",
                    "subTipo": "M"
                },
                {
                    "name": "ARENAS Y GRAVAS SILÍCEAS ELABORADAS (TRITURADAS, MOLIDAS O PULVERIZADAS)",
                    "value": "153122",
                    "subTipo": "M"
                },
                {
                    "name": "ARENISCAS",
                    "value": "19",
                    "subTipo": "M"
                },
                {
                    "name": "ARENISCAS (MIG)",
                    "value": "153206",
                    "subTipo": "M"
                },
                {
                    "name": "ARGENTITA",
                    "value": "198",
                    "subTipo": "M"
                },
                {
                    "name": "ASBESTO",
                    "value": "115",
                    "subTipo": "M"
                },
                {
                    "name": "ASBESTO O CRISOTILO",
                    "value": "163941",
                    "subTipo": "M"
                },
                {
                    "name": "ASFALTITA",
                    "value": "95",
                    "subTipo": "M"
                },
                {
                    "name": "ASFALTO",
                    "value": "228",
                    "subTipo": "M"
                },
                {
                    "name": "ASFALTO NATURAL O ASFALTITAS",
                    "value": "153301",
                    "subTipo": "M"
                },
                {
                    "name": "ASOCIADOS",
                    "value": "17",
                    "subTipo": "M"
                },
                {
                    "name": "AZUFRE",
                    "value": "226",
                    "subTipo": "M"
                },
                {
                    "name": "BALASTRO",
                    "value": "46",
                    "subTipo": "M"
                },
                {
                    "name": "BARITA",
                    "value": "89",
                    "subTipo": "M"
                },
                {
                    "name": "BARITA ELABORADA",
                    "value": "161912",
                    "subTipo": "M"
                },
                {
                    "name": "BARITINA",
                    "value": "195",
                    "subTipo": "M"
                },
                {
                    "name": "BASALTOS",
                    "value": "145",
                    "subTipo": "M"
                },
                {
                    "name": "BAUXITA",
                    "value": "167",
                    "subTipo": "M"
                },
                {
                    "name": "BAUXITA (MIG)",
                    "value": "14231",
                    "subTipo": "M"
                },
                {
                    "name": "BENTONITA",
                    "value": "68",
                    "subTipo": "M"
                },
                {
                    "name": "BENTONITA ELABORADA",
                    "value": "154004",
                    "subTipo": "M"
                },
                {
                    "name": "BERILO",
                    "value": "45",
                    "subTipo": "M"
                },
                {
                    "name": "BETUN Y ASFALTO NATURALES; ASFALTITAS Y ROCAS ASFALTICAS",
                    "value": "15330",
                    "subTipo": "M"
                },
                {
                    "name": "BRONCITA",
                    "value": "150",
                    "subTipo": "M"
                },
                {
                    "name": "CALCAREOS",
                    "value": "176",
                    "subTipo": "M"
                },
                {
                    "name": "CALCITA",
                    "value": "111",
                    "subTipo": "M"
                },
                {
                    "name": "CALCITA (MIG)",
                    "value": "16133",
                    "subTipo": "M"
                },
                {
                    "name": "CALIZA",
                    "value": "87",
                    "subTipo": "M"
                },
                {
                    "name": "CALIZA CEMENTERA",
                    "value": "6",
                    "subTipo": "M"
                },
                {
                    "name": "CALIZA DOLOMITICA",
                    "value": "25",
                    "subTipo": "M"
                },
                {
                    "name": "CALIZA MARMORIZADA",
                    "value": "65",
                    "subTipo": "M"
                },
                {
                    "name": "CALIZA METALURGICA",
                    "value": "242",
                    "subTipo": "M"
                },
                {
                    "name": "CALIZA TRITURADA O MOLIDA",
                    "value": "15124",
                    "subTipo": "M"
                },
                {
                    "name": "CANTOS RODADOS",
                    "value": "9",
                    "subTipo": "M"
                },
                {
                    "name": "CAOLIN",
                    "value": "126",
                    "subTipo": "M"
                },
                {
                    "name": "CAOLÍN",
                    "value": "154001",
                    "subTipo": "M"
                },
                {
                    "name": "CARBON",
                    "value": "75",
                    "subTipo": "M"
                },
                {
                    "name": "CARBÓN COQUIZABLE O METALURGICO",
                    "value": "11012",
                    "subTipo": "M"
                },
                {
                    "name": "CARBÓN MINERAL TRITURADO O MOLIDO",
                    "value": "11014",
                    "subTipo": "M"
                },
                {
                    "name": "CARBON TERMICO",
                    "value": "11013",
                    "subTipo": "M"
                },
                {
                    "name": "CARBONATO DE BARIO NATURAL O WHITERITA",
                    "value": "161913",
                    "subTipo": "M"
                },
                {
                    "name": "CARBONATO DE CALCIO",
                    "value": "133",
                    "subTipo": "M"
                },
                {
                    "name": "CENIZA VOLCANICA",
                    "value": "121",
                    "subTipo": "M"
                },
                {
                    "name": "CHERT",
                    "value": "144",
                    "subTipo": "M"
                },
                {
                    "name": "COBALTO",
                    "value": "92",
                    "subTipo": "M"
                },
                {
                    "name": "COBRE",
                    "value": "200",
                    "subTipo": "M"
                },
                {
                    "name": "CONGLOMERADO",
                    "value": "232",
                    "subTipo": "M"
                },
                {
                    "name": "CONGLOMERADO (ROCA O PIEDRA)",
                    "value": "153202",
                    "subTipo": "M"
                },
                {
                    "name": "CONGLOMERADOS, ARENISCAS, CANTOS, GRAVAS, MACADAN; MACADAN ALQUITRANADO; GRAVILLA, LASCA Y POLVOS DE ROCA O PIEDRA, INCLUSO LOS DE LAS PIEDRAS DE LAS CLASES 1512 Y 1513 (EXCEPTO LOS DE LA SUBCLASE 37690), Y DEMAS ROCAS TRITURADAS O NO PARA CONSTRUCCI",
                    "value": "1532",
                    "subTipo": "M"
                },
                {
                    "name": "COQUIZABLE",
                    "value": "194",
                    "subTipo": "M"
                },
                {
                    "name": "CORINDON (MIG)",
                    "value": "163224",
                    "subTipo": "M"
                },
                {
                    "name": "CRETA FOSFORITA",
                    "value": "178",
                    "subTipo": "M"
                },
                {
                    "name": "CROMITA",
                    "value": "26",
                    "subTipo": "M"
                },
                {
                    "name": "CROMO",
                    "value": "114",
                    "subTipo": "M"
                },
                {
                    "name": "CRUDO",
                    "value": "C",
                    "subTipo": "H"
                },
                {
                    "name": "CRUDO / GAS",
                    "value": "C/G",
                    "subTipo": "H"
                },
                {
                    "name": "CUARCITA",
                    "value": "185",
                    "subTipo": "M"
                },
                {
                    "name": "CUARCITICOS",
                    "value": "5",
                    "subTipo": "M"
                },
                {
                    "name": "CUARZO",
                    "value": "161",
                    "subTipo": "M"
                },
                {
                    "name": "CUARZO O SILICE",
                    "value": "163913",
                    "subTipo": "M"
                },
                {
                    "name": "DEMAS_CONCESIBLES",
                    "value": "36",
                    "subTipo": "M"
                },
                {
                    "name": "DIABASA",
                    "value": "128",
                    "subTipo": "M"
                },
                {
                    "name": "DIAMANTES , INCLUSO LOS INDUSTRIALES, SIN LABRAR O SIMPLEMENTE ASERRADOS, HENDIDOS O DESBASTADOS Y OTRAS PIEDRAS PRECIOSAS Y SEMIPRECIOSAS SIN LABRAR O SIMPLEMENTE ASERRADAS O DESBASTADAS; PIEDRA PÓMEZ; ESMERIL; CORINDÓN NATURAL, GRANATE NATURAL Y OT",
                    "value": "1632",
                    "subTipo": "M"
                },
                {
                    "name": "DIATOMITA",
                    "value": "151",
                    "subTipo": "M"
                },
                {
                    "name": "DOLOMITA",
                    "value": "127",
                    "subTipo": "M"
                },
                {
                    "name": "DOLOMITA (CRUDA)",
                    "value": "16132",
                    "subTipo": "M"
                },
                {
                    "name": "DOLOMITA ELABORADA",
                    "value": "16131",
                    "subTipo": "M"
                },
                {
                    "name": "ESFALERITA",
                    "value": "202",
                    "subTipo": "M"
                },
                {
                    "name": "ESMERALDA",
                    "value": "175",
                    "subTipo": "M"
                },
                {
                    "name": "ESMERALDAS EN BRUTO, SIN LABRAR O SIMPLEMENTE ASERRADAS O DESBASTADAS",
                    "value": "1631",
                    "subTipo": "M"
                },
                {
                    "name": "ESMERALDAS SIN TALLAR",
                    "value": "16311",
                    "subTipo": "M"
                },
                {
                    "name": "ESQUISTOS",
                    "value": "229",
                    "subTipo": "M"
                },
                {
                    "name": "ESQUISTOS TALCOSOS",
                    "value": "27",
                    "subTipo": "M"
                },
                {
                    "name": "ESTA?O",
                    "value": "78",
                    "subTipo": "M"
                },
                {
                    "name": "ESTEATITA ( SILICATO MAG.HIDRATADO)",
                    "value": "216",
                    "subTipo": "M"
                },
                {
                    "name": "FELDESPATO",
                    "value": "69",
                    "subTipo": "M"
                },
                {
                    "name": "FELDESPATOS",
                    "value": "163992",
                    "subTipo": "M"
                },
                {
                    "name": "FLUORITA",
                    "value": "109",
                    "subTipo": "M"
                },
                {
                    "name": "FLUORITA (MIG)",
                    "value": "161921",
                    "subTipo": "M"
                },
                {
                    "name": "FOSFATOS",
                    "value": "104",
                    "subTipo": "M"
                },
                {
                    "name": "FOSFATOS DE CALCIO NATURALES, FOSFATOS ALUMINOCALCICOS NATURALES Y CRETA FOSFATADA; CARNALITA, SILVINITA, OTRAS SALES NATURALES DE POTASIO SIN ELABORAR",
                    "value": "1611",
                    "subTipo": "M"
                },
                {
                    "name": "FOSFORITA",
                    "value": "63",
                    "subTipo": "M"
                },
                {
                    "name": "FUNDENTE DE ROCA O PIEDRA CALIZA",
                    "value": "15221",
                    "subTipo": "M"
                },
                {
                    "name": "GALENA",
                    "value": "214",
                    "subTipo": "M"
                },
                {
                    "name": "GAS",
                    "value": "G",
                    "subTipo": "H"
                },
                {
                    "name": "GRAFITO",
                    "value": "10",
                    "subTipo": "M"
                },
                {
                    "name": "GRANITO",
                    "value": "32",
                    "subTipo": "M"
                },
                {
                    "name": "GRANITO (MIG)",
                    "value": "15134",
                    "subTipo": "M"
                },
                {
                    "name": "GRANITO, BASALTO, PÓRFIDO Y OTRAS PIEDRAS DE TALLA O DE CONSTRUCCIÓN, EN BRUTO",
                    "value": "1513",
                    "subTipo": "M"
                },
                {
                    "name": "GRAVA",
                    "value": "199",
                    "subTipo": "M"
                },
                {
                    "name": "GRAVAS (EXCEPTO SILÍCEAS)",
                    "value": "153205",
                    "subTipo": "M"
                },
                {
                    "name": "GRAVAS NATURALES",
                    "value": "153113",
                    "subTipo": "M"
                },
                {
                    "name": "GRAVILLA",
                    "value": "156",
                    "subTipo": "M"
                },
                {
                    "name": "GRAVILLA (MIG)",
                    "value": "153204",
                    "subTipo": "M"
                },
                {
                    "name": "HIERRO",
                    "value": "190",
                    "subTipo": "M"
                },
                {
                    "name": "HULLA BITUMINOSA, ANTRACÍTICA, O CARBÓN MINERAL SIN AGLOMERAR",
                    "value": "1101",
                    "subTipo": "M"
                },
                {
                    "name": "ILMENITA",
                    "value": "103",
                    "subTipo": "M"
                },
                {
                    "name": "LIMONITA",
                    "value": "102",
                    "subTipo": "M"
                },
                {
                    "name": "LIMOS",
                    "value": "82",
                    "subTipo": "M"
                },
                {
                    "name": "LUTITA",
                    "value": "66",
                    "subTipo": "M"
                },
                {
                    "name": "LUTITAS Y ARENAS ALQUITRANÍFERAS (EXCEPTO ASFALTOS Y BETUNES NATURALES)",
                    "value": "1203",
                    "subTipo": "M"
                },
                {
                    "name": "MAGNESIO",
                    "value": "62",
                    "subTipo": "M"
                },
                {
                    "name": "MAGNESITA",
                    "value": "123",
                    "subTipo": "M"
                },
                {
                    "name": "MAGNETITA",
                    "value": "35",
                    "subTipo": "M"
                },
                {
                    "name": "MANGANESO",
                    "value": "154",
                    "subTipo": "M"
                },
                {
                    "name": "MARGAS",
                    "value": "186",
                    "subTipo": "M"
                },
                {
                    "name": "MARMOL",
                    "value": "74",
                    "subTipo": "M"
                },
                {
                    "name": "MARMOL TRAVERTINO",
                    "value": "177",
                    "subTipo": "M"
                },
                {
                    "name": "MARMOL Y OTRAS ROCAS METAMÓRFICAS; ROCAS O PIEDRAS CALIZAS DE TALLA Y DE CONSTRUCCIÓN",
                    "value": "1512",
                    "subTipo": "M"
                },
                {
                    "name": "MARMOL Y TRAVERTINO EN BLOQUES",
                    "value": "15122",
                    "subTipo": "M"
                },
                {
                    "name": "MARMOL Y TRAVERTINO EN BRUTO",
                    "value": "15121",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIAL ALUVIAL",
                    "value": "180",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIAL ALUVIAL.",
                    "value": "153127",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIAL ARCILLOSO",
                    "value": "234",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIAL DE ARRASTRE",
                    "value": "208",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIAL DE CANTERA",
                    "value": "60",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIAL DE RECEBO",
                    "value": "49",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIALES CALCAREOS",
                    "value": "105",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIALES DE CONSTRUCCION",
                    "value": "28",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIALES DE CONSTRUCCIÓN",
                    "value": "153126",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIALES DE LECHO DE RIO",
                    "value": "15",
                    "subTipo": "M"
                },
                {
                    "name": "MATERIALES PETREOS",
                    "value": "54",
                    "subTipo": "M"
                },
                {
                    "name": "MERCURIO",
                    "value": "91",
                    "subTipo": "M"
                },
                {
                    "name": "METALES",
                    "value": "100",
                    "subTipo": "M"
                },
                {
                    "name": "METALES PRECIOSOS",
                    "value": "197",
                    "subTipo": "M"
                },
                {
                    "name": "MICA",
                    "value": "165",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE COBRE",
                    "value": "181",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE ESTA?O",
                    "value": "135",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE HIERRO",
                    "value": "93",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE MANGANESO",
                    "value": "164",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE MOLIBDENO",
                    "value": "4",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE NIQUEL",
                    "value": "80",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE PLATA",
                    "value": "116",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE PLOMO",
                    "value": "138",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE URANIO",
                    "value": "149",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL DE ZINC",
                    "value": "129",
                    "subTipo": "M"
                },
                {
                    "name": "MINERAL METALICO",
                    "value": "96",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE ALUMINIO Y SUS CONCENTRADOS",
                    "value": "1423",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE ANTIMONIO Y SUS CONCENTRADOS",
                    "value": "142914",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE BARIO",
                    "value": "161914",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE COBRE Y SUS CONCENTRADOS",
                    "value": "1421",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE ESTAÑO Y SUS CONCENTRADOS",
                    "value": "14293",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE HIERRO",
                    "value": "14101",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE MANGANESO ( Y SUS CONCENTRADOS)",
                    "value": "14294",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE METALES NO FERROSOS Y SUS CONCENTRADOS, NCP",
                    "value": "142998",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE METALES PRECIOSOS Y SUS CONCENTRADOS",
                    "value": "1424",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE MOLIBDENO Y SUS CONCENTRADOS",
                    "value": "142912",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE NIOBIO, TANTALIO, VANADIO O CIRCONIO Y SUS CONCENTRADOS",
                    "value": "142913",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE NÍQUEL Y SUS CONCENTRADOS",
                    "value": "1422",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE ORIGEN VOLCANICO",
                    "value": "174",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE ORO Y PLATINO, Y SUS CONCENTRADOS",
                    "value": "1425",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE ORO Y SUS CONCENTRADOS",
                    "value": "14251",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE PLATA Y SUS CONCENTRADOS",
                    "value": "14241",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE PLATINO Y SUS CONCENTRADOS",
                    "value": "14252",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE PLOMO Y SUS CONCENTRADOS",
                    "value": "14291",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE POTASIO",
                    "value": "16111",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE TITANIO Y SUS CONCENTRADOS (RUTILO Y SIMILARES)",
                    "value": "14296",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES DE ZINC Y SUS CONCENTRADOS",
                    "value": "14292",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES NO FERROSOS Y SUS CONCENTRADOS NCP",
                    "value": "142999",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES PRECIOSOS NCP",
                    "value": "1632199",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES Y CONCENTRADOS DE HIERRO (EXCEPTO PIRITAS DE HIERRO TOSTADAS)",
                    "value": "1410",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES Y CONCENTRADOS DE URANIO",
                    "value": "13001",
                    "subTipo": "M"
                },
                {
                    "name": "MINERALES Y CONCENTRADOS DE URANIO Y TORIO",
                    "value": "1300",
                    "subTipo": "M"
                },
                {
                    "name": "NIQUEL",
                    "value": "98",
                    "subTipo": "M"
                },
                {
                    "name": "ORO",
                    "value": "235",
                    "subTipo": "M"
                },
                {
                    "name": "ORO ALUVION",
                    "value": "157",
                    "subTipo": "M"
                },
                {
                    "name": "ORO FILON",
                    "value": "55",
                    "subTipo": "M"
                },
                {
                    "name": "ORO VETA",
                    "value": "184",
                    "subTipo": "M"
                },
                {
                    "name": "OTRAS ARCILLAS NCP",
                    "value": "1540099",
                    "subTipo": "M"
                },
                {
                    "name": "OTRAS ROCAS O PIEDRAS TRITURADAS PARA CONSTRUCCIÓN NCP",
                    "value": "153299",
                    "subTipo": "M"
                },
                {
                    "name": "OTROS MINERALES NCP",
                    "value": "1639",
                    "subTipo": "M"
                },
                {
                    "name": "OTROS MINERALES PARA LA EXTRACCIÓN DE PRODUCTOS QUÍMICOS",
                    "value": "16199",
                    "subTipo": "M"
                },
                {
                    "name": "OXIDOS DE HIERRO",
                    "value": "221",
                    "subTipo": "M"
                },
                {
                    "name": "PERLITA SIN DILATAR",
                    "value": "163962",
                    "subTipo": "M"
                },
                {
                    "name": "PETREOS",
                    "value": "179",
                    "subTipo": "M"
                },
                {
                    "name": "PIEDRA",
                    "value": "120",
                    "subTipo": "M"
                },
                {
                    "name": "PIEDRA ORNAMENTAL",
                    "value": "44",
                    "subTipo": "M"
                },
                {
                    "name": "PIEDRAS PRECIOSAS",
                    "value": "223",
                    "subTipo": "M"
                },
                {
                    "name": "PIEDRAS PRECIOSAS NCP SIN TALLAR",
                    "value": "1632197",
                    "subTipo": "M"
                },
                {
                    "name": "PIEDRAS SEMIPRECIOSAS",
                    "value": "31",
                    "subTipo": "M"
                },
                {
                    "name": "PIEDRAS SEMIPRECIOSAS NCP SIN TALLAR",
                    "value": "1632198",
                    "subTipo": "M"
                },
                {
                    "name": "PIROFILITA",
                    "value": "160",
                    "subTipo": "M"
                },
                {
                    "name": "PIZARRA",
                    "value": "37",
                    "subTipo": "M"
                },
                {
                    "name": "PLATA",
                    "value": "201",
                    "subTipo": "M"
                },
                {
                    "name": "PLATA EN ALUVION",
                    "value": "24",
                    "subTipo": "M"
                },
                {
                    "name": "PLATA EN VETA (FILON)",
                    "value": "42",
                    "subTipo": "M"
                },
                {
                    "name": "PLATINO",
                    "value": "222",
                    "subTipo": "M"
                },
                {
                    "name": "POR DEFINIR",
                    "value": "122",
                    "subTipo": "M"
                },
                {
                    "name": "POTASIO",
                    "value": "147",
                    "subTipo": "M"
                },
                {
                    "name": "PUMITA",
                    "value": "210",
                    "subTipo": "M"
                },
                {
                    "name": "PUZOLANA",
                    "value": "142",
                    "subTipo": "M"
                },
                {
                    "name": "PUZOLANA (MIG)",
                    "value": "15132",
                    "subTipo": "M"
                },
                {
                    "name": "RECEBO",
                    "value": "81",
                    "subTipo": "M"
                },
                {
                    "name": "RECEBO (MIG)",
                    "value": "153114",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA CORALINA",
                    "value": "173",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA FOSFATICA O FOSFÓRICA, O FOSFORITA",
                    "value": "16113",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA FOSFORICA",
                    "value": "43",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA GRANITICAS",
                    "value": "182",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA MUERTA",
                    "value": "41",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA O PIEDRA CALIZA EN BLOQUES",
                    "value": "15125",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA O PIEDRA CALIZA EN BRUTO",
                    "value": "15123",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA O PIEDRA CORALINA",
                    "value": "15222",
                    "subTipo": "M"
                },
                {
                    "name": "ROCA ORNAMENTAL",
                    "value": "61",
                    "subTipo": "M"
                },
                {
                    "name": "ROCAS",
                    "value": "53",
                    "subTipo": "M"
                },
                {
                    "name": "ROCAS DE CUARCITA EN BRUTO O DESBASTADAS",
                    "value": "163912",
                    "subTipo": "M"
                },
                {
                    "name": "ROCAS DE ORIGEN VOLCANICO",
                    "value": "15131",
                    "subTipo": "M"
                },
                {
                    "name": "ROCAS O PIEDRAS CALIZAS DE TALLA O DE CONSTRUCCIÓN NCP",
                    "value": "151299",
                    "subTipo": "M"
                },
                {
                    "name": "SAL",
                    "value": "220",
                    "subTipo": "M"
                },
                {
                    "name": "SAL GEMA O HALITA",
                    "value": "16201",
                    "subTipo": "M"
                },
                {
                    "name": "SAL MARINA SIN PURIFICAR",
                    "value": "16203",
                    "subTipo": "M"
                },
                {
                    "name": "SALMUERA O SOLUCION SATURADA DE SAL",
                    "value": "16202",
                    "subTipo": "M"
                },
                {
                    "name": "SERPENTINA",
                    "value": "94",
                    "subTipo": "M"
                },
                {
                    "name": "SHALE",
                    "value": "204",
                    "subTipo": "M"
                },
                {
                    "name": "SILICATO MAGNESIO NATURAL HIDRATADO",
                    "value": "244",
                    "subTipo": "M"
                },
                {
                    "name": "SILICE",
                    "value": "90",
                    "subTipo": "M"
                },
                {
                    "name": "SILICEOS",
                    "value": "48",
                    "subTipo": "M"
                },
                {
                    "name": "SULFATO DE BARIO NATURAL-BARITINA",
                    "value": "161911",
                    "subTipo": "M"
                },
                {
                    "name": "SULFATO Y CARBONATO DE BARIO NATURALES (EXCEPTO LOS REFINADOS, QUE SE CLASIFICAN EN LA DIVISIÓN 34)",
                    "value": "16191",
                    "subTipo": "M"
                },
                {
                    "name": "SULFUROS POLIMETALICOS",
                    "value": "67",
                    "subTipo": "M"
                },
                {
                    "name": "TALCO",
                    "value": "163954",
                    "subTipo": "M"
                },
                {
                    "name": "TALCO ( SILICATO DE MAGNESIO)",
                    "value": "57",
                    "subTipo": "M"
                },
                {
                    "name": "TERMICO",
                    "value": "73",
                    "subTipo": "M"
                },
                {
                    "name": "TIERRAS DIATOMACEAS SIN ACTIVAR",
                    "value": "163921",
                    "subTipo": "M"
                },
                {
                    "name": "TITANIO",
                    "value": "107",
                    "subTipo": "M"
                },
                {
                    "name": "TODOS LOS MINERALES",
                    "value": "106",
                    "subTipo": "M"
                },
                {
                    "name": "URANIO",
                    "value": "245",
                    "subTipo": "M"
                },
                {
                    "name": "VANADIO",
                    "value": "188",
                    "subTipo": "M"
                },
                {
                    "name": "VERMICULITA",
                    "value": "64",
                    "subTipo": "M"
                },
                {
                    "name": "YESO",
                    "value": "148",
                    "subTipo": "M"
                },
                {
                    "name": "YESO (MIG)",
                    "value": "15211",
                    "subTipo": "M"
                },
                {
                    "name": "YESO NATURAL; ANHIDRITA",
                    "value": "1521",
                    "subTipo": "M"
                },
                {
                    "name": "ZAHORRA",
                    "value": "239",
                    "subTipo": "M"
                },
                {
                    "name": "ZIRCON",
                    "value": "137",
                    "subTipo": "M"
                },
                {
                    "name": "Todos los recursos",
                    "value": "-1",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Título/Campo",
            "parameter": "campoProyectoFiscalizacion",
            "esMultiple": false,
            "usaServicioAjax": true,
            "urlServicioAjax": "/api/Fiscalizacion/GetCampoOMinasPorNombre/",
            "seccionAplicativo": "Fiscalizacion",
            "items": [
                {
                    "name": "0-0251",
                    "value": "0-0251",
                    "subTipo": "M"
                },
                {
                    "name": "0-154",
                    "value": "0-154",
                    "subTipo": "M"
                },
                {
                    "name": "0-176",
                    "value": "0-176",
                    "subTipo": "M"
                },
                {
                    "name": "0-178",
                    "value": "0-178",
                    "subTipo": "M"
                },
                {
                    "name": "0-179",
                    "value": "0-179",
                    "subTipo": "M"
                },
                {
                    "name": "0-180",
                    "value": "0-180",
                    "subTipo": "M"
                },
                {
                    "name": "0-181",
                    "value": "0-181",
                    "subTipo": "M"
                },
                {
                    "name": "0-187",
                    "value": "0-187",
                    "subTipo": "M"
                },
                {
                    "name": "0-188",
                    "value": "0-188",
                    "subTipo": "M"
                },
                {
                    "name": "0-190",
                    "value": "0-190",
                    "subTipo": "M"
                },
                {
                    "name": "0-192",
                    "value": "0-192",
                    "subTipo": "M"
                },
                {
                    "name": "0-214",
                    "value": "0-214",
                    "subTipo": "M"
                },
                {
                    "name": "0-215",
                    "value": "0-215",
                    "subTipo": "M"
                },
                {
                    "name": "0-215-1",
                    "value": "0-215-1",
                    "subTipo": "M"
                },
                {
                    "name": "0-221",
                    "value": "0-221",
                    "subTipo": "M"
                },
                {
                    "name": "0-224",
                    "value": "0-224",
                    "subTipo": "M"
                },
                {
                    "name": "0-225",
                    "value": "0-225",
                    "subTipo": "M"
                },
                {
                    "name": "0-227",
                    "value": "0-227",
                    "subTipo": "M"
                },
                {
                    "name": "0-229",
                    "value": "0-229",
                    "subTipo": "M"
                },
                {
                    "name": "0-250",
                    "value": "0-250",
                    "subTipo": "M"
                },
                {
                    "name": "0-265",
                    "value": "0-265",
                    "subTipo": "M"
                },
                {
                    "name": "0-269",
                    "value": "0-269",
                    "subTipo": "M"
                },
                {
                    "name": "0-270",
                    "value": "0-270",
                    "subTipo": "M"
                },
                {
                    "name": "0-271",
                    "value": "0-271",
                    "subTipo": "M"
                },
                {
                    "name": "0-272",
                    "value": "0-272",
                    "subTipo": "M"
                },
                {
                    "name": "0-275",
                    "value": "0-275",
                    "subTipo": "M"
                },
                {
                    "name": "0-276",
                    "value": "0-276",
                    "subTipo": "M"
                },
                {
                    "name": "0-303",
                    "value": "0-303",
                    "subTipo": "M"
                },
                {
                    "name": "0-420",
                    "value": "0-420",
                    "subTipo": "M"
                },
                {
                    "name": "0-430",
                    "value": "0-430",
                    "subTipo": "M"
                },
                {
                    "name": "0-431",
                    "value": "0-431",
                    "subTipo": "M"
                },
                {
                    "name": "0-432",
                    "value": "0-432",
                    "subTipo": "M"
                },
                {
                    "name": "0-433",
                    "value": "0-433",
                    "subTipo": "M"
                },
                {
                    "name": "0-435",
                    "value": "0-435",
                    "subTipo": "M"
                },
                {
                    "name": "0-437",
                    "value": "0-437",
                    "subTipo": "M"
                },
                {
                    "name": "0-439",
                    "value": "0-439",
                    "subTipo": "M"
                },
                {
                    "name": "0-442",
                    "value": "0-442",
                    "subTipo": "M"
                },
                {
                    "name": "0-444",
                    "value": "0-444",
                    "subTipo": "M"
                },
                {
                    "name": "0-447",
                    "value": "0-447",
                    "subTipo": "M"
                },
                {
                    "name": "0-452",
                    "value": "0-452",
                    "subTipo": "M"
                },
                {
                    "name": "0-484",
                    "value": "0-484",
                    "subTipo": "M"
                },
                {
                    "name": "0-490",
                    "value": "0-490",
                    "subTipo": "M"
                },
                {
                    "name": "0-502",
                    "value": "0-502",
                    "subTipo": "M"
                },
                {
                    "name": "0-505",
                    "value": "0-505",
                    "subTipo": "M"
                },
                {
                    "name": "0-507",
                    "value": "0-507",
                    "subTipo": "M"
                },
                {
                    "name": "0-519",
                    "value": "0-519",
                    "subTipo": "M"
                },
                {
                    "name": "0-525",
                    "value": "0-525",
                    "subTipo": "M"
                },
                {
                    "name": "0-526",
                    "value": "0-526",
                    "subTipo": "M"
                },
                {
                    "name": "0-529",
                    "value": "0-529",
                    "subTipo": "M"
                },
                {
                    "name": "0-533-1",
                    "value": "0-533-1",
                    "subTipo": "M"
                },
                {
                    "name": "0-533-5",
                    "value": "0-533-5",
                    "subTipo": "M"
                },
                {
                    "name": "0-542",
                    "value": "0-542",
                    "subTipo": "M"
                },
                {
                    "name": "0-543",
                    "value": "0-543",
                    "subTipo": "M"
                },
                {
                    "name": "0-544",
                    "value": "0-544",
                    "subTipo": "M"
                },
                {
                    "name": "0-547",
                    "value": "0-547",
                    "subTipo": "M"
                },
                {
                    "name": "0-548",
                    "value": "0-548",
                    "subTipo": "M"
                },
                {
                    "name": "0-548-1",
                    "value": "0-548-1",
                    "subTipo": "M"
                },
                {
                    "name": "0-549",
                    "value": "0-549",
                    "subTipo": "M"
                },
                {
                    "name": "0-550",
                    "value": "0-550",
                    "subTipo": "M"
                },
                {
                    "name": "0-551",
                    "value": "0-551",
                    "subTipo": "M"
                },
                {
                    "name": "0-552",
                    "value": "0-552",
                    "subTipo": "M"
                },
                {
                    "name": "0-555",
                    "value": "0-555",
                    "subTipo": "M"
                },
                {
                    "name": "0-559",
                    "value": "0-559",
                    "subTipo": "M"
                },
                {
                    "name": "0-560",
                    "value": "0-560",
                    "subTipo": "M"
                },
                {
                    "name": "0-561",
                    "value": "0-561",
                    "subTipo": "M"
                },
                {
                    "name": "0-563",
                    "value": "0-563",
                    "subTipo": "M"
                },
                {
                    "name": "0-563-1",
                    "value": "0-563-1",
                    "subTipo": "M"
                },
                {
                    "name": "0-564",
                    "value": "0-564",
                    "subTipo": "M"
                },
                {
                    "name": "0-564-1",
                    "value": "0-564-1",
                    "subTipo": "M"
                },
                {
                    "name": "0-564-2",
                    "value": "0-564-2",
                    "subTipo": "M"
                },
                {
                    "name": "0-566",
                    "value": "0-566",
                    "subTipo": "M"
                },
                {
                    "name": "0-574",
                    "value": "0-574",
                    "subTipo": "M"
                },
                {
                    "name": "0-575",
                    "value": "0-575",
                    "subTipo": "M"
                },
                {
                    "name": "0-578",
                    "value": "0-578",
                    "subTipo": "M"
                },
                {
                    "name": "0-581",
                    "value": "0-581",
                    "subTipo": "M"
                },
                {
                    "name": "0-582",
                    "value": "0-582",
                    "subTipo": "M"
                },
                {
                    "name": "0-583",
                    "value": "0-583",
                    "subTipo": "M"
                },
                {
                    "name": "0-584",
                    "value": "0-584",
                    "subTipo": "M"
                },
                {
                    "name": "0-586",
                    "value": "0-586",
                    "subTipo": "M"
                },
                {
                    "name": "0-587",
                    "value": "0-587",
                    "subTipo": "M"
                },
                {
                    "name": "0-588",
                    "value": "0-588",
                    "subTipo": "M"
                },
                {
                    "name": "0-591",
                    "value": "0-591",
                    "subTipo": "M"
                },
                {
                    "name": "0-592",
                    "value": "0-592",
                    "subTipo": "M"
                },
                {
                    "name": "0-599",
                    "value": "0-599",
                    "subTipo": "M"
                },
                {
                    "name": "0-606",
                    "value": "0-606",
                    "subTipo": "M"
                },
                {
                    "name": "0-607",
                    "value": "0-607",
                    "subTipo": "M"
                },
                {
                    "name": "00-1976 - (8300780386) CERREJON ZONA NORTE SOCIEDAD ANONIMA - CZN S.A.\\ (8600698042) CARBONES DEL CERREJON LLC",
                    "value": "00-1976",
                    "subTipo": "M"
                },
                {
                    "name": "00-89",
                    "value": "00-89",
                    "subTipo": "M"
                },
                {
                    "name": "00009-15",
                    "value": "00009-15",
                    "subTipo": "M"
                },
                {
                    "name": "00010-15",
                    "value": "00010-15",
                    "subTipo": "M"
                },
                {
                    "name": "00011 - (8917024641) COMUNIDAD DE EL CERREJON",
                    "value": "11",
                    "subTipo": "M"
                },
                {
                    "name": "0002-52",
                    "value": "0002-52",
                    "subTipo": "M"
                },
                {
                    "name": "00028-73",
                    "value": "00028-73",
                    "subTipo": "M"
                },
                {
                    "name": "00032-73",
                    "value": "00032-73",
                    "subTipo": "M"
                },
                {
                    "name": "00033-15",
                    "value": "00033-15",
                    "subTipo": "M"
                },
                {
                    "name": "00034-73",
                    "value": "00034-73",
                    "subTipo": "M"
                },
                {
                    "name": "00037-15",
                    "value": "00037-15",
                    "subTipo": "M"
                },
                {
                    "name": "00041-73",
                    "value": "00041-73",
                    "subTipo": "M"
                },
                {
                    "name": "00045-15",
                    "value": "00045-15",
                    "subTipo": "M"
                },
                {
                    "name": "00055-15",
                    "value": "00055-15",
                    "subTipo": "M"
                },
                {
                    "name": "00056-15",
                    "value": "00056-15",
                    "subTipo": "M"
                },
                {
                    "name": "00065-15",
                    "value": "00065-15",
                    "subTipo": "M"
                },
                {
                    "name": "0007-73",
                    "value": "0007-73",
                    "subTipo": "M"
                },
                {
                    "name": "00070-15",
                    "value": "00070-15",
                    "subTipo": "M"
                },
                {
                    "name": "00072-15",
                    "value": "00072-15",
                    "subTipo": "M"
                },
                {
                    "name": "00084-73",
                    "value": "00084-73",
                    "subTipo": "M"
                },
                {
                    "name": "00092-52",
                    "value": "00092-52",
                    "subTipo": "M"
                },
                {
                    "name": "00093-52",
                    "value": "00093-52",
                    "subTipo": "M"
                },
                {
                    "name": "00098-73",
                    "value": "00098-73",
                    "subTipo": "M"
                },
                {
                    "name": "00100-15",
                    "value": "00100-15",
                    "subTipo": "M"
                },
                {
                    "name": "00102-15",
                    "value": "00102-15",
                    "subTipo": "M"
                },
                {
                    "name": "0011-68",
                    "value": "0011-68",
                    "subTipo": "M"
                },
                {
                    "name": "00113-52",
                    "value": "00113-52",
                    "subTipo": "M"
                },
                {
                    "name": "00129-15",
                    "value": "00129-15",
                    "subTipo": "M"
                },
                {
                    "name": "0013-68",
                    "value": "0013-68",
                    "subTipo": "M"
                },
                {
                    "name": "00131-52",
                    "value": "00131-52",
                    "subTipo": "M"
                },
                {
                    "name": "00136-15",
                    "value": "00136-15",
                    "subTipo": "M"
                },
                {
                    "name": "00137-15",
                    "value": "00137-15",
                    "subTipo": "M"
                },
                {
                    "name": "00138-15",
                    "value": "00138-15",
                    "subTipo": "M"
                },
                {
                    "name": "00139-15",
                    "value": "00139-15",
                    "subTipo": "M"
                },
                {
                    "name": "00141-15",
                    "value": "00141-15",
                    "subTipo": "M"
                },
                {
                    "name": "00142-15",
                    "value": "00142-15",
                    "subTipo": "M"
                },
                {
                    "name": "00151-52",
                    "value": "00151-52",
                    "subTipo": "M"
                },
                {
                    "name": "00172.-27",
                    "value": "00172.-27",
                    "subTipo": "M"
                },
                {
                    "name": "00173-27",
                    "value": "00173-27",
                    "subTipo": "M"
                },
                {
                    "name": "00175-27",
                    "value": "00175-27",
                    "subTipo": "M"
                },
                {
                    "name": "00181-15",
                    "value": "00181-15",
                    "subTipo": "M"
                },
                {
                    "name": "00187-15",
                    "value": "00187-15",
                    "subTipo": "M"
                },
                {
                    "name": "00188-15",
                    "value": "00188-15",
                    "subTipo": "M"
                },
                {
                    "name": "0019-68",
                    "value": "0019-68",
                    "subTipo": "M"
                },
                {
                    "name": "00190-15",
                    "value": "00190-15",
                    "subTipo": "M"
                },
                {
                    "name": "00201-15",
                    "value": "00201-15",
                    "subTipo": "M"
                },
                {
                    "name": "00206-15",
                    "value": "00206-15",
                    "subTipo": "M"
                },
                {
                    "name": "00208-15",
                    "value": "00208-15",
                    "subTipo": "M"
                },
                {
                    "name": "00211-27",
                    "value": "00211-27",
                    "subTipo": "M"
                },
                {
                    "name": "00212-15",
                    "value": "00212-15",
                    "subTipo": "M"
                },
                {
                    "name": "00214-15",
                    "value": "00214-15",
                    "subTipo": "M"
                },
                {
                    "name": "00215-15",
                    "value": "00215-15",
                    "subTipo": "M"
                },
                {
                    "name": "00218-52",
                    "value": "00218-52",
                    "subTipo": "M"
                },
                {
                    "name": "00222-52",
                    "value": "00222-52",
                    "subTipo": "M"
                },
                {
                    "name": "00223-52",
                    "value": "00223-52",
                    "subTipo": "M"
                },
                {
                    "name": "00227-52",
                    "value": "00227-52",
                    "subTipo": "M"
                },
                {
                    "name": "00229-52",
                    "value": "00229-52",
                    "subTipo": "M"
                },
                {
                    "name": "0023-Z2",
                    "value": "0023-Z2",
                    "subTipo": "M"
                },
                {
                    "name": "0023-Z3",
                    "value": "0023-Z3",
                    "subTipo": "M"
                },
                {
                    "name": "0023-Z4",
                    "value": "0023-Z4",
                    "subTipo": "M"
                },
                {
                    "name": "0023-Z5",
                    "value": "0023-Z5",
                    "subTipo": "M"
                },
                {
                    "name": "00230-15",
                    "value": "00230-15",
                    "subTipo": "M"
                },
                {
                    "name": "00237-52",
                    "value": "00237-52",
                    "subTipo": "M"
                },
                {
                    "name": "00244-52",
                    "value": "00244-52",
                    "subTipo": "M"
                },
                {
                    "name": "00245-15",
                    "value": "00245-15",
                    "subTipo": "M"
                },
                {
                    "name": "00246-52",
                    "value": "00246-52",
                    "subTipo": "M"
                },
                {
                    "name": "0026-73",
                    "value": "0026-73",
                    "subTipo": "M"
                },
                {
                    "name": "00268-15",
                    "value": "00268-15",
                    "subTipo": "M"
                },
                {
                    "name": "00270-52",
                    "value": "00270-52",
                    "subTipo": "M"
                },
                {
                    "name": "00273-52",
                    "value": "00273-52",
                    "subTipo": "M"
                },
                {
                    "name": "00275-15",
                    "value": "00275-15",
                    "subTipo": "M"
                },
                {
                    "name": "00280-15",
                    "value": "00280-15",
                    "subTipo": "M"
                },
                {
                    "name": "00281-15",
                    "value": "00281-15",
                    "subTipo": "M"
                },
                {
                    "name": "0029-44",
                    "value": "0029-44",
                    "subTipo": "M"
                },
                {
                    "name": "00298-15",
                    "value": "00298-15",
                    "subTipo": "M"
                },
                {
                    "name": "003-17",
                    "value": "003-17",
                    "subTipo": "M"
                },
                {
                    "name": "003-91",
                    "value": "003-91",
                    "subTipo": "M"
                },
                {
                    "name": "0030-68",
                    "value": "0030-68",
                    "subTipo": "M"
                },
                {
                    "name": "00303-15",
                    "value": "00303-15",
                    "subTipo": "M"
                },
                {
                    "name": "00309-15",
                    "value": "00309-15",
                    "subTipo": "M"
                },
                {
                    "name": "00318-52",
                    "value": "00318-52",
                    "subTipo": "M"
                },
                {
                    "name": "0032-68",
                    "value": "0032-68",
                    "subTipo": "M"
                },
                {
                    "name": "00325-15",
                    "value": "00325-15",
                    "subTipo": "M"
                },
                {
                    "name": "00327-15",
                    "value": "00327-15",
                    "subTipo": "M"
                },
                {
                    "name": "00330-52",
                    "value": "00330-52",
                    "subTipo": "M"
                },
                {
                    "name": "00334-15",
                    "value": "00334-15",
                    "subTipo": "M"
                },
                {
                    "name": "00335-52",
                    "value": "00335-52",
                    "subTipo": "M"
                },
                {
                    "name": "00336-52",
                    "value": "00336-52",
                    "subTipo": "M"
                },
                {
                    "name": "00338-15",
                    "value": "00338-15",
                    "subTipo": "M"
                },
                {
                    "name": "00339-15",
                    "value": "00339-15",
                    "subTipo": "M"
                },
                {
                    "name": "00345-52",
                    "value": "00345-52",
                    "subTipo": "M"
                },
                {
                    "name": "0035-73",
                    "value": "0035-73",
                    "subTipo": "M"
                },
                {
                    "name": "00351-52",
                    "value": "00351-52",
                    "subTipo": "M"
                },
                {
                    "name": "00352-15",
                    "value": "00352-15",
                    "subTipo": "M"
                },
                {
                    "name": "00353-15",
                    "value": "00353-15",
                    "subTipo": "M"
                },
                {
                    "name": "00358-15",
                    "value": "00358-15",
                    "subTipo": "M"
                },
                {
                    "name": "00360-15",
                    "value": "00360-15",
                    "subTipo": "M"
                },
                {
                    "name": "00365-15",
                    "value": "00365-15",
                    "subTipo": "M"
                },
                {
                    "name": "00368-15",
                    "value": "00368-15",
                    "subTipo": "M"
                },
                {
                    "name": "0037-68",
                    "value": "0037-68",
                    "subTipo": "M"
                },
                {
                    "name": "00375-15",
                    "value": "00375-15",
                    "subTipo": "M"
                },
                {
                    "name": "00379-15",
                    "value": "00379-15",
                    "subTipo": "M"
                },
                {
                    "name": "0038-44",
                    "value": "0038-44",
                    "subTipo": "M"
                },
                {
                    "name": "0039-68",
                    "value": "0039-68",
                    "subTipo": "M"
                },
                {
                    "name": "00400-15",
                    "value": "00400-15",
                    "subTipo": "M"
                },
                {
                    "name": "00401-15",
                    "value": "00401-15",
                    "subTipo": "M"
                },
                {
                    "name": "00403-15",
                    "value": "00403-15",
                    "subTipo": "M"
                },
                {
                    "name": "00409-15",
                    "value": "00409-15",
                    "subTipo": "M"
                },
                {
                    "name": "0041-44",
                    "value": "0041-44",
                    "subTipo": "M"
                },
                {
                    "name": "0041-68",
                    "value": "0041-68",
                    "subTipo": "M"
                },
                {
                    "name": "00413-15",
                    "value": "00413-15",
                    "subTipo": "M"
                },
                {
                    "name": "00417-15",
                    "value": "00417-15",
                    "subTipo": "M"
                },
                {
                    "name": "0042-44",
                    "value": "0042-44",
                    "subTipo": "M"
                },
                {
                    "name": "0043-44",
                    "value": "0043-44",
                    "subTipo": "M"
                }
            ]
        },
        {
            "name": "Estado de la Fiscalización",
            "parameter": "tipoFiscalizacion",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Fiscalizacion",
            "items": [
                {
                    "name": "No fiscalizados",
                    "value": "0",
                    "subTipo": null
                },
                {
                    "name": "Fiscalizados",
                    "value": "1",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Periodos",
            "parameter": "periodosFiscalizacion",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Fiscalizacion",
            "items": [
                {
                    "name": "2012",
                    "value": "2012",
                    "subTipo": null
                },
                {
                    "name": "2013",
                    "value": "2013",
                    "subTipo": null
                },
                {
                    "name": "2014",
                    "value": "2014",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Etapa Campo o Proyecto",
            "parameter": "etapaCampo",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "FiscalizacionANM",
            "items": [
                {
                    "name": "Etapa2",
                    "value": "2",
                    "subTipo": "1"
                },
                {
                    "name": "Etapa1",
                    "value": "1",
                    "subTipo": "1"
                },
                {
                    "name": "Etapa1",
                    "value": "1",
                    "subTipo": "1"
                },
                {
                    "name": "Todos",
                    "value": "-1",
                    "subTipo": null
                }
            ]
        },
        {
            "name": "Tipo recurso natural no renovable",
            "parameter": "tipoRecursoNaturalFiscalizacion",
            "esMultiple": false,
            "usaServicioAjax": false,
            "urlServicioAjax": null,
            "seccionAplicativo": "Fiscalizacion",
            "items": [
                {
                    "name": "Hidrocarburo",
                    "value": "H",
                    "subTipo": null
                },
                {
                    "name": "Mineral",
                    "value": "M",
                    "subTipo": null
                },
                {
                    "name": "Todos",
                    "value": "-1",
                    "subTipo": null
                }
            ]
        }
    ]
})
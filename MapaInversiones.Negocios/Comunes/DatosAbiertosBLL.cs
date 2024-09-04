using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Home;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Negocios.Comunes
{
    public class DatosAbiertosBLL : IDatosAbiertosBLL
    {


        private readonly TransparenciaDB _connection;

        public DatosAbiertosBLL(TransparenciaDB connection)
        {
            _connection = connection;
        }

        public List<infoFuentesRecursos> ObtenerFuentesDatosAbiertos()
        {

            List<infoFuentesRecursos> objReturn = new();

            //var ProjectsPerSectoresQuery = new List<InfoProjectPerSector>();
            var FuentesDeLosRecursos = (from fuente in _connection.FuenteDeLosRecursos
                                        select new infoFuentesRecursos
                                        {
                                            IdFuente = fuente.IdFuente,
                                            NombreFuente = fuente.NombreFuente,
                                            Descripcion = fuente.Descripcion,
                                            FechaActualizacionFuente = fuente.FechaActualizacionFuente

                                        }).ToList();

            objReturn = FuentesDeLosRecursos;
            return objReturn;

        }

    }
}

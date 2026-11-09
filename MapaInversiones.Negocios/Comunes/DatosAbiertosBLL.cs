using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using System.Collections.Generic;
using System.Linq;

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
      List<infoFuentesRecursos> fuentesDeLosRecursos = (from fuente in _connection.FuenteDeLosRecursos
                                                        select new infoFuentesRecursos
                                                        {
                                                          IdFuente = fuente.IdFuente,
                                                          NombreFuente = fuente.NombreFuente,
                                                          Descripcion = fuente.Descripcion,
                                                          FechaActualizacionFuente = fuente.FechaActualizacionFuente,
                                                          FechaCorteFuente = fuente.FechaCorteFuente
                                                        }).ToList();
      objReturn = fuentesDeLosRecursos;
      return objReturn;
    }

  }
}
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
      List<infoFuentesRecursos> fuentesDeLosRecursos = (from fuente in _connection.FuenteDeLosRecursos
                                  select new infoFuentesRecursos
                                  {
                                    IdFuente = fuente.IdFuente,
                                    NombreFuente = fuente.NombreFuente,
                                    Descripcion = fuente.Descripcion,
                                    FechaActualizacionFuente = fuente.FechaActualizacionFuente,
                                  }).ToList();
      for (int i=0; i< fuentesDeLosRecursos.Count; i++)
      {
        infoFuentesRecursos fuente = fuentesDeLosRecursos[i];
        string day = fuente.FechaActualizacionFuente.Day.ToString().Length==1 ? string.Concat("0", fuente.FechaActualizacionFuente.Day.ToString()) : fuente.FechaActualizacionFuente.Day.ToString();
        string month= fuente.FechaActualizacionFuente.Month.ToString().Length==1? string.Concat("0", fuente.FechaActualizacionFuente.Month.ToString()) : fuente.FechaActualizacionFuente.Month.ToString();
        fuentesDeLosRecursos[i].FechaActualizacion = day + "-" + month + "-" + fuente.FechaActualizacionFuente.Year.ToString();
      }
      objReturn = fuentesDeLosRecursos;
      return objReturn;

    }

  }
}

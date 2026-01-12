using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
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
                                                          FechaCorteFuente = fuente.FechaCorteFuente,
                                                          FechaCorte ="No dato",
                                                          FechaFuente="No dato"
                                                        }).ToList();
      for (int i = 0; i < fuentesDeLosRecursos.Count; i++)
      {
        infoFuentesRecursos fuente = fuentesDeLosRecursos[i];
        if (fuente.FechaCorteFuente != null)
        {
          string fechaCorte = fuente.FechaCorteFuente.Value.Day.ToString().Length==1?"0"+ fuente.FechaCorteFuente.Value.Day.ToString(): fuente.FechaCorteFuente.Value.Day.ToString();
          fechaCorte= fuente.FechaCorteFuente.Value.Month.ToString().Length == 1? fechaCorte + "/0" + fuente.FechaCorteFuente.Value.Month.ToString() : fechaCorte + "/"+ fuente.FechaCorteFuente.Value.Month.ToString();
          fechaCorte = fechaCorte +"/" + fuente.FechaCorteFuente.Value.Year.ToString();

          fuentesDeLosRecursos[i].FechaCorte = fechaCorte;

          string fechaFuente = fuente.FechaActualizacionFuente.Day.ToString().Length == 1 ? "0" + fuente.FechaActualizacionFuente.Day.ToString() : fuente.FechaActualizacionFuente.Day.ToString();
          fechaFuente = fuente.FechaActualizacionFuente.Month.ToString().Length == 1 ? fechaFuente + "/0" + fuente.FechaActualizacionFuente.Month.ToString() : fechaFuente + "/" + fuente.FechaActualizacionFuente.Month.ToString();
          fechaFuente = fechaFuente + "/" + fuente.FechaActualizacionFuente.Year.ToString();

          fuentesDeLosRecursos[i].FechaFuente = fechaFuente;
        }
      }
      objReturn = fuentesDeLosRecursos;
      return objReturn;
    }

  }
}
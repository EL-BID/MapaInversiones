using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Emprestitos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Negocios.Emprestitos
{
    public class EmprestitosBLL : IEmprestitosBLL
    {
        private readonly TransparenciaDB _connection;
        public EmprestitosBLL(TransparenciaDB connection)
        {
            _connection = connection;
        }

        public ModelEmprestitoData GetEmprestitoData() 
        {

            ModelEmprestitoData modelo = new ModelEmprestitoData();
            modelo.Creditos = getCreditos();
            modelo.FechasCorte = getCorteInfo();

            return modelo;

        }

        public List<itemCredito> getCreditos()
        {

            var resultado = (from info in _connection.VwConsolidadoCreditos
                             select new itemCredito
                             {
                                 IdEntidadFinanciera = info.IdEntidadFinanciera ?? string.Empty,
                                 EntidadFinanciera = info.EntidadFinanciera ?? string.Empty,
                                 IconoEntidadFinanciera = !string.IsNullOrWhiteSpace(info.IconoEntidadFinanciera)
                                   ? "img/" + info.IconoEntidadFinanciera.Trim()
                                   : "img/logo-banco-default.png",
                                 Monto = info.Monto ?? 0,
                                 Plazo = info.Plazo ?? string.Empty,
                                 NumeroProyectos = info.NumeroProyectos ?? 0,
                                 PeriodoGracia = info.PeriodoDeGracia ?? string.Empty,
                                 TasaInteres = info.TasaInteres ?? "",
                                 PorcentajeEjecucion = (info.PorcentajeEjecucionPresupuestal ?? 0) * 100,
                                 FechaContrato = !string.IsNullOrEmpty(info.FechaContrato)
                                   ? DateTime.Parse(info.FechaContrato).ToString("dd-MMM-yyyy", new CultureInfo("es-CO"))
                                   : "-",
                                 UrlContrato = info.URLContrato ?? string.Empty

                             }).OrderBy(x => x.IdEntidadFinanciera).ToList();


            return resultado ?? new List<itemCredito>();

        }
        
        public infoFuentesRecursos getCorteInfo()
        {
            infoFuentesRecursos objReturn = new();
            infoFuentesRecursos fuentesDeLosRecursos = (from fuente in _connection.FuenteDeLosRecursos
                                                              where fuente.IdFuente == 4   //empréstitos
                                                              select new infoFuentesRecursos
                                                              {
                                                                  IdFuente = fuente.IdFuente,
                                                                  NombreFuente = fuente.NombreFuente,
                                                                  Descripcion = fuente.Descripcion,
                                                                  FechaActualizacionFuente = fuente.FechaActualizacionFuente,
                                                                  FechaCorteFuente = fuente.FechaCorteFuente
                                                              }).FirstOrDefault();
            objReturn = fuentesDeLosRecursos;
            return objReturn;
        }

        public List<itemProyecto> GetProyectosPerCredito(string CodEntidad)
        {
            List<itemProyecto> resultado = new List<itemProyecto>();

            resultado = (from info in _connection.VwProyectosCreditos
                         where info.IdEntidadFinanciera == CodEntidad
                         select new itemProyecto
                         {
                             Id = (info.IdProyecto ?? 0).ToString(),
                             Nombre = info.NombreProyecto ?? "",
                             Bpin = info.CodigoBPIN,
                             ValorInicial = info.ValorProyectoInicial?? 0,
                             ValorEjecutado = info.ValorEjecutado ?? 0,
                             ValorFinanciado = info.ValorFinanciado ?? 0
                         })
                  .ToList();


            return resultado;
        }

    public EntidadFinanciadora Fill(int id)
    {
      EntidadFinanciadora emprestito = (from info in _connection.VwConsolidadoCreditos
                                        where info.IdEntidadFinanciera == id.ToString()
                                        select new EntidadFinanciadora
                                        {
                                          Id = info.IdEntidadFinanciera,
                                          Nombre = info.EntidadFinanciera,
                                          FechaContrato = info.FechaContrato,
                                          Monto = info.Monto ?? 0.0,
                                          Icono = !string.IsNullOrWhiteSpace(info.IconoEntidadFinanciera)
                                            ? "img/" + info.IconoEntidadFinanciera.Trim()
                                            : "img/logo-banco-default.png",
                                          PeriodoDeGracia = info.PeriodoDeGracia,
                                          Plazo = info.Plazo,
                                          PorcentajeEjecucionPresupuestal = (info.PorcentajeEjecucionPresupuestal ?? 0) * 100,
                                          ProyectosFinanciar = info.NumeroProyectos ?? 0,
                                          TasaInteres = info.TasaInteres ?? "",
                                          UrlContrato = info.URLContrato ?? string.Empty

                                        }).FirstOrDefault();
      if (emprestito != null)
      {
        emprestito.FechaContrato = !string.IsNullOrEmpty(emprestito.FechaContrato)
                            ? DateTime.Parse(emprestito.FechaContrato).ToString("dd-MMM-yyyy", new CultureInfo("es-CO"))
                            : "-";
      }
      return emprestito ?? new();
    }
  }
}

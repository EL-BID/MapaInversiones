using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Reportes
{
  public class ProyectoPdf
  {
    public ResumenProyectoPdf Resumen { get; set; }
    public InformacionGeneralProyectoPdf InformacionGeneral { get; set; }

    public InformacionFinancieraProyectoPdf InformacionFinanciera { get; set; }
    public List<ComponentesYActividadesProyectoPdf> ComponentesYActividades { get; set; }
  }

  public class ComponentesYActividadesProyectoPdf
  {
    public string CodigoComponente { get; set; }
    public List<string> ActividadesComponente { get; set; }
  }

  public class InformacionFinancieraProyectoPdf
  {
    public decimal AvanceFinanciero { get; set; }
    public decimal AvanceFisico { get; set; }
  }

  public class ResumenProyectoPdf
  {
    public string Nombre { get; set; }
    public string Objetivo { get; set; }
    public string Sector { get; set; }
    public string EntidadesTerritorialesBeneficiarias { get; set; }
    public string LocalidadesDondeSeEjecuta { get; set; }
    public string Duracion { get; set; }
    public decimal CostoEstimado { get; set; }
    public decimal CostoOtraMoneda { get; set; }
    public decimal TasaCambio { get; set; }
    public string MonedaCostoProyecto { get; set; }
  }

  public class InformacionGeneralProyectoPdf
  {
    public string InstitucionEjecutoraPrincipal { get; set; }
    public string Etapa { get; set; }
    public string Fase { get; set; }
    public string Estado { get; set; }
    public string AnioInicio { get; set; }
    public string FechaInicio { get; set; }
    public string AnioFinalizacion { get; set; }
    public string FechaFinalizacion { get; set; }
    public string CodigoBIP { get; set; }
    public string TotalBeneficiariosHombres { get; set; }
    public string TotalBeneficiariosMujeres { get; set; }


  }
}

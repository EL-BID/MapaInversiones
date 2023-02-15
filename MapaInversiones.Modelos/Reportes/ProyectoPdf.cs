using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Reportes
{
  public class ProyectoPdf
  {
    public ResumenProyectoPdf Resumen { get; set; ***REMOVED***
    public InformacionGeneralProyectoPdf InformacionGeneral { get; set; ***REMOVED***

    public InformacionFinancieraProyectoPdf InformacionFinanciera { get; set; ***REMOVED***
    public List<ComponentesYActividadesProyectoPdf> ComponentesYActividades { get; set; ***REMOVED***
  ***REMOVED***

  public class ComponentesYActividadesProyectoPdf
  {
    public string CodigoComponente { get; set; ***REMOVED***
    public List<string> ActividadesComponente { get; set; ***REMOVED***
  ***REMOVED***

  public class InformacionFinancieraProyectoPdf
  {
    public decimal AvanceFinanciero { get; set; ***REMOVED***
    public decimal AvanceFisico { get; set; ***REMOVED***
  ***REMOVED***

  public class ResumenProyectoPdf
  {
    public string Nombre { get; set; ***REMOVED***
    public string Objetivo { get; set; ***REMOVED***
    public string Sector { get; set; ***REMOVED***
    public string EntidadesTerritorialesBeneficiarias { get; set; ***REMOVED***
    public string LocalidadesDondeSeEjecuta { get; set; ***REMOVED***
    public string Duracion { get; set; ***REMOVED***
    public decimal CostoEstimado { get; set; ***REMOVED***
    public decimal CostoOtraMoneda { get; set; ***REMOVED***
    public decimal TasaCambio { get; set; ***REMOVED***
    public string MonedaCostoProyecto { get; set; ***REMOVED***
  ***REMOVED***

  public class InformacionGeneralProyectoPdf
  {
    public string InstitucionEjecutoraPrincipal { get; set; ***REMOVED***
    public string Etapa { get; set; ***REMOVED***
    public string Fase { get; set; ***REMOVED***
    public string Estado { get; set; ***REMOVED***
    public string AnioInicio { get; set; ***REMOVED***
    public string FechaInicio { get; set; ***REMOVED***
    public string AnioFinalizacion { get; set; ***REMOVED***
    public string FechaFinalizacion { get; set; ***REMOVED***
    public string CodigoBIP { get; set; ***REMOVED***
    public string TotalBeneficiariosHombres { get; set; ***REMOVED***
    public string TotalBeneficiariosMujeres { get; set; ***REMOVED***


  ***REMOVED***
***REMOVED***

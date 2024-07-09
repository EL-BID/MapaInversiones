using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
  public class InfoGraficoItemPrograma
  {
    public string Id { get; set; ***REMOVED***
    public string Nombre { get; set; ***REMOVED***
    public decimal presupuesto { get; set; ***REMOVED***
    public decimal avance { get; set; ***REMOVED***
    public decimal total_presupuesto { get; set; ***REMOVED***
    public decimal total_avance { get; set; ***REMOVED***
    public bool es_programa { get; set; ***REMOVED***

    #region Propiedades presupuesto emergencias
    public int IdItem { get; set; ***REMOVED***
    public string Anio { get; set; ***REMOVED***
    public string NomItem { get; set; ***REMOVED***
    public decimal porcentajeCumplimiento { get; set; ***REMOVED***
    public List<InfograficoCapitulo> Detalles { get; set; ***REMOVED***
    #endregion


    public InfoGraficoItemPrograma(string id, string nombre)
    {
      Id = id;
      Nombre = nombre;
      presupuesto = 0;
      avance = 0;
      es_programa = false;
      Detalles = new();
***REMOVED***
  ***REMOVED***
  public class InfoTablaExpandible
  {
    public string Anio { get; set; ***REMOVED***
    public string Nivel1 { get; set; ***REMOVED***
    public string Nivel2 { get; set; ***REMOVED***
    public string Nivel3 { get; set; ***REMOVED***
    public decimal ValorGastado { get; set; ***REMOVED***
    public double ValorEjecutado { get; set; ***REMOVED***
  ***REMOVED***
  public class InfograficoCapitulo
  {
    public string Anio { get; set; ***REMOVED***
    public string IdCapitulo { get; set; ***REMOVED***
    public string NomCapitulo { get; set; ***REMOVED***
    public decimal presupuesto { get; set; ***REMOVED***
    public decimal avance { get; set; ***REMOVED***
    public decimal porcentajeCumplimiento { get; set; ***REMOVED***
    public List<InfograficoConcepto> Detalles { get; set; ***REMOVED***

    public InfograficoCapitulo(string id, string nombre)
    {
      IdCapitulo = id;
      NomCapitulo = nombre;
      Detalles = new List<InfograficoConcepto>();
      Anio = string.Empty;
***REMOVED***
  ***REMOVED***
  public class InfograficoConcepto
  {
    public string Anio { get; set; ***REMOVED***
    public string IdConcepto { get; set; ***REMOVED***
    public string NomConcepto { get; set; ***REMOVED***
    public decimal presupuesto { get; set; ***REMOVED***
    public decimal avance { get; set; ***REMOVED***
    public decimal porcentajeCumplimiento { get; set; ***REMOVED***
    public List<InfograficoCuentaGasto> Detalles { get; set; ***REMOVED***

    public InfograficoConcepto(string id, string nombre)
    {
      IdConcepto = id;
      NomConcepto = nombre;
      Detalles = new List<InfograficoCuentaGasto>();
      Anio = string.Empty;
***REMOVED***
  ***REMOVED***
  public class InfograficoCuentaGasto
  {
    public string cod_cuenta { get; set; ***REMOVED***
    public string nom_cuenta { get; set; ***REMOVED***
    public decimal presupuesto { get; set; ***REMOVED***
    public decimal avance { get; set; ***REMOVED***

    public InfograficoCuentaGasto(string codigo, string nombre, decimal valor_presupuesto, decimal valor_avance)
    {
      cod_cuenta = codigo;
      nom_cuenta = nombre;
      presupuesto = valor_presupuesto;
      avance = valor_avance;
***REMOVED***

  ***REMOVED***
***REMOVED***

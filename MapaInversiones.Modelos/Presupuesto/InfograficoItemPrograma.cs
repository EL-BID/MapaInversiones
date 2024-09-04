using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
  public class InfoGraficoItemPrograma
  {
    public string Id { get; set; }
    public string Nombre { get; set; }
    public decimal presupuesto { get; set; }
    public decimal avance { get; set; }
    public decimal total_presupuesto { get; set; }
    public decimal total_avance { get; set; }
    public bool es_programa { get; set; }

    #region Propiedades presupuesto emergencias
    public int IdItem { get; set; }
    public string Anio { get; set; }
    public string NomItem { get; set; }
    public decimal porcentajeCumplimiento { get; set; }
    public List<InfograficoCapitulo> Detalles { get; set; }
    #endregion


    public InfoGraficoItemPrograma(string id, string nombre)
    {
      Id = id;
      Nombre = nombre;
      presupuesto = 0;
      avance = 0;
      es_programa = false;
      Detalles = new();
    }
  }
  public class InfoTablaExpandible
  {
    public string Anio { get; set; }
    public string Nivel1 { get; set; }
    public string Nivel2 { get; set; }
    public string Nivel3 { get; set; }
    public decimal ValorGastado { get; set; }
    public double ValorEjecutado { get; set; }
  }
  public class InfograficoCapitulo
  {
    public string Anio { get; set; }
    public string IdCapitulo { get; set; }
    public string NomCapitulo { get; set; }
    public decimal presupuesto { get; set; }
    public decimal avance { get; set; }
    public decimal porcentajeCumplimiento { get; set; }
    public List<InfograficoConcepto> Detalles { get; set; }

    public InfograficoCapitulo(string id, string nombre)
    {
      IdCapitulo = id;
      NomCapitulo = nombre;
      Detalles = new List<InfograficoConcepto>();
      Anio = string.Empty;
    }
  }
  public class InfograficoConcepto
  {
    public string Anio { get; set; }
    public string IdConcepto { get; set; }
    public string NomConcepto { get; set; }
    public decimal presupuesto { get; set; }
    public decimal avance { get; set; }
    public decimal porcentajeCumplimiento { get; set; }
    public List<InfograficoCuentaGasto> Detalles { get; set; }

    public InfograficoConcepto(string id, string nombre)
    {
      IdConcepto = id;
      NomConcepto = nombre;
      Detalles = new List<InfograficoCuentaGasto>();
      Anio = string.Empty;
    }
  }
  public class InfograficoCuentaGasto
  {
    public string cod_cuenta { get; set; }
    public string nom_cuenta { get; set; }
    public decimal presupuesto { get; set; }
    public decimal avance { get; set; }

    public InfograficoCuentaGasto(string codigo, string nombre, decimal valor_presupuesto, decimal valor_avance)
    {
      cod_cuenta = codigo;
      nom_cuenta = nombre;
      presupuesto = valor_presupuesto;
      avance = valor_avance;
    }

  }
}

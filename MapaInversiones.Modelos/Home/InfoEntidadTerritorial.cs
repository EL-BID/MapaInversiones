namespace PlataformaTransparencia.Modelos.Home
{
    public class InfoEntidadTerritorial
    {
        public string Id { get; set; }=string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public int CantidadProyectos { get; set; }
        public int NumeroProyectosPDL { get; set; }
        public int NumeroProyectosPOT { get; set; }
        public decimal ValorProyectos { get; set; }
        public string UrlImg { get; set; } = string.Empty;
        public string LinkLocationProfile { get; set; } = string.Empty;
    }
}

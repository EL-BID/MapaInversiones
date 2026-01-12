namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class ModelDataInformacionPresupuestalPorClasificacionDeFondo
    {
        public int IdClasificacion { get; set; }
        public string ClasificacionFondo { get; set; } = string.Empty;
        public decimal PresupuestoAsignado { get; set; }
        public decimal PresupuestoObligado { get; set; }
        public decimal Porcentaje { get; set; }
    }
}

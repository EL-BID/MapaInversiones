namespace PlataformaTransparencia.Modelos
{
  public class itemPrograma
    {
        public int orden { get; set; }
        public string nombre { get; set; }
        public bool estado { get; set; }
        public bool externo { get; set; }
        public decimal? valor { get; set; }
        public string label_nombre { get; set; }
        public string label_valor { get; set; }
        public long cantBeneficiarios { get; set; }
        public string label_beneficiarios { get; set; }
        public string label_boton { get; set; }

    }
}

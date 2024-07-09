using System;

namespace PlataformaTransparencia.Modelos
{
  public class InfoConsolidadoRecursos
    {
        public int orden { get; set; }
        public int IdItem { get; set; }
        public string NomItem { get; set; }
        public decimal total_valor { get; set; }
        public long total_beneficiarios { get; set; }
        public Boolean es_programa { get; set; }
        public Boolean externo { get; set; }
        public string label_nombre { get; set; }
        public string label_valor { get; set; }
        public string label_beneficiarios { get; set; }
        public string label_boton { get; set; }
        public string enlace_boton { get; set; }
        public string tipoenlace { get; set; }


        public InfoConsolidadoRecursos()
        {
            orden = 0;
            IdItem = 0;
            NomItem = "";
            total_valor = 0;
            total_beneficiarios = 0;
            es_programa = false;
            label_nombre = "";
            label_beneficiarios = "";
            label_boton = "";
            enlace_boton = "";
            tipoenlace = "";
        }

    }
}

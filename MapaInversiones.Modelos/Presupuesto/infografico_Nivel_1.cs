using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Presupuesto
{
    public  class infografico_Nivel_1
    {
        public string Id { get; set; }
        public string Nombre { get; set; }

        public double Vigente { get; set; }
        public double Ejecutado { get; set; }

        public double ValorComprometido { get; set; }

        public double ValorGiros { get; set; }

        public List<infografico_Nivel_2> Detalles { get; set; }

        public infografico_Nivel_1(string id, string nombre)
        {
            Id = id;
            Nombre = nombre;
            Detalles = new List<infografico_Nivel_2>();
            Vigente = 0;
            Ejecutado = 0;
            ValorComprometido = 0;
            ValorGiros = 0;
        }
    }
}

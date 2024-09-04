using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Proyectos
{
    public class ModeloAvanceFinancieroPorComponenteProducto
    {
        public int IdentificadorFase { get; set; }
        public string Fase { get; set; }
        public int CodComponente { get; set; }
        public string Componente { get; set; }
        public int idProducto { get; set; }
        public string Producto { get; set; }
        public string UnidadProducto { get; set; }
        public double? Meta { get; set; }
        public double? Ejecutado { get; set; }
        public double? AvanceFisico { get; set; }
    }
}

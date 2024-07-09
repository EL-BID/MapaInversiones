using PlataformaTransparencia.Modelos.Proyectos;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.OrganismoFinanciador
{

    public class ModelDataConsolidadoFinanciador : RespuestaContratoBase
    {
        public List<ModelDataFinanciador> Financiadores { get; set; ***REMOVED*** = new();
        public int TotalFinanciadores { get; set; ***REMOVED***
        public int TotalProyectosFinanciados { get; set; ***REMOVED***
        public double TotalAportado { get; set; ***REMOVED***
***REMOVED***

    public class ModelDataFinanciador
    {
        public int CodigoOrganismo { get; set; ***REMOVED***
        public string Nombre { get; set; ***REMOVED*** = string.Empty;
        public double MontoFinanciado { get; set; ***REMOVED***
        public List<Item> Estados { get; set; ***REMOVED*** = new();
        public int ProyectosFinanciados { get; set; ***REMOVED***
        public List<ModelDataConsolidadosPorOrganismoFinanciador> MontosPorFuenteFinanciacion { get; set; ***REMOVED*** = new();
***REMOVED***

    public class ModelDataConsolidadosPorOrganismoFinanciador
    {
        public int Anio { get; set; ***REMOVED***
        public int CodigoOrganismo { get; set; ***REMOVED***
        public string Fuente { get; set; ***REMOVED*** = string.Empty;
        public string Organismo { get; set; ***REMOVED*** = string.Empty;
        public double Aprobado { get; set; ***REMOVED***
        public double Vigente { get; set; ***REMOVED***
***REMOVED***

    public class ModelDataProyectosPorOrganismoFinanciador
    {
        public int Anio { get; set; ***REMOVED***
        public int CodigoOrganismo { get; set; ***REMOVED***
        public int EstadoId { get; set; ***REMOVED***
        public string Organismo { get; set; ***REMOVED*** = string.Empty;
        public string Estado { get; set; ***REMOVED*** = string.Empty;
        public int TotalProyectos { get; set; ***REMOVED***
***REMOVED***
***REMOVED***

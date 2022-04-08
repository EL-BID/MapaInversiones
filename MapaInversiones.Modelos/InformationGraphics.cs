using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class InformationGraphics
    {
        /// <summary>
        /// Descripcion del item que se va a sacar
        /// </summary>
        ///<remarks>Por ejemplo Nombre sector, Nombre recurso</remarks>
        ///
        public string labelGroup { get; set; ***REMOVED***
        public string label { get; set; ***REMOVED***
        public string label_inf { get; set; ***REMOVED***
        public string label_nivel4 { get; set; ***REMOVED***
        /// <summary>
        /// Porcentaje del item.
        /// </summary>
        public string value { get; set; ***REMOVED***
        /// <summary>
        /// Número de registros del item que se va a sacar
        /// </summary>
        public decimal rawValue { get; set; ***REMOVED***
        public decimal rawValue_asoc { get; set; ***REMOVED***
        public double rawValueDouble { get; set; ***REMOVED***
        public int rawValueInt { get; set; ***REMOVED***
        public decimal porcentaje { get; set; ***REMOVED***
***REMOVED***

    public class InfoRecursosEmergenciaPerObjeto : InformationGraphics
    {

***REMOVED***

    public class InfoPresupuesto : InformationGraphics
    {
        public decimal? totalGasto { get; set; ***REMOVED***
        public decimal? totalPresupuesto { get; set; ***REMOVED***
        public decimal? totalMH { get; set; ***REMOVED***
        public decimal? totalClasificacion { get; set; ***REMOVED***
        public decimal? totalClasePrograma { get; set; ***REMOVED***
        public decimal? totalEntidad { get; set; ***REMOVED***
        public decimal? totalProyectoActividad { get; set; ***REMOVED***
        public int annio { get; set; ***REMOVED***
        public string trimestre { get; set; ***REMOVED***
        public string clasificacion { get; set; ***REMOVED***
        public string entidad { get; set; ***REMOVED***
        public string clasePrograma { get; set; ***REMOVED***
        public string proyectoActividad { get; set; ***REMOVED***
        public int version { get; set; ***REMOVED***
        public string nombreVersion { get; set; ***REMOVED***


***REMOVED***

    public class InfoRecAsignadosPlan : InformationGraphics { 
       public int? periodo { get; set; ***REMOVED***
***REMOVED***

    public class InfoEntidadesConsolida : InformationGraphics
    {
        public string id { get; set; ***REMOVED***

        public decimal asignado { get; set; ***REMOVED***

        public decimal avance { get; set; ***REMOVED***

        public double aporteObjetivo { get; set; ***REMOVED***
***REMOVED***
***REMOVED***

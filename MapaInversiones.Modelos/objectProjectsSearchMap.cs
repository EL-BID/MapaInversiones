﻿using Newtonsoft.Json;

namespace PlataformaTransparencia.Modelos
{
    /// <summary>
    /// Clase abstracta que permite tener varios tipos de objetos dentro del modelo
    /// </summary>
    public abstract class objectProjectsSearchMap
    {
        /// <summary>
        /// Es la latitud de la ubicacion del punto resuelto.
        /// </summary>
        public decimal latitude { get; set; ***REMOVED***
        /// <summary>
        /// Es la longitud de la ubicacion del punto resuelto.
        /// </summary>
        public decimal longitude { get; set; ***REMOVED***
        /// <summary>
        /// Es el nombre de la ubicacion del proyecto.
        /// </summary>
        public string location { get; set; ***REMOVED***
        /// <summary>
        /// Puede ser group,project,municipio.
        /// </summary>
        public string type { get; set; ***REMOVED***

        /// <summary>
        /// Indica si estan georefrenciados al mismo punto
        /// </summary>
        public bool UsanMismaGeorefenciacion { get; set; ***REMOVED***



***REMOVED***
    /// <summary>
    /// Herencia del objeto genérico para implementar un solo tipo de objeto en el modelo,
    /// este objeto corresponde a los proyectos agrupados
    /// </summary>
    public class objectProjectsSearchMapGroup : objectProjectsSearchMap
    {
        public objectProjectsSearchMapGroup()
        {

    ***REMOVED***
        /// <summary>
        /// Total de proyectos
        /// </summary>
        public int count { get; set; ***REMOVED***
        /// <summary>
        /// Es el valor total del valor.
        /// </summary>
        public decimal totalValue { get; set; ***REMOVED***
        /// <summary>
        /// Total regalías y otras fuentes
        /// </summary>
        public decimal approvedTotalMoney { get; set; ***REMOVED***
***REMOVED***
    /// <summary>
    /// Herencia del objeto genérico para implementar un solo tipo de objeto en el modelo,
    /// este objeto corresponde a los proyectos
    /// </summary>
    public class objectProjectsSearchMapProject : objectProjectsSearchMap
    {
        public objectProjectsSearchMapProject()
        {
    ***REMOVED***
        /// <summary>
        /// Es el nombre del proyecto
        /// </summary>
        public string name { get; set; ***REMOVED***
        /// <summary>
        /// Es el valor del proyecto.
        /// </summary>
        public decimal value { get; set; ***REMOVED***
        /// <summary>
        /// Es el estado del proyecto. TODO Revisar cuando se tenga la tabla de estados. 
        /// </summary>
        public string state { get; set; ***REMOVED***
        /// <summary>
        /// Es la url del proyecto cuando se arme toca pasar el
        /// id depende del Contract a donde se va a redireccionar. TODO Revisar si el contrato cambia. si se puede hacer dinamico.
        /// </summary>
        public string url { get; set; ***REMOVED***
        /// <summary>
        /// Es la url del proyecto. de tamaño pequeño.
        /// </summary>
        public string image { get; set; ***REMOVED***
        /// <summary>
        /// Total regalías y otras fuentes
        /// </summary>
        public decimal approvedTotalMoney { get; set; ***REMOVED***

        public string ejecutor { get; set; ***REMOVED***
***REMOVED***
    /// <summary>
    /// Herencia del objeto genérico para implementar un solo tipo de objeto en el modelo,
    /// este objeto corresponde a los objetos de tipo ente territorial
    /// </summary>
    public class ObjectProjectsSearchMapGeography : objectProjectsSearchMap
    {
        /// <summary>
        /// Es el id del municipio
        /// </summary>
        public string id { get; set; ***REMOVED***
        /// <summary>
        /// total dinero aprobado por regalías
        /// </summary>
        [JsonProperty(PropertyName = "approvedMoney")]
        public decimal value { get; set; ***REMOVED***
        /// <summary>
        /// Numero total de municipios por
        /// proyecto.
        /// </summary>
        [JsonProperty(PropertyName = "projectNumber")]
        public int total { get; set; ***REMOVED***
        /// <summary>
        /// Total regalías y otras fuentes
        /// </summary>
        public decimal approvedTotalMoney { get; set; ***REMOVED***
***REMOVED***
***REMOVED***

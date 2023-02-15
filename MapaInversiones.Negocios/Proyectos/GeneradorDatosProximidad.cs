﻿using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Interfaces;
using PlataformaTransparencia.Negocios.Proyectos;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;

namespace PlataformaTransparencia.Negocios.Proyectos
{
    public class GeneradorDatosProximidad : IGeneradorDatosProximidad
    {

        public int TotalCantidadProyectos { get; set; ***REMOVED***
        public decimal TotalValorRegalias { get; set; ***REMOVED***
        public decimal TotalValorTodasLasFuentes { get; set; ***REMOVED***
        private static IConfiguration Configuration;
        public GeneradorDatosProximidad(IConfiguration configuration)
        {
            Configuration = configuration;
    ***REMOVED***

        public GeneradorDatosProximidad()
        {
    ***REMOVED***
        public List<objectProjectsSearchMap> ObtenerPinesDeProyectos(int zoom, List<decimal> topLeft, List<decimal> bottomRight, List<InfoProyectos> infoProyectos, FiltroBusquedaProyecto filtro)
        {
            List<objectProjectsSearchMap> retornoProyectos = new List<objectProjectsSearchMap>();
            List<InfoProyectos> lstTotalProyectos = infoProyectos;
            List<InfoProyectos> lstParcialProyectos = null;
            ComunesGeoreferenciacion georeferenciador = new ComunesGeoreferenciacion();
            decimal segmentosCuadricula = Convert.ToDecimal(Configuration["segmentosCuadricula"]);

            if (segmentosCuadricula < 13)//Minimo cuadricula de 10
                segmentosCuadricula = 10;
            if (zoom == 6)
                segmentosCuadricula -= 2;
            if (zoom == 7)
                segmentosCuadricula -= 1;
            if (zoom < 9 && filtro.CodigosDepartamentos.Count == 0)//No hay filtro por dpto/Municipio --> Todo el pais o una region
                segmentosCuadricula -= 3;
            decimal latitudSuperior = topLeft[0];
            decimal longitudIzq = topLeft[1];
            decimal latitudInferior = bottomRight[0];
            decimal longitudDer = bottomRight[1];

            if (latitudSuperior > 16.54M)
                latitudSuperior = 16.54M;//Punto mas al norte de Honduras
            if (latitudInferior < 12.9M)
                latitudInferior = 12.9M;//Punto mas al sur de Honduras
            if (longitudIzq < -89.4M)
                longitudIzq = -89.4M;//Punto mas al Oeste de Honduras
            if (longitudDer > -83.0M)
                longitudDer = -83.0M;//Punto mas al este de Honduras

            decimal incrementoLatitud = Math.Abs(latitudSuperior - latitudInferior) / segmentosCuadricula;
            decimal incrementoLongitud = Math.Abs(longitudIzq - longitudDer) / segmentosCuadricula;

            incrementoLatitud = incrementoLongitud = decimal.Round(((incrementoLatitud + incrementoLongitud) / 2), 14);//Cuadrados  

            decimal latitudActual = latitudSuperior;
            decimal longitudActual = longitudIzq;

            int contador = 0;
            bool analizadosTodosLosProyectos = false;

            while (LatitudActualDentroCuadradoInicial(latitudActual - incrementoLatitud, latitudInferior))//Barrido de Arriba hacia abajo disminuyendo
            {
                longitudActual = longitudIzq;
                while (LongitudActualDentroCuadradoInicial(longitudActual + incrementoLongitud, longitudDer))//Barrido de Izquierda a derecha aumentando
                {
                    List<decimal> topLeftCuadradoActual = new List<decimal>();//GenerarListaCoordenadas(latitudSuperior, longitudIzq);
                    List<decimal> bottomRightCuadradoActual = new List<decimal>();  //GenerarListaCoordenadas(latitudActual, longitudActual);

                    topLeftCuadradoActual.Add(latitudActual);
                    topLeftCuadradoActual.Add(longitudActual);

                    bottomRightCuadradoActual.Add(latitudActual - incrementoLatitud);
                    bottomRightCuadradoActual.Add(longitudActual + incrementoLongitud);

                    lstParcialProyectos = (georeferenciador.FiltrarProyectosPorCoordenadas5(lstTotalProyectos, topLeftCuadradoActual, bottomRightCuadradoActual));
                    lstTotalProyectos = lstTotalProyectos.Except(lstParcialProyectos).ToList();

                    int cantidadProyectos = lstParcialProyectos.Count;
                    if (cantidadProyectos > 1) {
                        retornoProyectos.Add(GenerarDataProyectoGrupal(lstParcialProyectos, cantidadProyectos));
                ***REMOVED***
                    else if (cantidadProyectos == 1) {
                        retornoProyectos.Add(GenerarDataProyectoIndividual(lstParcialProyectos.First()));
                ***REMOVED***
                    longitudActual = longitudActual + incrementoLongitud;
                    contador++;
                    //System.Diagnostics.Trace.WriteLine(string.Format("Restan {0***REMOVED*** proyectos por evaluar en proximidad.", lstTotalProyectos.Count.ToString()));
                    if (lstTotalProyectos.Count == 0) {
                        System.Diagnostics.Trace.WriteLine(string.Format("Salida del algoritmo de proximidad (Proyectos evacuados) luego de {0***REMOVED*** ciclos.", contador.ToString()));
                        analizadosTodosLosProyectos = true;
                        break;
                ***REMOVED***
            ***REMOVED***
                if (analizadosTodosLosProyectos)
                    break;
                latitudActual = latitudActual - incrementoLatitud;
        ***REMOVED***
            System.Diagnostics.Trace.WriteLine(string.Format("Terminado algoritmo de proximidad luego de {0***REMOVED*** ciclos.", contador.ToString()));

            return retornoProyectos;
    ***REMOVED***

        private bool LongitudActualDentroCuadradoInicial(decimal longitudDerechaActual, decimal longitudInferiorLimite)
        {
            return longitudDerechaActual < longitudInferiorLimite;
    ***REMOVED***

        private bool LatitudActualDentroCuadradoInicial(decimal latitudInferiorActual, decimal latitudInferiorLimite)
        {
            if (latitudInferiorActual >= 0)//Coordenadas Positivas
            {
                return latitudInferiorActual > latitudInferiorLimite;
        ***REMOVED***
            else //Abajo ecuador coordenadas negativas
            {
                return Math.Abs(latitudInferiorActual) < Math.Abs(latitudInferiorLimite);
        ***REMOVED***
    ***REMOVED***

        //private objectProjectsSearchMapProject GenerarDataProyectoIndividual2(InfoProyectos infoProyectos)
        //{
        //    objectProjectsSearchMapProject retonroProyecto = new objectProjectsSearchMapProject();

        //    retonroProyecto.name = infoProyectos.NombreProyecto.ToUpper();
        //    retonroProyecto.state = infoProyectos.State;
        //    retonroProyecto.image = BusquedasProyectosBLL.GenerarUrlImagenProyecto(infoProyectos.IdProyecto);
        //    retonroProyecto.url = string.Format(CommonConstants.ServicesLink, infoProyectos.IdProyecto);
        //    retonroProyecto.value = Math.Round(infoProyectos.Value);
        //    retonroProyecto.approvedTotalMoney = Math.Round(infoProyectos.approvedTotalMoney);
        //    retonroProyecto.type = CommonConstants.ProjectsEnSingular;
        //    retonroProyecto.latitude = (decimal)infoProyectos.Geography.Latitude;
        //    retonroProyecto.longitude = (decimal)infoProyectos.Geography.Longitude;

        //    //Si en el campo de la georefrenciacion viene el codigo de un municipio entonces se muestra el nombre
        //    var municipios = ConsultasComunes.ObtenerMunicipio(new List<string>() { infoProyectos.Location ***REMOVED***);
        //    if (municipios.Count > 0)
        //        retonroProyecto.location = municipios.FirstOrDefault().NombreMunicipio;
        //    else
        //        retonroProyecto.location = string.Empty;
        //    TotalCantidadProyectos++;//juanka
        //    TotalValorRegalias += retonroProyecto.value;
        //    TotalValorTodasLasFuentes += retonroProyecto.approvedTotalMoney;

        //    return retonroProyecto;
        //***REMOVED***

        private objectProjectsSearchMapProject GenerarDataProyectoIndividual(InfoProyectos infoProyectos)
        {
            objectProjectsSearchMapProject retonroProyecto = new objectProjectsSearchMapProject();

            retonroProyecto.name = infoProyectos.NombreProyecto.ToUpper();
            retonroProyecto.state = infoProyectos.State;
            retonroProyecto.image = BusquedasProyectosBLL.GenerarUrlImagenProyecto(infoProyectos.IdProyecto);
            retonroProyecto.url = string.Format(CommonConstants.ServicesLink, infoProyectos.IdProyecto);
            retonroProyecto.value = Math.Round(infoProyectos.Value);
            retonroProyecto.approvedTotalMoney = Math.Round(infoProyectos.approvedTotalMoney);
            retonroProyecto.type = CommonConstants.ProjectsEnSingular;
            retonroProyecto.latitude = (decimal)infoProyectos.Geography.Latitude;
            retonroProyecto.longitude = (decimal)infoProyectos.Geography.Longitude;
            retonroProyecto.location = infoProyectos.NombreMunicipio;

            TotalCantidadProyectos++;//juanka
            TotalValorRegalias += retonroProyecto.value;
            TotalValorTodasLasFuentes += retonroProyecto.approvedTotalMoney;

            return retonroProyecto;
    ***REMOVED***

        private objectProjectsSearchMapGroup GenerarDataProyectoGrupal(List<InfoProyectos> infoProyectos, int cantidadProyectos)
        {
            objectProjectsSearchMapGroup retonroProyecto = new objectProjectsSearchMapGroup();

            retonroProyecto.count = cantidadProyectos;//infoProyectos.Count();
            retonroProyecto.latitude = (decimal)infoProyectos.First().Geography.Latitude;
            retonroProyecto.longitude = (decimal)infoProyectos.First().Geography.Longitude;
            retonroProyecto.location = infoProyectos.First().Location;
            retonroProyecto.totalValue = Math.Round(infoProyectos.Sum(p => p.Value));
            retonroProyecto.approvedTotalMoney = Math.Round(infoProyectos.Sum(p => p.approvedTotalMoney));
            retonroProyecto.type = CommonConstants.ProjectsGroup;

            TotalCantidadProyectos += retonroProyecto.count;
            TotalValorRegalias += retonroProyecto.totalValue;
            TotalValorTodasLasFuentes += retonroProyecto.approvedTotalMoney;

            #region DETERMINAR SI TODOS LOS PROYECTOS ESTAN EN LA MISMA UBICACION
            int cantidadUbicaciones = (from proyecto in infoProyectos
                                       select new {
                                           proyecto.Geography.Latitude,
                                           proyecto.Geography.Longitude
                                   ***REMOVED***).Distinct().Count();

            if (infoProyectos.Count > 1
                && cantidadUbicaciones == 1) {
                retonroProyecto.UsanMismaGeorefenciacion = true;
        ***REMOVED***
            #endregion

            return retonroProyecto;
    ***REMOVED***



***REMOVED***



***REMOVED***
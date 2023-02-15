﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace PlataformaTransparencia.Modelos.Comunes 
{
    [Serializable]
    public class PeriodoDeTiempo
    {


        #region Properties
        public int AñoInicial {get;set;***REMOVED***


        public int AñoFinal { get; set; ***REMOVED***

        public List<int> FechasEjecucion { get; set; ***REMOVED***
        #endregion

        public PeriodoDeTiempo()
        {
            //AND Temporal
            FechasEjecucion = new List<int>();
            AñoInicial = 2013;
            AñoFinal = DateTime.Today.Year + 4;
            //CMC: Comite tecnico 19 de Junio de 2013: a.	Los periodos se comparten durante todo el aplicativo b.	Los periodos saldrán a partir del 2012 al año actual +2           
            ConstruirListaDeAños(AñoInicial, AñoFinal);
    ***REMOVED***

        [ExcludeFromCodeCoverage]
        private void ConstruirListaDeAños(int añoInicio, int añoFin)
        {
            int añoMaximo = añoFin;
            int añoAgregar = añoInicio;

            do
            {
                this.FechasEjecucion.Add(añoAgregar);
                añoAgregar++;
        ***REMOVED***
            while (añoAgregar <= añoMaximo);
    ***REMOVED***

     

***REMOVED***
***REMOVED***

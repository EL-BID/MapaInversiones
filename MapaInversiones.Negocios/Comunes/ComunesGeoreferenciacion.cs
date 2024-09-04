using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Proyectos;
using System.Data.Entity.Spatial;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Types;

namespace PlataformaTransparencia.Negocios.Comunes
{
    public class ComunesGeoreferenciacion
    {
        internal List<InfoProyectos> FiltrarProyectosPorCoordenadas5(List<InfoProyectos> lstProyectos, List<decimal> topLeft, List<decimal> bottomRight)
        {
            DbGeography poligonoInicial = ObtenerCuadradoPorCoordenadas2(topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]);

            return lstProyectos.FindAll(p => poligonoInicial.Intersects(p.Geography));
        }

        /// <summary>
        /// obtiene un dato tipo geography polygon que representa un cuadrado, a partir de la latitud
        /// y la longitud de dos coordenadas
        /// </summary>
        /// <param name="CoordinateX1">longitud primera coordenada</param>
        /// <param name="CoordinateY1">latitud primera coordenada</param>
        /// <param name="CoordinateX2">longitud segunda coordenada</param>
        /// <param name="CoordinateY2">latitud segunda coordenada</param>
        /// <returns>ceography polygon cuadrado</returns>
        internal DbGeography ObtenerCuadradoPorCoordenadas2(decimal CoordinateY1, decimal CoordinateX1, decimal CoordinateY2, decimal CoordinateX2)
        {
            string CoordinateY1Str = CoordinateY1.ToString().Replace(',', '.');
            string CoordinateX1Str = CoordinateX1.ToString().Replace(',', '.');
            string CoordinateY2Str = CoordinateY2.ToString().Replace(',', '.');
            string CoordinateX2Str = CoordinateX2.ToString().Replace(',', '.');

            StringBuilder textoFormateado = new StringBuilder();
            textoFormateado.Append("POLYGON ((");
            textoFormateado.AppendFormat("{0} {1},", CoordinateX1Str, CoordinateY2Str);
            textoFormateado.AppendFormat("{0} {1},", CoordinateX2Str, CoordinateY2Str);
            textoFormateado.AppendFormat("{0} {1},", CoordinateX2Str, CoordinateY1Str);
            textoFormateado.AppendFormat("{0} {1},", CoordinateX1Str, CoordinateY1Str);
            textoFormateado.AppendFormat("{0} {1}", CoordinateX1Str, CoordinateY2Str);
            textoFormateado.Append("))");

            //string textoPoligono = string.Format("POLYGON(({0} {1}, {2} {3}, {4} {5}, {6} {7}, {0} {1}))", CoordinateX1Str, CoordinateY2Str, CoordinateX2Str, CoordinateY2Str, CoordinateX2Str, CoordinateY1Str, CoordinateX1Str, CoordinateY1Str);

            var sqlGeography = SqlGeography.STGeomFromText(new SqlChars(textoFormateado.ToString()), 4326).MakeValid();

            var invertedSqlGeography = sqlGeography.ReorientObject();

            if (sqlGeography.STArea() > invertedSqlGeography.STArea()) {
                sqlGeography = invertedSqlGeography;
            }

            return DbSpatialServices.Default.GeographyFromProviderValue(sqlGeography);
        }

        public static DbGeography ObtenerCuadradoRepresentaPais()
        {
            return new ComunesGeoreferenciacion().ObtenerCuadradoPorCoordenadas2(13.48M, -66.68M, -4.29M, -81.8M);
        }


    }

}

using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using PlataformaTransparencia.Negocios.Comunes;   


namespace PlataformaTransparencia.Modulo.Principal.Helpers
{
    public static class AppHtmlHelpers
    {
        public static IHtmlContent FormatoMoneda (
            this IHtmlHelper html,
            double numero,
            int decimales = 1,
            int nivel = 0
        )
        {
            var texto = ManejoNumeros.EscalaNumericaString(
                numero,
                decimales: decimales,
                nivel: nivel
            );

            return new HtmlString(texto);
        }


        public static IHtmlContent FormatoMonedaDecimal(
            this IHtmlHelper html,
            decimal? numero,
            int decimales = 1,
            int nivel = 0
        )
        {
            var texto = ManejoNumeros.EscalaNumericaDecimalString(
                numero,
                decimales: decimales,
                nivel: nivel
            );

            return new HtmlString(texto);
        }

        public static IHtmlContent FormatoNumero(
            this IHtmlHelper html,
            object valor,
            int decimales = 1
        )
        {
            var texto = ManejoNumeros.FormatearNumero(
                valor,
                decimales: decimales
            );
            return new HtmlString(texto);
        }

    }
    
}

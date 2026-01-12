using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace PlataformaTransparencia.Negocios.Comunes
{
  public class ManejoNumeros
  {
        //--------------------------------------------------------------------
        // Configuración centralizada - cambiar aquí para todo el sistema
        private const string CULTURA_PAIS = "es-CO";
        private static readonly string SEPARADOR_DECIMAL = ",";
        private static readonly string SEPARADOR_MILES = ".";
        //---------------------------------------------------------------------

    /// <summary>
        /// Devuelve el porcentaje 
        /// </summary>
        /// <param name="valor">valor que se quiere imprimir</param>
        /// <param name="cultura">codigo para la cultura ejemplo "es-CO"</param>
        /// <param name="decimales">Opcional, cantidad de decimales a mostrar </param>
        /// <param name="nivel">Opcional, sirve para indicar desde cual nivel se quiere hacer el ajuste, 
        /// Si no se incluye se toma el valor por defecto 0 y se realiza todo el proceso, si es 1 se asume que el valor viene ya en millones, si es 2 viene en billones
        /// </param>
        /// <returns>númer que representa el porcentaje en texto</returns>
    public static string EscalaNumericaString(double numero, string cultura = CULTURA_PAIS, int decimales = 0, int nivel = 0)
        {
              IFormatProvider cultureCountry = new CultureInfo(cultura);


              string[] singulares = { "millón", "billón", "trillón", "cuatrillón", "quintillón", "sextillón" };
              string[] plurales = { "millones", "billones", "trillones", "cuatrillones", "quintillones", "sextillones" };


              int escalaActual = nivel;
              double valor = numero;
              double divisorBase = 1_000_000; // millón como base de salto

              while (escalaActual < plurales.Length - 1 && valor >= divisorBase)
              {
                valor /= divisorBase;
                escalaActual++;
              }

              // Si no alcanza ni a millones y el nivel es 0, no mostramos sufijo
              if (nivel == 0 && escalaActual == 0)
              {
                return valor.ToString($"N{decimales}", cultureCountry);
              }

              // Para obtener el sufijo correcto:
              //   escalaActual = 1 → sufijo[0] = millones
              //   escalaActual = 2 → sufijo[1] = billones
              int sufijoIndice = escalaActual - 1;

              string sufijo = valor == 1 ? singulares[sufijoIndice] : plurales[sufijoIndice];
              return $"{valor.ToString($"N{decimales}", cultureCountry)} {sufijo}";
        }
    /// <summary>
    /// Devuelve el porcentaje 
    /// </summary>
    /// <param name="valor">valor que se quiere imprimir</param>
    /// <param name="cultura">codigo para la cultura ejemplo "es-CO"</param>
    /// <param name="decimales">Opcional, cantidad de decimales a mostrar </param>
    /// <param name="nivel">Opcional, sirve para indicar desde cual nivel se quiere hacer el ajuste, 
    /// Si no se incluye se toma el valor por defecto 0 y se realiza todo el proceso, si es 1 se asume que el valor viene ya en millones, si es 2 viene en billones
    /// </param>
    /// <returns>númer que representa el porcentaje en texto</returns>
    public static string EscalaNumericaDecimalString(decimal? numero, string cultura = CULTURA_PAIS, int decimales = 0, int nivel = 0)
    {
      IFormatProvider cultureCountry = new CultureInfo(cultura);


      string[] singulares = { "millón", "billón", "trillón", "cuatrillón", "quintillón", "sextillón" };
      string[] plurales = { "millones", "billones", "trillones", "cuatrillones", "quintillones", "sextillones" };


      int escalaActual = nivel;
      decimal valor = numero ?? 0;
      decimal divisorBase = 1_000_000; // millón como base de salto

      while (escalaActual < plurales.Length - 1 && valor >= divisorBase)
      {
        valor /= divisorBase;
        escalaActual++;
      }

      // Si no alcanza ni a millones y el nivel es 0, no mostramos sufijo
      if (nivel == 0 && escalaActual == 0)
      {
        return valor.ToString($"N{decimales}", cultureCountry);
      }

      // Para obtener el sufijo correcto:
      //   escalaActual = 1 → sufijo[0] = millones
      //   escalaActual = 2 → sufijo[1] = billones
      int sufijoIndice = escalaActual - 1;

      string sufijo = valor == 1 ? singulares[sufijoIndice] : plurales[sufijoIndice];
      return $"{valor.ToString($"N{decimales}", cultureCountry)} {sufijo}";
    }


    public static string FormatearNumero(object valor, int decimales = 1)
        {
            decimal cantidad;
            if (valor != null)
            {
                try
                {
                    cantidad = Convert.ToDecimal(valor);
                }
                catch
                {
                    cantidad = 0m;
                }
            }
            else
            {
                cantidad = 0m;
            }

           
            var cultura = new CultureInfo(CULTURA_PAIS,false);
            return string.Format(cultura, $"{{0:n{decimales}}}", cantidad);
            
        }




    }
}

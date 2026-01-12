using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Project;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using YesSql.Services;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Auth
{
    public class authController : Controller
    {
        private readonly IConfiguration _config;
        private readonly TransparenciaDB _connection;
        public authController(IConfiguration config, TransparenciaDB connection)
        {
            _connection = connection;
            _config = config;
        }

        [HttpGet("auth/callback")]
        public IActionResult callback()
        {
            return View();
        }

        [HttpPost("auth/intercambiarcodigo")]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> IntercambiarCodigo([FromBody] CodigoRequest request)
        {
            if (string.IsNullOrEmpty(request.code) || string.IsNullOrEmpty(request.verifier))
                return BadRequest("Código o verificador faltante.");

            var data = new Dictionary<string, string>
            {
                ["grant_type"] = "authorization_code",
                ["code"] = request.code,
                ["redirect_uri"] = _config["GabAuth:RedirectUrl"],
                ["client_id"] = _config["GabAuth:BasicAuth"], 
                ["code_verifier"] = request.verifier
            };

            using (var client = new HttpClient())
            {
                var response = await client.PostAsync(
                    _config["GabAuth:TokenUrl"],
                    new FormUrlEncodedContent(data)
                );

                var content = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, content);

                dynamic tokens = JsonConvert.DeserializeObject(content);

                HttpContext.Session.SetString("AccessToken", (string)tokens.access_token);
                HttpContext.Session.SetString("IdToken", (string)tokens.id_token);

                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", (string)tokens.access_token);

                var userResponse = await client.GetAsync(_config["GabAuth:UserInfoUrl"]); 
                var userInfo = await userResponse.Content.ReadAsStringAsync();
                dynamic user = JsonConvert.DeserializeObject(userInfo);

                ParticipacionCiudadana part = new ParticipacionCiudadana(_connection);
                ModelDataParticipacion participacion = new ModelDataParticipacion();
                participacion.usuarios = part.ValidaLogin((string)user.email, "", "N");

               

                if (participacion.usuarios == null)
                {
                    // int tmp;
                    string idNumber = Convert.ToString(user.identificationNumber);

                    int? cedula = null;

                    if (!string.IsNullOrWhiteSpace(idNumber) && int.TryParse(idNumber, out int tmp))
                    {
                        cedula = tmp;
                    }
                    string[] rta = part.RegistroNuevoUsuario((string)user.fullName, (string)user.email, "",null,null,null,null, cedula).Split("<||>");
                    if (rta[0] == "0")
                    {
                        participacion.usuarios = new itemUsuarios();
                        participacion.usuarios.IdUsuario = int.Parse(rta[1]);
                    }
                    else
                    {
                        return BadRequest("No se pudo registrar el usuario.");
                    }
                    
                        
                }

                HttpContext.Session.SetString("UserInfo", userInfo);
                HttpContext.Session.SetString("IdUsuario", participacion.usuarios.IdUsuario.ToString());
                HttpContext.Session.SetString("IdNumber", (string)user.identificationNumber);
                HttpContext.Session.SetString("NomUsuario", (string)user.fullName);



                return Ok(new
                {
                    ok = true,
                    access_token = (string)tokens.access_token,
                    id_token = (string)tokens.id_token
                });
            }
        }

         

        public class CodigoRequest
        {
            public string code { get; set; }
            public string verifier { get; set; }
        }

        [HttpGet("auth/obtenerusuario")]
        public IActionResult ObtenerUsuario()
        {
            var userInfoJson = HttpContext.Session.GetString("UserInfo");
            if (string.IsNullOrEmpty(userInfoJson))
                return Unauthorized("No hay usuario autenticado.");

            return Content(userInfoJson, "application/json");
        }

        [HttpGet("auth/logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok(new { message = "Sesión terminada" });
        }

        [HttpGet("auth/verificar")]
        public async Task<IActionResult> Verificar()
        {
            var token = HttpContext.Session.GetString("AccessToken");
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Sin token.");

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var response = await client.GetAsync(_config["GabAuth:UserInfoUrl"]);
                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    // El token ya no es válido
                    HttpContext.Session.Clear();
                    return Unauthorized("Sesión expirada o no iniciada.");
                }
                else {

                    var sess = HttpContext.Session.GetString("AccessToken");
                    if (string.IsNullOrEmpty(sess))
                        return Unauthorized("Sesión expirada o no iniciada.");
                }

                    return Ok("Token válido");
            }
        }


        [HttpGet("auth/verificarsesion")]
        public async Task<IActionResult> VerificarSesion()
        {
            var token = HttpContext.Session.GetString("UserInfo");

            // Si el servidor perdió la sesión, pero el cliente aún tiene token
            if (string.IsNullOrEmpty(token))
                return Unauthorized("Sesión terminada.");

            // Si la sesión existe
            return Ok("Sesión activa");
        }

        [HttpPost("auth/restaurar")]
        public async Task<IActionResult> RestaurarSesion()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader))
                return Unauthorized("Sin token.");

            var token = authHeader.Replace("Bearer ", "");
            HttpContext.Session.SetString("AccessToken", token);
            // Puedes además reconsultar el userInfo con el token
            return Ok("Sesión restaurada.");
        }
    }
}

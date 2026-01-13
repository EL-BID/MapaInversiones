using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;


namespace PlataformaTransparencia.Modelos.Comunes
{
    public class CorreoUtilidad
    {
        public static ModeloRespuestaCorreo envCorreoNet(string cuerpo, string corrEnv, string adj1, string adj2, string asunto, IConfiguration configuration, bool ConfirmDelete = true)
        {
            var objReturn = new ModeloRespuestaCorreo();
            string msgerrr = "";
            string[] vecCorreos = null;
            MailMessage mMailMessage = new MailMessage();
            try {
                string fromAddress = Convert.ToString(configuration["EmailSettings:from"]);

                mMailMessage.From = new MailAddress(fromAddress, "MapaInversiones República Dominicana (No Reply)");

                vecCorreos = corrEnv.Split(';');
                for (int i = 0; i <= vecCorreos.Length - 1; i++) {
                    if ((!string.IsNullOrEmpty(vecCorreos[i].ToString().Trim()))) {
                        if ((valMail(vecCorreos[i].ToString().Trim()))) {
                            mMailMessage.To.Add(new MailAddress(vecCorreos[i].ToString().Trim()));
                        }
                    }
                }


                mMailMessage.Subject = asunto;
                mMailMessage.Body = cuerpo;
                mMailMessage.IsBodyHtml = true;
                mMailMessage.Priority = MailPriority.Normal;

                if ((!string.IsNullOrEmpty(adj1))) {
                    Attachment oAttch = new Attachment(adj1, "application/pdf");
                    mMailMessage.Attachments.Add(oAttch);
                }
                if ((!string.IsNullOrEmpty(adj2))) {
                    Attachment oAttch2 = new Attachment(adj2, "application/pdf");
                    mMailMessage.Attachments.Add(oAttch2);
                }

                //Configuration configurationFile = WebConfigurationManager.OpenWebConfiguration("~/");
                //MailSettingsSectionGroup mailSettings = (MailSettingsSectionGroup)configurationFile.GetSectionGroup("system.net/mailSettings");
                
                int port = 0;
                string host = "";
                string password = "";
                string username = "";

                port = Convert.ToInt32(configuration["EmailSettings:Port"]);
                host = Convert.ToString(configuration["EmailSettings:host"]);
                password = Convert.ToString(configuration["EmailSettings:password"]);
                username = Convert.ToString(configuration["EmailSettings:username"]);

                //if (mailSettings != null) {
                //    port = mailSettings.Smtp.Network.Port;
                //    host = mailSettings.Smtp.Network.Host;
                //    password = mailSettings.Smtp.Network.Password;
                //    username = mailSettings.Smtp.Network.UserName;

                //}
                SmtpClient mSmtpClient = new SmtpClient(host, port);
                mSmtpClient.UseDefaultCredentials = false;

                mSmtpClient.EnableSsl = true;
                mSmtpClient.Credentials = new System.Net.NetworkCredential(username, password);
                ServicePointManager.ServerCertificateValidationCallback = delegate (object s, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) { return true; };
                mSmtpClient.Send(mMailMessage);

                msgerrr = "";
            }
            catch (Exception ex) {
                msgerrr = "No se envío los adjuntos a los correos " + corrEnv + " <br/>" + ex.Message;
                //insertar log de errores
            }
            finally {
                mMailMessage.Dispose();
            }

            try {
                if ((!string.IsNullOrEmpty(adj1) & ConfirmDelete)) {
                    FileInfo fileA = new FileInfo(adj1);
                    fileA.Delete();
                }
                if ((!string.IsNullOrEmpty(adj2) & ConfirmDelete)) {
                    FileInfo fileB = new FileInfo(adj2);
                    fileB.Delete();
                }

            }
            catch (Exception ex) {
                //Log de errores
                msgerrr = ex.InnerException.ToString();
            }
            finally {
                objReturn.Message = msgerrr;
                if (!string.IsNullOrEmpty(msgerrr)) {
                    objReturn.Status = false;
                }
                else {
                    objReturn.Status = true;
                }
            }
            return objReturn;


        }

        public static bool valMail(string sMail)
        {
            // retorna true o false   
            return Regex.IsMatch(sMail, "^([\\w-]+\\.)*?[\\w-]+@[\\w-]+\\.([\\w-]+\\.)*?[\\w]+$");
            //"^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$")
        }
    }
}

﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
  public class CentroayudaController : Controller
  {
    //public IActionResult Index()
    //{
    //  return View();
    //***REMOVED***
    
    public IActionResult Index(int id)
    {
      try {
        ViewData["tab"] = id;
  ***REMOVED***
      catch (Exception ex) 
      {
  ***REMOVED***
      
      return View();
***REMOVED***

    public IActionResult Contactanos()
    {
      //return Index();
      return View();
***REMOVED***
    public IActionResult Acercade()
    {
      return View();
***REMOVED***

    public IActionResult MarcoLegal()
    {
        return View();
***REMOVED***

***REMOVED***
***REMOVED***

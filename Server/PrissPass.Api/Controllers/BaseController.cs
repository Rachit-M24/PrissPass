using Microsoft.AspNetCore.Mvc;

namespace PrissPass.Api.Controllers
{
    public class BaseController : ControllerBase
    {
        protected IActionResult CreateResponse<T>(T result, int status, string message)
        {
            var response = new
            {
                result = result,
                status = status,
                message = message
            };

            return StatusCode(status, response);
        }
    }
}
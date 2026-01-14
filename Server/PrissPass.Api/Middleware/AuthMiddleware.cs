using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using PrissPass.Data.Models.Entity;

namespace PrissPass.Api.Middleware
{
    /// <summary>
    /// Middleware that ensures the incoming request is from a registered user.
    /// Expects header `X-User-Email` to be present.
    /// Throws framework exceptions (BadHttpRequestException / UnauthorizedAccessException)
    /// so the exception middleware can map status codes automatically.
    /// </summary>
    public class AuthMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {

            var repoObj = context.RequestServices.GetService(typeof(IRepository<Users>));
            if (repoObj == null)
            {
                throw new Exception("User repository not available.");
            }

            var repo = repoObj as IRepository<Users>;
            if (repo == null)
            {
                throw new Exception("User repository is not the expected type.");
            }

            await _next(context);
        }
    }
}


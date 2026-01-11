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
            if (!context.Request.Headers.TryGetValue("X-User-Email", out var emailValues) || string.IsNullOrWhiteSpace(emailValues))
            {
                throw new BadHttpRequestException("User email header missing");
            }

            var email = emailValues.ToString();

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

            var isRegistered = await repo.AnyAsync(u => u.Email == email);
            if (!isRegistered)
            {
                throw new UnauthorizedAccessException("User not registered.");
            }

            await _next(context);
        }
    }
}


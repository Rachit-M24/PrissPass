using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

namespace PrissPass.Api.Middleware
{
    /// <summary>
    /// Middleware to catch exceptions and map them to HTTP responses.
    /// Maps common framework/EF exceptions to appropriate status codes.
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            int status = StatusCodes.Status500InternalServerError;
            string message = "An unexpected error occurred.";

            switch (exception)
            {
                case BadHttpRequestException badReq:
                    status = StatusCodes.Status400BadRequest;
                    message = badReq.Message;
                    break;
                case UnauthorizedAccessException unauth:
                    status = StatusCodes.Status401Unauthorized;
                    message = unauth.Message;
                    break;
                case ArgumentException argEx:
                    status = StatusCodes.Status400BadRequest;
                    message = exception.Message;
                    break;
                case KeyNotFoundException _:
                    status = StatusCodes.Status404NotFound;
                    message = exception.Message;
                    break;
                case HttpRequestException _:
                    status = StatusCodes.Status502BadGateway;
                    message = exception.Message;
                    break;
                case DbUpdateConcurrencyException _:
                    status = StatusCodes.Status409Conflict;
                    message = exception.Message;
                    break;
                case DbUpdateException _:
                    status = StatusCodes.Status500InternalServerError;
                    message = exception.Message;
                    break;
                default:
                    message = exception.Message;
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = status;

            var payload = new { message };
            var json = JsonSerializer.Serialize(payload);
            return context.Response.WriteAsync(json);
        }
    }
}


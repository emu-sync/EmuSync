using EmuSync.Agent.Dto.Common;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace EmuSync.Agent.Middleware;

public class HttpResponseExceptionFilter(ILogger<HttpResponseExceptionFilter> logger, IWebHostEnvironment environment) : IActionFilter, IOrderedFilter
{
    private readonly ILogger<HttpResponseExceptionFilter> m_Logger = logger;
    private readonly IWebHostEnvironment m_Environment = environment;
    public int Order => int.MaxValue - 10;

    public void OnActionExecuting(ActionExecutingContext context) { }

    public void OnActionExectuedAsync(ActionExecutingContext context)
    {

    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Exception == null) return;

        var response = new ErrorResponseDto
        {
            Title = "Something went wrong", //keep 500 response message generic
            Status = (int)HttpStatusCode.InternalServerError,
            Errors = []
        };

        string errorMessage = "There was an error on the server.";

        //if development, get the exception and make that part of the errors response
        if (m_Environment.IsDevelopment())
        {
            errorMessage = context.Exception.Message
                + Environment.NewLine
                + context.Exception.InnerException?.Message
                + context.Exception.InnerException?.InnerException?.Message;
        }

        response.Errors.Add(errorMessage);

        var result = new JsonResult(response);
        result.StatusCode = 500;
        context.Result = result;

        m_Logger.LogError(context.Exception, "Unhandled Exception. Path {requestPath}. Query {query}",
            context.HttpContext.Request.Path.Value,
            context.HttpContext.Request.QueryString.Value
        );

        context.ExceptionHandled = true;
    }
}
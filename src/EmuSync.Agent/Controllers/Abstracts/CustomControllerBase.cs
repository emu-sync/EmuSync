using EmuSync.Agent.Dto.Common;
using Microsoft.AspNetCore.Http.Extensions;
using System.Net;

namespace EmuSync.Agent.Controllers.Abstracts;

public abstract class CustomControllerBase : ControllerBase
{
    protected ILogger Logger { get; init; }
    protected IValidationService Validator { get; init; }

    private readonly string m_ControllerName;

    internal CustomControllerBase(ILogger logger, IValidationService validator)
    {
        Logger = logger;
        Validator = validator;
        m_ControllerName = this.GetType().Name;
    }


    /// <summary>
    /// Return a <see cref="HttpStatusCode.NotFound"/> with a list of <paramref name="errors"/>
    /// </summary>
    /// <param name="errors"></param>
    /// <returns></returns>
    protected IActionResult NotFoundWithErrors(params string[] errors)
    {
        string title = "Content not found";
        int statusCode = (int)HttpStatusCode.NotFound;

        LogErrors(statusCode, title, errors);

        var response = new ErrorResponseDto()
        {
            Title = title,
            Status = statusCode,
            Errors = errors?.ToList()
        };

        return NotFound(response);
    }

    /// <summary>
    /// Return a <see cref="HttpStatusCode.BadRequest"/> with a list of <paramref name="errors"/>
    /// </summary>
    /// <param name="errors"></param>
    /// <returns></returns>
    protected IActionResult BadRequestWithErrors(params string[] errors)
    {
        string title = "Validation failure";
        int statusCode = (int)HttpStatusCode.BadRequest;

        LogErrors(statusCode, title, errors);

        var response = new ErrorResponseDto()
        {
            Title = title,
            Status = statusCode,
            Errors = errors?.ToList()
        };

        return BadRequest(response);
    }

    /// <summary>
    /// Returns the <paramref name="statusCode"/> with a list of <paramref name="errors"/>
    /// </summary>
    /// <param name="title"></param>
    /// <param name="statusCode"></param>
    /// <param name="errors"></param>
    /// <returns></returns>
    protected IActionResult StatusCodeWithErrors(HttpStatusCode statusCode, params string[] errors)
    {
        string title = "Error";
        int statusCodeNumber = (int)statusCode;

        LogErrors(statusCodeNumber, title, errors);

        var response = new ErrorResponseDto()
        {
            Title = title,
            Status = statusCodeNumber,
            Errors = errors?.ToList()
        };

        return StatusCode(statusCodeNumber, response);
    }

    protected void LogRequest(string methodName)
    {
        Logger.LogInformation("{controllerName} - {methodName} called", m_ControllerName, methodName);
    }

    protected void LogRequest<TRequest>(string methodName, TRequest request)
    {
        Logger.LogInformation("{controllerName} - {methodName} called: {@requestParams}", m_ControllerName, methodName, request);
    }

    private void LogErrors(int statusCode, string title, IEnumerable<string> errors)
    {
        Logger.LogWarning("{controllerName} - A status code of {statusCode} was returned: {title}. Request: {displayUrl}. Errors: {@errors}", m_ControllerName, statusCode, title, Request.GetDisplayUrl(), errors);
    }
}
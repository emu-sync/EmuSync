using FluentValidation;

namespace EmuSync.Agent.Services.Interfaces;

public interface IValidationService
{
    Task<List<string>> ValidateAsync<T>(T model, IValidator<T> validator, CancellationToken cancellationToken = new CancellationToken());
    Task<List<string>> ValidateAsync<TModel>(TModel model, CancellationToken cancellationToken = new CancellationToken());
    List<string> ValidateIdsMatch(string id1, string id2, string message = "The ID in the URL does not match the ID in the body");
}
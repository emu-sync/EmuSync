using FluentValidation;

namespace EmuSync.Agent.Services;

public class FluentValidationService(IServiceProvider serviceProvider) : IValidationService
{
    private readonly IServiceProvider m_ServiceProvider = serviceProvider;

    public async Task<List<string>> ValidateAsync<T>(T model, IValidator<T> validator, CancellationToken cancellationToken = new CancellationToken())
    {
        if (model == null)
        {
            return ["Received an unexpected null value"];
        }

        var result = await validator.ValidateAsync(model, cancellationToken);
        return result.Errors.ConvertAll(x => x.ErrorMessage);
    }

    public async Task<List<string>> ValidateAsync<T>(T model, CancellationToken cancellationToken = new CancellationToken())
    {
        var validator = m_ServiceProvider.GetRequiredService<IValidator<T>>();
        return await ValidateAsync(model, validator, cancellationToken);
    }

    public List<string> ValidateIdsMatch(string id1, string id2, string message = "The ID in the URL does not match the ID in the body")
    {
        if (id1 == id2) return [];
        return [message];
    }
}

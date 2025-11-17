
using FluentValidation;

namespace EmuSync.Agent.Dto.SyncSource;

public static class FluentValidationExtensions
{
    /// <summary>
    /// Ensure the int can be found in the provided enum
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TEnum"></typeparam>
    /// <param name="ruleBuilder"></param>
    /// <param name="message"></param>
    /// <returns></returns>
    public static IRuleBuilderOptions<T, int> IsValidEnumValue<T, TEnum>(this IRuleBuilder<T, int> ruleBuilder, string message)
        where TEnum : Enum
    {
        return ruleBuilder
            .Must(value => Enum.IsDefined(typeof(TEnum), value))
            .WithMessage((x, value) => $"{message} - {value}");
    }

    /// <summary>
    /// Ensure the int can be found in the provided enum
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TEnum"></typeparam>
    /// <param name="ruleBuilder"></param>
    /// <param name="message"></param>
    /// <returns></returns>
    public static IRuleBuilderOptions<T, int?> IsValidEnumValue<T, TEnum>(this IRuleBuilder<T, int?> ruleBuilder, string message)
        where TEnum : Enum
    {
        return ruleBuilder
            .Must(value => Enum.IsDefined(typeof(TEnum), value ?? -999))
            .WithMessage((x, value) => $"{message} - {value}");
    }
}
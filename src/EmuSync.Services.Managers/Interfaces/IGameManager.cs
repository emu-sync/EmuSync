namespace EmuSync.Services.Managers.Interfaces;

public interface IGameManager
{

    /// <summary>
    /// Gets a list of <see cref="GameEntity"/>
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<List<GameEntity>?> GetListAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a <see cref="GameEntity"/> by <paramref name="id"/>
    /// </summary>
    /// <param name="id"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<GameEntity?> GetAsync(string id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a <see cref="GameEntity"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task CreateAsync(GameEntity entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates the basic info of a <see cref="GameEntity"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<GameEntity?> UpdateAsync(GameEntity entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates the more detailed info of a <see cref="GameEntity"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> UpdateMetaDataAsync(GameEntity entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a <see cref="GameEntity"/> by <paramref name="id"/>
    /// </summary>
    /// <param name="id"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
}

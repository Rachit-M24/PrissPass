using System.Linq.Expressions;

/// <summary>
/// Defines the contract for a generic service layer that provides business logic 
/// and data operations for a specific entity type.
/// </summary>
/// <typeparam name="T">The entity type.</typeparam>
public interface IGenericService<T> where T : class
{
    /// <summary>
    /// Retrieves an entity by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the entity.</param>
    Task<T> GetByIdAsync(Guid id);

    /// <summary>
    /// Retrieves an entity by its identifier with optional filtering and related entities included.
    /// </summary>
    /// <param name="id">The unique identifier of the entity.</param>
    /// <param name="predicate">An optional condition to filter the entity.</param>
    /// <param name="includes">Navigation properties to include in the query.</param>
    Task<T> GetByIdWithIncludesAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes);

    /// <summary>
    /// Retrieves all entities of type <typeparamref name="T"/>.
    /// </summary>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Finds entities that match the given condition.
    /// </summary>
    /// <param name="predicate">The condition to filter entities.</param>
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Adds a new entity to the data source.
    /// </summary>
    /// <param name="entity">The entity to add.</param>
    Task AddAsync(T entity);

    /// <summary>
    /// Adds a range of entities to the data source.
    /// </summary>
    /// <param name="entities">The collection of entities to add.</param>
    Task AddRangeAsync(IEnumerable<T> entities);

    /// <summary>
    /// Updates an existing entity in the data source.
    /// </summary>
    /// <param name="entity">The entity to update.</param>
    Task UpdateAsync(T entity);

    /// <summary>
    /// Removes an entity from the data source.
    /// </summary>
    /// <param name="entity">The entity to remove.</param>
    Task RemoveAsync(T entity);

    /// <summary>
    /// Removes a range of entities from the data source.
    /// </summary>
    /// <param name="entities">The collection of entities to remove.</param>
    Task RemoveRangeAsync(IEnumerable<T> entities);

    /// <summary>
    /// Determines whether any entities exist that match the given condition.
    /// </summary>
    /// <param name="predicate">The condition to evaluate.</param>
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Counts the number of entities that match the given condition.
    /// </summary>
    /// <param name="predicate">The condition to filter entities. If null, counts all entities.</param>
    Task<int> CountAsync(Expression<Func<T, bool>> predicate = null);

    /// <summary>
    /// Retrieves the first entity that matches the given condition, or null if none found.
    /// </summary>
    /// <param name="predicate">The condition to filter entities.</param>
    Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);

    /// <summary>
    /// Persists changes made through the service to the data source.
    /// </summary>
    Task SaveChangesAsync();
}
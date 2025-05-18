// Services/GenericService.cs
using System.Linq.Expressions;

public class GenericService<T> : IGenericService<T> where T : class
{
    private readonly IRepository<T> _repository;
    
    public GenericService(IRepository<T> repository)
    {
        _repository = repository;
    }

    public async Task<T> GetByIdAsync(Guid id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _repository.FindAsync(predicate);
    }

    public async Task AddAsync(T entity)
    {
        await _repository.AddAsync(entity);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await _repository.AddRangeAsync(entities);
    }

    public async Task UpdateAsync(T entity)
    {
        await _repository.UpdateAsync(entity);
    }

    public async Task RemoveAsync(T entity)
    {
        await _repository.RemoveAsync(entity);
    }

    public async Task RemoveRangeAsync(IEnumerable<T> entities)
    {
        await _repository.RemoveRangeAsync(entities);
    }

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
    {
        return await _repository.AnyAsync(predicate);
    }

    public async Task<int> CountAsync(Expression<Func<T, bool>> predicate = null)
    {
        return await _repository.CountAsync(predicate);
    }

    public async Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
    {
        return await _repository.FirstOrDefaultAsync(predicate);
    }

    public async Task SaveChangesAsync()
    {
        await _repository.SaveChangesAsync();
    }
}
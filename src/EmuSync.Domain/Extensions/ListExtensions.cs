namespace EmuSync.Domain.Extensions;

public static class ListExtensions
{
    /// <summary>
    /// Finds an item by <paramref name="predicate"/> and updates it, or adds it if it doesn't exist
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="list"></param>
    /// <param name="item"></param>
    /// <param name="predicate"></param>
    public static void AddOrReplaceItem<T>(this List<T> list, T item, Func<T, bool> predicate)
    {
        int existingIndex = list.FindIndex(x => predicate(x));

        if (existingIndex >= 0)
        {
            list[existingIndex] = item;
            return;
        }

        list.Add(item);
    }

    /// <summary>
    /// Removes an item by <paramref name="predicate"/>
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="list"></param>
    /// <param name="predicate"></param>
    public static void RemoveBy<T>(this List<T> list, Func<T, bool> predicate)
    {
        int existingIndex = list.FindIndex(x => predicate(x));

        if (existingIndex >= 0)
        {
            list.RemoveAt(existingIndex);
            return;
        }
    }
}

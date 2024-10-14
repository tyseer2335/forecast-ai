from datetime import datetime


def convert_str_to_datetime(string: str) -> datetime or None:
    """
    Creates a datetime object from a JavaScript ISO format string

    Example usage:
    >>> convert_str_to_datetime('2024-05-02T09:00:00Z')
    datetime.datetime(2024, 5, 2, 9, 0)
    """
    if string is None:
        return string

    if string.endswith('Z'):
        return datetime.fromisoformat(string[:-1])

    return datetime.fromisoformat(string)

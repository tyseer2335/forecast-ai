from datetime import datetime

def convert_str_to_datetime(string: str) -> datetime:
    """
    Creates a datetime object from a JavaScript ISO format string
    """

    if string.endswith('Z'):
        return datetime.fromisoformat(string[:-1])

    return datetime.fromisoformat(string)
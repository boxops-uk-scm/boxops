from collections.abc import Iterator
from pathlib import Path
import re
from configerator import DB
import posixpath

VALID_PATH_COMPONENT: re.Pattern[str] = re.compile(r"^[A-Za-z0-9._-]+\Z")
NAME_MAX: int = 255
PATH_MAX: int = 4096


def validate_path(path: str) -> str:
    if path == "":
        raise ValueError("Path cannot be empty")

    if path[0] == "-":
        raise ValueError("Path cannot start with a hyphen")

    path = posixpath.normpath(path)

    head = path
    while True:
        head, tail = posixpath.split(head)

        if VALID_PATH_COMPONENT.fullmatch(tail) is None:
            raise ValueError(
                f"Invalid path component {tail!r}: paths may only contain alphanumeric characters, dots, underscores, and hyphens"
            )

        if len(tail) > NAME_MAX:
            raise ValueError(
                f"Path component {tail!r} exceeds maximum length of {NAME_MAX} bytes"
            )

        if head == "" or head == "/":
            break

    # Maximum path length includes null terminator
    if len(path) + 1 > PATH_MAX:
        raise ValueError(
            f"Path {path!r} exceeds maximum length of {PATH_MAX - 1} bytes"
        )

    return path


def _get_key(parent_path: str, child_path: str) -> bytes:
    return f"{child_path}\0{parent_path}".encode("ascii")


class ImportDB:
    _db: DB

    def __init__(self, path: str | Path, create_if_missing: bool = True):
        self._db = DB.open(path, create_if_missing)

    def close(self) -> None:
        self._db.close()

    def __del__(self):
        try:
            self.close()
        except Exception:
            pass

    def put_import(self, parent_path: str, child_path: str) -> str:
        parent_path = validate_path(parent_path)
        child_path = validate_path(child_path)
        self._db.put(_get_key(parent_path, child_path), b"")
        return child_path

    def get_parents(self, child_path: str) -> Iterator[bytes]:
        prefix = f"{child_path}\0".encode("ascii")
        for key in self._db.get_range(prefix):
            yield key[len(prefix) :]

from collections.abc import Iterator
from pathlib import PurePosixPath
from .DB import DB


def _get_rdeps_key(child_path: PurePosixPath, parent_path: PurePosixPath) -> bytes:
    return f"rdeps\0{child_path}\0{parent_path}".encode("utf-8")


def _get_rdeps_search_key(child_path: PurePosixPath) -> bytes:
    return f"rdeps\0{child_path}\0".encode("utf-8")


class ConfigStore:
    _db: DB

    def __init__(self, db: DB):
        self._db = db

    def put_rdep(
        self, child_path: PurePosixPath, parent_path: PurePosixPath
    ) -> PurePosixPath:
        self._db.put(_get_rdeps_key(child_path, parent_path), b"")
        return child_path

    def get_rdeps(self, child_path: PurePosixPath) -> Iterator[PurePosixPath]:
        search_key = _get_rdeps_search_key(child_path)
        for key in self._db.get_keys_by_prefix(search_key):
            yield PurePosixPath(key[len(search_key) :].decode("utf-8"))

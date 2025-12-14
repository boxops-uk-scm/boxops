from contextlib import contextmanager
import ctypes
import logging
from pathlib import PosixPath
from tempfile import TemporaryDirectory
from typing import Iterator, Literal, Optional
import tarfile

_lib: Optional[ctypes.CDLL] = None


def _load_lib() -> ctypes.CDLL:
    global _lib
    if _lib is not None:
        return _lib

    lib_path = PosixPath(__file__).resolve().parent / "librocksdb_shim.so"
    if not lib_path.exists():
        raise FileNotFoundError(f"Failed to locate RocksDB shim at {lib_path}")

    lib = ctypes.CDLL(str(lib_path))

    # rocksdb_handle *rocksdb_open(
    #     const char *path,
    #     int create_if_missing,
    #     char **error);
    lib.rocksdb_open.argtypes = [
        ctypes.c_char_p,
        ctypes.c_int,
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_open.restype = ctypes.c_void_p

    # void rocksdb_close(rocksdb_handle *handle);
    lib.rocksdb_close.argtypes = [ctypes.c_void_p]
    lib.rocksdb_close.restype = None

    # int rocksdb_put(
    #     rocksdb_handle *handle,
    #     const char *key,
    #     size_t key_len,
    #     const char *value,
    #     size_t value_len,
    #     char **error);
    lib.rocksdb_put.argtypes = [
        ctypes.c_void_p,
        ctypes.c_char_p,
        ctypes.c_size_t,
        ctypes.c_char_p,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_put.restype = ctypes.c_int

    # int rocksdb_get(
    #     rocksdb_handle *handle,
    #     const char *key,
    #     size_t key_len,
    #     char **value,
    #     size_t *value_len,
    #     char **error);
    lib.rocksdb_get.argtypes = [
        ctypes.c_void_p,
        ctypes.c_char_p,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char_p),
        ctypes.POINTER(ctypes.c_size_t),
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_get.restype = ctypes.c_int

    # int rocksdb_delete(
    #     rocksdb_handle *handle,
    #     const char *key,
    #     size_t key_len,
    #     char **error);
    lib.rocksdb_delete.argtypes = [
        ctypes.c_void_p,
        ctypes.c_char_p,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_delete.restype = ctypes.c_int

    # void rocksdb_free(void *p);
    lib.rocksdb_free.argtypes = [ctypes.c_void_p]
    lib.rocksdb_free.restype = None

    # rocksdb_prefix_iterator *rocksdb_create_prefix_iterator(
    #     rocksdb_handle *handle,
    #     const char *prefix,
    #     size_t prefix_len,
    #     char **error);
    lib.rocksdb_create_prefix_iterator.argtypes = [
        ctypes.c_void_p,
        ctypes.c_char_p,
        ctypes.c_size_t,
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_create_prefix_iterator.restype = ctypes.c_void_p

    # void rocksdb_destroy_prefix_iterator(rocksdb_prefix_iterator *it);
    lib.rocksdb_destroy_prefix_iterator.argtypes = [ctypes.c_void_p]
    lib.rocksdb_destroy_prefix_iterator.restype = None

    # int rocksdb_advance_prefix_iterator(
    #     rocksdb_prefix_iterator *prefix_iterator,
    #     const char **key_data,
    #     size_t *key_len,
    #     char **error);
    lib.rocksdb_advance_prefix_iterator.argtypes = [
        ctypes.c_void_p,
        ctypes.POINTER(ctypes.c_char_p),
        ctypes.POINTER(ctypes.c_size_t),
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_advance_prefix_iterator.restype = ctypes.c_int

    # rocksdb_handle *rocksdb_open_read_only(
    #     const char *path,
    #     char **error);
    lib.rocksdb_open_read_only.argtypes = [
        ctypes.c_char_p,
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_open_read_only.restype = ctypes.c_void_p

    # int rocksdb_backup(
    #     rocksdb_handle *handle,
    #     const char *backup_dir,
    #     int flush_before_backup,
    #     char **error);
    lib.rocksdb_backup.argtypes = [
        ctypes.c_void_p,
        ctypes.c_char_p,
        ctypes.c_int,
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_backup.restype = ctypes.c_int

    # int rocksdb_restore_latest_backup(
    #     const char *backup_dir,
    #     const char *db_path,
    #     char **error);
    lib.rocksdb_restore_latest_backup.argtypes = [
        ctypes.c_char_p,
        ctypes.c_char_p,
        ctypes.POINTER(ctypes.c_char_p),
    ]
    lib.rocksdb_restore_latest_backup.restype = ctypes.c_int

    _lib = lib
    return lib


def _get_error(error: ctypes.c_char_p) -> str | None:
    lib = _load_lib()
    if not error:
        return None
    value = error.value
    lib.rocksdb_free(error)
    if not value:
        return None
    return value.decode("utf-8")


logger = logging.getLogger(__name__)


class DB:
    _handle: ctypes.c_void_p

    def __init__(self, handle: ctypes.c_void_p) -> None:
        self._handle = handle

    def __del__(self) -> None:
        if self._handle:
            self.close()

    def close(self) -> None:
        logger.debug("Closing database connection")
        if self._handle:
            lib = _load_lib()
            lib.rocksdb_close(self._handle)
        self._handle = ctypes.c_void_p()

    @classmethod
    def create(cls, db_dir: PosixPath) -> None:
        with cls.open("rw", db_dir) as _:
            pass

    @classmethod
    def restore(cls, snapshot_file: PosixPath, db_dir: PosixPath) -> None:
        lib = _load_lib()
        error = ctypes.c_char_p()

        with TemporaryDirectory() as backup_dir:
            backup_dir = PosixPath(backup_dir)

            logger.debug(
                "Extracting database from snapshot file %s into temporary directory %s",
                snapshot_file,
                backup_dir,
            )
            with tarfile.open(snapshot_file, "r:gz") as tar:
                tar.extractall(path=backup_dir)

            logger.debug(
                "Restoring database into %s",
                db_dir,
            )

            result = lib.rocksdb_restore_latest_backup(
                str(backup_dir).encode("utf-8"),
                str(db_dir).encode("utf-8"),
                ctypes.byref(error),
            )

            if result != 0:
                raise RuntimeError(f"Failed to restore database: {_get_error(error)}")

    def backup(self, snapshot_file: PosixPath) -> None:
        lib = _load_lib()
        error = ctypes.c_char_p()

        with TemporaryDirectory() as backup_dir:
            backup_dir = PosixPath(backup_dir)

            logger.debug(
                "Backing up database into temporary directory %s",
                backup_dir,
            )

            result = lib.rocksdb_backup(
                self._handle,
                str(backup_dir).encode("utf-8"),
                1,
                ctypes.byref(error),
            )

            if result != 0:
                raise RuntimeError(
                    f"Failed to create backup to {backup_dir}: {_get_error(error)}"
                )

            logger.debug(
                "Creating snapshot file at %s",
                snapshot_file,
            )

            with tarfile.open(snapshot_file, "w:gz") as tar:
                tar.add(backup_dir, arcname=".")

    @classmethod
    @contextmanager
    def open(cls, mode: Literal["r", "rw"], db_dir: PosixPath) -> Iterator[DB]:
        lib = _load_lib()
        error = ctypes.c_char_p()

        logger.debug("Opening database at %s (mode=%s)", db_dir, mode)

        if mode == "r":
            try:
                handle = lib.rocksdb_open_read_only(
                    str(db_dir).encode("utf-8"),
                    ctypes.byref(error),
                )
                yield cls(handle)
            except Exception as e:
                raise RuntimeError(
                    f"Failed to open RocksDB at {db_dir}: {_get_error(error)}"
                ) from e
        elif mode == "rw":
            try:
                handle = lib.rocksdb_open(
                    str(db_dir).encode("utf-8"),
                    1,
                    ctypes.byref(error),
                )
                yield cls(handle)
            except Exception as e:
                raise RuntimeError(
                    f"Failed to open RocksDB at {db_dir}: {_get_error(error)}"
                ) from e
        else:
            raise ValueError(f"Invalid mode: {mode}")

        if not handle:
            raise RuntimeError(
                f"Failed to open RocksDB at {db_dir}: {_get_error(error)}"
            )

    def get(self, key: bytes) -> Optional[bytes]:
        lib = _load_lib()
        value_ptr = ctypes.c_char_p()
        value_len = ctypes.c_size_t()
        error = ctypes.c_char_p()

        result = lib.rocksdb_get(
            self._handle,
            key,
            len(key),
            ctypes.byref(value_ptr),
            ctypes.byref(value_len),
            ctypes.byref(error),
        )

        if result == 1:
            return None

        if result < 0:
            raise RuntimeError(
                f"Failed to get value for key {key!r}: {_get_error(error)}"
            )

        if not value_ptr:
            return b""

        try:
            data = ctypes.string_at(value_ptr, value_len.value)
        finally:
            lib.rocksdb_free(ctypes.cast(value_ptr, ctypes.c_void_p))

        return data

    def get_keys_by_prefix(self, prefix: bytes) -> DB.KeyIterator:
        return DB.KeyIterator(self._handle, prefix)

    def put(self, key: bytes, value: bytes) -> None:
        lib = _load_lib()
        error = ctypes.c_char_p()

        result = lib.rocksdb_put(
            self._handle,
            key,
            len(key),
            value,
            len(value),
            ctypes.byref(error),
        )

        if result < 0:
            raise RuntimeError(
                f"Failed to put key-value pair {key!r}={value!r}: "
                f"{_get_error(error)}"
            )

    def delete(self, key: bytes) -> None:
        lib = _load_lib()
        error = ctypes.c_char_p()

        result = lib.rocksdb_delete(
            self._handle,
            key,
            len(key),
            ctypes.byref(error),
        )

        if result < 0:
            raise RuntimeError(f"Failed to delete key {key!r}: {_get_error(error)}")

    class KeyIterator:
        _lib: ctypes.CDLL
        _iter: Optional[ctypes.c_void_p]

        def __init__(self, handle: ctypes.c_void_p, prefix: bytes):
            lib = _load_lib()
            self._lib = lib
            self._iter = None

            error = ctypes.c_char_p()
            it = lib.rocksdb_create_prefix_iterator(
                handle,
                prefix,
                len(prefix),
                ctypes.byref(error),
            )
            if not it:
                raise RuntimeError(
                    f"Failed to create key iterator: {_get_error(error)}"
                )

            self._iter = it

        def __del__(self):
            try:
                self.close()
            except Exception:
                pass

        def close(self) -> None:
            if self._iter:
                self._lib.rocksdb_destroy_prefix_iterator(self._iter)
                self._iter = None

        def __iter__(self) -> DB.KeyIterator:
            return self

        def __next__(self) -> bytes:
            if not self._iter:
                raise StopIteration

            key_ptr = ctypes.c_char_p()
            key_len = ctypes.c_size_t()
            error = ctypes.c_char_p()

            rc = self._lib.rocksdb_advance_prefix_iterator(
                self._iter,
                ctypes.byref(key_ptr),
                ctypes.byref(key_len),
                ctypes.byref(error),
            )

            if rc == 1:
                self.close()
                raise StopIteration

            if rc < 0:
                self.close()
                raise RuntimeError(
                    f"Failed to advance key iterator: {_get_error(error)}"
                )

            return ctypes.string_at(key_ptr, key_len.value)

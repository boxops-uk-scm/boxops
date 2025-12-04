from __future__ import annotations

import ctypes
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator, Optional, Union

_lib: Optional[ctypes.CDLL] = None


def _load_lib() -> ctypes.CDLL:
    global _lib
    if _lib is not None:
        return _lib

    lib_path = Path(__file__).resolve().parent / "librocksdb_shim.so"
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

    _lib = lib
    return lib


UNKNOWN_ERROR_MESSAGE = "unknown error"


@dataclass
class DB:
    _handle: ctypes.c_void_p

    def __init__(self, _handle: ctypes.c_void_p):
        self._handle = _handle

    def __del__(self):
        try:
            self.close()
        except Exception:
            pass

    @classmethod
    def get_error_message(cls, error: ctypes.c_char_p) -> str:
        if not error:
            return UNKNOWN_ERROR_MESSAGE

        lib = _load_lib()

        if error.value:
            message = error.value.decode("utf-8")
        else:
            message = UNKNOWN_ERROR_MESSAGE

        lib.rocksdb_free(error)
        return message

    @classmethod
    def open(cls, path: Union[str, Path], create_if_missing: bool = True) -> "DB":
        lib = _load_lib()

        error = ctypes.c_char_p()

        handle = lib.rocksdb_open(
            str(path).encode("utf-8"),
            int(create_if_missing),
            ctypes.byref(error),
        )

        if not handle:
            raise RuntimeError(
                f"Failed to open RocksDB at {path}: {cls.get_error_message(error)}"
            )

        return cls(_handle=handle)

    def close(self) -> None:
        lib = _load_lib()

        if self._handle:
            lib.rocksdb_close(self._handle)
            self._handle = ctypes.c_void_p()

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
                f"{self.get_error_message(error)}"
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
                f"Failed to get value for key {key!r}: {self.get_error_message(error)}"
            )

        if not value_ptr:
            return b""

        try:
            data = ctypes.string_at(value_ptr, value_len.value)
        finally:
            lib.rocksdb_free(ctypes.cast(value_ptr, ctypes.c_void_p))

        return data

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
            msg = self.get_error_message(error)
            raise RuntimeError(f"rocksdb_delete failed: {msg}")

    def get_range(self, prefix: bytes) -> Iterator[bytes]:
        return self._PrefixIterator(self._handle, prefix)

    class _PrefixIterator:
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
                msg = DB.get_error_message(error)
                raise RuntimeError(f"rocksdb_create_prefix_iterator failed: {msg}")

            self._iter = it

        def __iter__(self) -> "DB._PrefixIterator":
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
                msg = DB.get_error_message(error)
                self.close()
                raise RuntimeError(f"rocksdb_advance_prefix_iterator failed: {msg}")

            return ctypes.string_at(key_ptr, key_len.value)

        def close(self) -> None:
            if self._iter:
                self._lib.rocksdb_destroy_prefix_iterator(self._iter)
                self._iter = None

        def __del__(self):
            try:
                self.close()
            except Exception:
                pass

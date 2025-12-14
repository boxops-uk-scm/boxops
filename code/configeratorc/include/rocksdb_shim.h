#pragma once

#include <stddef.h>

#ifdef __cplusplus
extern "C"
{
#endif

    typedef struct rocksdb_handle rocksdb_handle;

    typedef struct rocksdb_prefix_iterator rocksdb_prefix_iterator;

    rocksdb_handle *rocksdb_open(
        const char *path,
        int create_if_missing,
        char **error);

    rocksdb_handle *rocksdb_open_read_only(
        const char *path,
        char **error);

    int rocksdb_backup(
        rocksdb_handle *handle,
        const char *backup_dir,
        int flush_before_backup,
        char **error);

    int rocksdb_restore_latest_backup(
        const char *backup_dir,
        const char *db_path,
        char **error);

    void rocksdb_close(rocksdb_handle *handle);

    int rocksdb_put(
        rocksdb_handle *handle,
        const char *key,
        size_t key_len,
        const char *value,
        size_t value_len,
        char **error);

    int rocksdb_get(
        rocksdb_handle *handle,
        const char *key,
        size_t key_len,
        char **value,
        size_t *value_len,
        char **error);

    int rocksdb_delete(
        rocksdb_handle *handle,
        const char *key,
        size_t key_len,
        char **error);

    void rocksdb_free(void *p);

    rocksdb_prefix_iterator *rocksdb_create_prefix_iterator(
        rocksdb_handle *handle,
        const char *prefix,
        size_t prefix_len,
        char **error);

    void rocksdb_destroy_prefix_iterator(rocksdb_prefix_iterator *it);

    int rocksdb_advance_prefix_iterator(
        rocksdb_prefix_iterator *prefix_iterator,
        const char **key_data,
        size_t *key_len,
        char **error);

#ifdef __cplusplus
}
#endif
#include "rocksdb_shim.h"

#include <cstdlib>
#include <cstring>
#include <memory>
#include <new>
#include <string>
#include <errno.h>

#include <rocksdb/db.h>
#include <rocksdb/options.h>
#include <rocksdb/slice.h>
#include <rocksdb/status.h>
#include <rocksdb/write_batch.h>

struct rocksdb_handle
{
    std::unique_ptr<rocksdb::DB> db;
    rocksdb::WriteOptions write_options;
    rocksdb::ReadOptions read_options;
};

struct rocksdb_prefix_iterator
{
    std::unique_ptr<rocksdb::Iterator> iterator;
    std::string prefix;
    bool started;
};

extern "C"
{
    rocksdb_handle *rocksdb_open(
        const char *path,
        int create_if_missing,
        char **error)
    {
        if (error)
        {
            *error = nullptr;
        }

        if (!path)
        {
            if (error)
            {
                *error = strdup("rocksdb_open: path is null");
            }
            errno = EINVAL;
            return nullptr;
        }

        rocksdb::Options options;
        options.create_if_missing = (create_if_missing != 0);
        options.compression = rocksdb::kNoCompression;
        options.bottommost_compression = rocksdb::kNoCompression;

        rocksdb::DB *db = nullptr;
        rocksdb::Status status = rocksdb::DB::Open(options, path, &db);

        if (!status.ok())
        {
            if (error)
            {
                *error = strdup(status.ToString().c_str());
            }
            errno = EIO;
            return nullptr;
        }

        auto handle = std::make_unique<rocksdb_handle>();
        if (!handle)
        {
            delete db;
            if (error)
            {
                *error = strdup("rocksdb_open: out of memory");
            }
            errno = ENOMEM;
            return nullptr;
        }

        handle->db.reset(db);
        handle->write_options = rocksdb::WriteOptions();
        handle->read_options = rocksdb::ReadOptions();

        return handle.release();
    }

    void rocksdb_close(rocksdb_handle *handle)
    {
        delete handle;
    }

    int rocksdb_put(
        rocksdb_handle *handle,
        const char *key,
        size_t key_len,
        const char *value,
        size_t value_len,
        char **error)
    {
        if (error)
        {
            *error = nullptr;
        }

        // Slice-style checks: allow NULL only when length == 0
        if (!handle ||
            (key_len > 0 && !key) ||
            (value_len > 0 && !value))
        {
            if (error)
            {
                *error = strdup("rocksdb_put: invalid argument");
            }
            errno = EINVAL;
            return -1;
        }

        rocksdb::Slice key_slice(key, key_len);
        rocksdb::Slice value_slice(value, value_len);
        rocksdb::Status status = handle->db->Put(
            handle->write_options,
            key_slice,
            value_slice);

        if (!status.ok())
        {
            if (error)
            {
                *error = strdup(status.ToString().c_str());
            }
            errno = EIO;
            return -1;
        }

        return 0;
    }

    int rocksdb_get(
        rocksdb_handle *handle,
        const char *key,
        size_t key_len,
        char **value,
        size_t *value_len,
        char **error)
    {
        if (error)
        {
            *error = nullptr;
        }

        // key follows slice-style; value/value_len are required outputs
        if (!handle ||
            (key_len > 0 && !key) ||
            !value ||
            !value_len)
        {
            if (error)
            {
                *error = strdup("rocksdb_get: invalid argument");
            }
            errno = EINVAL;
            return -1;
        }

        *value = nullptr;
        *value_len = 0;

        rocksdb::Slice key_slice(key, key_len);
        std::string result;
        rocksdb::Status status = handle->db->Get(
            handle->read_options,
            key_slice,
            &result);

        if (status.IsNotFound())
        {
            return 1;
        }

        if (!status.ok())
        {
            if (error)
            {
                *error = strdup(status.ToString().c_str());
            }
            errno = EIO;
            return -1;
        }

        const size_t result_size = result.size();
        char *value_buffer = nullptr;

        if (result_size > 0)
        {
            value_buffer = static_cast<char *>(std::malloc(result_size));
            if (!value_buffer)
            {
                if (error)
                {
                    *error = strdup("rocksdb_get: out of memory");
                }
                errno = ENOMEM;
                return -1;
            }
            std::memcpy(value_buffer, result.data(), result_size);
        }

        *value = value_buffer;
        *value_len = result_size;

        return 0;
    }

    int rocksdb_delete(
        rocksdb_handle *handle,
        const char *key,
        size_t key_len,
        char **error)
    {
        if (error)
        {
            *error = nullptr;
        }

        // key follows slice-style
        if (!handle || (key_len > 0 && !key))
        {
            if (error)
            {
                *error = strdup("rocksdb_delete: invalid argument");
            }
            errno = EINVAL;
            return -1;
        }

        rocksdb::Slice key_slice(key, key_len);

        auto status = handle->db->Delete(handle->write_options, key_slice);

        if (!status.ok())
        {
            if (error)
            {
                *error = strdup(status.ToString().c_str());
            }
            errno = EIO;
            return -1;
        }

        return 0;
    }

    void rocksdb_free(void *p)
    {
        std::free(p);
    }

    rocksdb_prefix_iterator *rocksdb_create_prefix_iterator(
        rocksdb_handle *handle,
        const char *prefix,
        size_t prefix_len,
        char **error)
    {
        if (error)
        {
            *error = nullptr;
        }

        // prefix follows slice-style
        if (!handle || (prefix_len > 0 && !prefix))
        {
            if (error)
            {
                *error = strdup("rocksdb_create_prefix_iterator: invalid argument");
            }
            errno = EINVAL;
            return nullptr;
        }

        std::unique_ptr<rocksdb::Iterator> iterator(handle->db->NewIterator(handle->read_options));
        if (!iterator)
        {
            if (error)
            {
                *error = strdup("rocksdb_create_prefix_iterator: failed to create iterator");
            }
            errno = EIO;
            return nullptr;
        }

        auto prefix_iterator = std::make_unique<rocksdb_prefix_iterator>();
        if (!prefix_iterator)
        {
            if (error)
            {
                *error = strdup("rocksdb_create_prefix_iterator: out of memory");
            }
            errno = ENOMEM;
            return nullptr;
        }

        prefix_iterator->iterator = std::move(iterator);
        prefix_iterator->prefix.clear();
        if (prefix_len > 0)
        {
            // Safe: prefix must be non-null when prefix_len > 0
            prefix_iterator->prefix.assign(prefix, prefix_len);
        }
        prefix_iterator->started = false;

        return prefix_iterator.release();
    }

    void rocksdb_destroy_prefix_iterator(rocksdb_prefix_iterator *it)
    {
        delete it;
    }

    int rocksdb_advance_prefix_iterator(
        rocksdb_prefix_iterator *prefix_iterator,
        const char **key_data,
        size_t *key_len,
        char **error)
    {
        if (error)
        {
            *error = nullptr;
        }

        // Outputs are required
        if (!prefix_iterator || !key_data || !key_len)
        {
            if (error)
            {
                *error = strdup("rocksdb_advance_prefix_iterator: invalid argument");
            }
            errno = EINVAL;
            return -1;
        }

        *key_data = nullptr;
        *key_len = 0;

        if (!prefix_iterator->started)
        {
            prefix_iterator->iterator->Seek(prefix_iterator->prefix);
            prefix_iterator->started = true;
        }
        else
        {
            prefix_iterator->iterator->Next();
        }

        if (!prefix_iterator->iterator->status().ok())
        {
            if (error)
            {
                *error = strdup(prefix_iterator->iterator->status().ToString().c_str());
            }
            errno = EIO;
            return -1;
        }

        if (!prefix_iterator->iterator->Valid())
        {
            return 1;
        }

        rocksdb::Slice key_slice = prefix_iterator->iterator->key();

        if (!key_slice.starts_with(prefix_iterator->prefix))
        {
            return 1;
        }

        *key_data = key_slice.data();
        *key_len = key_slice.size();

        return 0;
    }
} // extern "C"

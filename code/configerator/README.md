# Prerequisites

To build RocksDB
- Architecture: x86 / x86_64 / arm64 / ppc64le / s390x
- C/C++ Compiler: GCC 4.8+ or Clang
- GNU Make or CMake 3.14.5+
- (optional) gflags 2.0+

```
cmake .. \
  -DCMAKE_BUILD_TYPE=Release \
  -DROCKSDB_BUILD_SHARED=ON \
  -DCMAKE_POSITION_INDEPENDENT_CODE=ON \
  -DWITH_SNAPPY=OFF \
  -DWITH_LZ4=OFF \
  -DWITH_ZSTD=OFF \
  -DWITH_ZLIB=OFF \
  -DWITH_BZ2=OFF
```

```
cmake --build . -j"$(nproc)"
```

```
sudo cmake --install .
sudo ldconfig
```

```
uv build
uv pip install --force-reinstall dist/configerator-0.1.0-*.whl
source .venv/bin/activate
configerator -h
```

or

```
./build.sh
configerator -h
```
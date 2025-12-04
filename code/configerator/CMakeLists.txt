cmake_minimum_required(VERSION 3.14.5)
project(configerator LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if (NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Release CACHE STRING "" FORCE)
endif()

find_package(RocksDB REQUIRED CONFIG)

if (TARGET RocksDB::rocksdb-shared)
    set(ROCKSDB_LIB RocksDB::rocksdb-shared)
elseif (TARGET RocksDB::rocksdb)
    set(ROCKSDB_LIB RocksDB::rocksdb)
endif()

add_library(rocksdb_shim SHARED src/rocksdb_shim.cpp)

target_include_directories(rocksdb_shim
    PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
        $<INSTALL_INTERFACE:include>
)

target_link_libraries(rocksdb_shim
    PRIVATE
        ${ROCKSDB_LIB}
)

set_target_properties(rocksdb_shim PROPERTIES
    OUTPUT_NAME "rocksdb_shim"
    POSITION_INDEPENDENT_CODE ON
    VISIBILITY_INLINES_HIDDEN ON
)

install(TARGETS rocksdb_shim
    EXPORT configeratorTargets
    LIBRARY DESTINATION configerator
    ARCHIVE DESTINATION configerator
    RUNTIME DESTINATION configerator
)

install(FILES include/rocksdb_shim.h DESTINATION include)
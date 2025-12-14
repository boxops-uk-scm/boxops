import importlib.util
import logging
from pathlib import PosixPath
import posixpath
import sys
from types import ModuleType
import json
from google.protobuf.json_format import MessageToJson


def _load_config(
    config_file: PosixPath,
) -> ModuleType:
    dirname = config_file.parent
    basename = config_file.stem
    module_name = posixpath.splitext(basename)[0]

    if str(dirname) not in sys.path:
        sys.path.insert(0, str(dirname))

    spec = importlib.util.spec_from_file_location(module_name, str(config_file))
    if spec is None or spec.loader is None:
        raise ImportError(f"Failed to load configuration file: {config_file}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    return module


def build(
    config_file: PosixPath,
    out_dir: PosixPath,
    write_json: bool,
    db_dir: PosixPath | None,
) -> None:
    logger = logging.getLogger(__name__)
    logger.info(f"Loading configuration from {config_file}")

    pwd = PosixPath.cwd().resolve()
    config_file = config_file.relative_to(pwd)

    loaded_modules_before_build = set(sys.modules.keys())

    config_module = _load_config(config_file)

    if not hasattr(config_module, "export_config"):
        raise AttributeError(
            f"The configuration file {config_file} does not define 'export_config' function."
        )

    export_config_func = getattr(config_module, "export_config")
    config = export_config_func()

    if write_json:
        output = MessageToJson(config)
        out_file = out_dir / config_file.with_suffix(".json")
        out_file.parent.mkdir(parents=True, exist_ok=True)
        with out_file.open("w") as f:
            f.write(output)
        logger.info(f"Wrote JSON configuration to {out_file}")
    else:
        output = config.SerializeToString()
        out_file = out_dir / config_file.with_suffix(".bin")
        out_file.parent.mkdir(parents=True, exist_ok=True)
        with out_file.open("wb") as f:
            f.write(output)
        logger.info(f"Wrote binary configuration to {out_file}")

    if db_dir:
        from .DB import DB
        from .ConfigStore import ConfigStore

        loaded_module_paths_during_build = list(
            {
                PosixPath(module.__file__).resolve().relative_to(pwd)
                for name, module in sys.modules.items()
                if name not in loaded_modules_before_build
                and module.__file__ is not None
                and module.__file__.startswith(str(pwd))
            }
        )

        logger.info(
            f"Modules loaded during execution: {json.dumps([str(path) for path in loaded_module_paths_during_build], indent=2)}"
        )

        logger.info(f"Recording reverse dependencies in DB at {db_dir}")
        with DB.open("rw", db_dir) as db:
            store = ConfigStore(db)
            for path in loaded_module_paths_during_build:
                store.put_rdep(path, config_file)

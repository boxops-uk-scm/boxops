from __future__ import annotations

import argparse
from collections.abc import Iterator
from dataclasses import asdict, dataclass
import json
import logging
import os
from pathlib import Path
import sys
from typing import TextIO


def init_logging(log_level: str | int):
    logging.basicConfig(
        stream=sys.stderr,
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S%z",
    )


@dataclass(frozen=True, slots=True)
class Options:
    # Absolute path of the repository root directory
    repository_root_path: str | None

    # Absolute path of the configuration root directory
    config_root_path: str

    # Path to the import database
    import_db_path: str

    log_level: str | int


def get_repository_root_path(
    logger: logging.Logger, repository_root_path_argument: str | None
) -> str | None:
    if repository_root_path_argument is not None:
        logger.debug(
            "Using repository root path from --repo-root argument: %r",
            repository_root_path_argument,
        )
        return Path(repository_root_path_argument).resolve().as_posix()

    repository_root_path = os.getenv("BOXOPS_REPO_ROOT")
    if repository_root_path is not None:
        logger.debug(
            "Using repository root path from BOXOPS_REPO_ROOT environment variable: %r",
            repository_root_path,
        )
        return Path(repository_root_path).resolve().as_posix()

    return None


def get_config_root(
    logger: logging.Logger,
    config_root_path_argument: str | None,
    repository_root_path_argument: str | None,
) -> str:
    if config_root_path_argument:
        logger.debug(
            "Using config root path from --config-root argument: %r",
            config_root_path_argument,
        )
        return Path(config_root_path_argument).resolve().as_posix()

    config_root_path = os.getenv("BOXOPS_CONFIG_ROOT")
    if config_root_path is not None:
        logger.debug(
            "Using config root path from BOXOPS_CONFIG_ROOT environment variable: %r",
            config_root_path,
        )
        return Path(config_root_path).resolve().as_posix()

    repository_root_path = get_repository_root_path(logger, None)
    if repository_root_path is not None:
        config_root_path = (
            Path(repository_root_path, "config", "src").resolve().as_posix()
        )
        logger.debug(
            "Config root path not specified; defaulting to: %r",
            config_root_path,
        )
        return config_root_path

    raise RuntimeError(
        "Config root path not specified; provide it via the "
        "`--config-root` argument, the BOXOPS_CONFIG_ROOT environment variable, "
        "or implicitly via the repository root path."
    )


def get_options(args: argparse.Namespace) -> Options:
    init_logging(args.log_level)
    logger = logging.getLogger(__name__)

    config_root_path = get_config_root(logger, args.config_root, args.repo_root)
    import_db_path = args.db

    return Options(
        repository_root_path=args.repo_root,
        config_root_path=config_root_path,
        import_db_path=import_db_path,
        log_level=args.log_level,
    )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="configerator")

    parser.add_argument(
        "--log-level",
        default="INFO",
        choices=["ERROR", "WARNING", "INFO", "DEBUG"],
        help="the minimum severity of log messages to display.",
    )

    parser.add_argument(
        "--repo-root",
        type=str,
        default=None,
        metavar="REPOSITORY_ROOT_PATH",
        help="absolute path of the repository root directory",
    )

    parser.add_argument(
        "--config-root",
        type=str,
        default="",
        metavar="CONFIG_ROOT_PATH",
        help="absolute path of the configuration root directory",
    )

    parser.add_argument(
        "--db",
        type=str,
        metavar="IMPORT_DB_PATH",
        help="path to the import database",
        required=True,
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    fanout_parser = subparsers.add_parser(
        "fanout",
        help="determine impacted configuration files from modified source files",
    )
    fanout_parser.add_argument(
        "--modified-files",
        type=str,
        metavar="MODIFIED_FILES_JSONL",
        help="path to a JSONL file containing paths of modified source files",
    )

    args = parser.parse_args(argv)
    options = get_options(args)

    if args.command == "fanout":
        fanout(options, args.modified_files)

    return 0


def stream_modified_files(source: TextIO) -> Iterator[str]:
    for lineno, raw_line in enumerate(source, start=1):
        line = raw_line.strip()
        if not line:
            continue

        obj = json.loads(line)

        if not isinstance(obj, list) or not all(isinstance(x, str) for x in obj):  # type: ignore
            raise ValueError(
                f"Line {lineno}: expected JSON array of strings, got {obj!r}"
            )

        for s in obj:  # type: ignore
            yield s


def fanout(options: Options, modified_files_path: str | None) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Options: %s", json.dumps(asdict(options), indent=2))

    if modified_files_path and modified_files_path != "-":
        logger.info("Reading modified files from %r", modified_files_path)
        with open(modified_files_path, "r", encoding="utf-8") as modified_files:
            for modified_path in stream_modified_files(modified_files):
                logger.info("Modified path: %r", modified_path)
    else:
        logger.info("Reading modified files from stdin")
        for modified_path in stream_modified_files(sys.stdin):
            logger.info("Modified path: %r", modified_path)

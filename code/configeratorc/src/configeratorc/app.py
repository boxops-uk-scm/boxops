import argparse
import logging
import sys
from pathlib import PosixPath
from types import MappingProxyType
from typing import Final
from .DB import DB
from .build import build

_LOG_LEVELS = {
    "DEBUG": logging.DEBUG,
    "INFO": logging.INFO,
    "WARNING": logging.WARNING,
    "ERROR": logging.ERROR,
}

LOG_LEVELS: Final = MappingProxyType(_LOG_LEVELS)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="configeratorc")

    parser.add_argument(
        "--log-level",
        dest="log_level",
        type=str.upper,
        choices=LOG_LEVELS.keys(),
        default="INFO",
    )

    parser.add_argument(
        "-v", "--version", action="version", version="configeratorc 0.1.0"
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    db = subparsers.add_parser(
        "db",
        help="create, restore, or back up a config database",
    )

    db_subparsers = db.add_subparsers(dest="db_command", required=True)
    create = db_subparsers.add_parser(
        "create",
        help="create a new config database",
    )

    create.add_argument(
        "db_dir",
        metavar="DB_DIR",
        type=str,
        help="the path of the directory to create the database in",
    )

    restore = db_subparsers.add_parser(
        "restore",
        help="restore a config database from a snapshot",
    )

    restore.add_argument(
        "snapshot_file",
        metavar="SNAPSHOT_FILE",
        type=str,
        help="the path of the snapshot file to restore from",
    )

    restore.add_argument(
        "db_dir",
        metavar="DB_DIR",
        type=str,
        help="the path of the directory to restore the database into",
    )

    backup = db_subparsers.add_parser(
        "backup",
        help="save a snapshot of a config database",
    )

    backup.add_argument(
        "db_dir",
        metavar="DB_DIR",
        type=str,
        help="the path of the directory containing the database to back up",
    )

    backup.add_argument(
        "snapshot_file",
        metavar="SNAPSHOT_FILE",
        type=str,
        help="the path the snapshot file will be written to",
    )

    build = subparsers.add_parser("build", help="build a config file")

    build.add_argument(
        "config_file",
        type=str,
        help="path of the config file to build",
        metavar="CONFIG_FILE",
    )

    build.add_argument(
        "out_dir",
        type=str,
        help="path of the directory to write output to",
        metavar="OUT_DIR",
    )

    build.add_argument(
        "--db",
        dest="db_dir",
        type=str,
        help="path of the directory containing the config database to use",
        required=True,
        metavar="DB_DIR",
    )

    build.add_argument("--json", action="store_true", help="output config as JSON")

    query = subparsers.add_parser("query", help="query a config database")

    query.add_argument(
        "db_dir",
        type=str,
        help="path of the directory containing the database to query",
        metavar="DB_DIR",
    )

    subquery = query.add_subparsers(dest="subquery", required=True)

    ls = subquery.add_parser(
        "ls", help="List the paths of all configs in a given directory"
    )

    ls.add_argument(
        "dir",
        type=str,
        help="path of the directory to search",
        metavar="DIR",
    )

    ls.add_argument(
        "-r",
        "--recursive",
        action="store_true",
        help="list configs in subdirectories recursively",
    )

    rdeps = subquery.add_parser(
        "rdeps", help="List the paths of all configs that depend on a given config"
    )

    rdeps.add_argument(
        "config_file",
        type=str,
        help="path of the config to list reverse dependencies for",
        metavar="CONFIG_FILE",
    )

    args = parser.parse_args(argv)

    logging.basicConfig(
        stream=sys.stderr,
        level=LOG_LEVELS[args.log_level],
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S%z",
    )

    if args.command == "db":
        if args.db_command == "create":
            create_command(args)
        if args.db_command == "restore":
            restore_command(args)
        if args.db_command == "backup":
            backup_command(args)

    if args.command == "build":
        build_command(args)

    if args.command == "query":
        if args.subquery == "ls":
            ls_command(args)
        if args.subquery == "rdeps":
            rdeps_command(args)

    return 0


def create_command(args: argparse.Namespace):
    db_dir = PosixPath(args.db_dir).resolve(strict=False)
    DB.create(db_dir)


def restore_command(args: argparse.Namespace):
    snapshot_file = PosixPath(args.snapshot_file).resolve(strict=True)
    db_dir = PosixPath(args.db_dir).resolve(strict=False)
    DB.restore(snapshot_file, db_dir)


def backup_command(args: argparse.Namespace):
    db_dir = PosixPath(args.db_dir).resolve(strict=True)
    snapshot_file = PosixPath(args.snapshot_file).resolve(strict=False)
    with DB.open("r", db_dir) as db:
        db.backup(snapshot_file)


def build_command(args: argparse.Namespace):
    config_file = PosixPath(args.config_file).resolve(strict=True)
    out_dir = PosixPath(args.out_dir).resolve(strict=False)
    db_dir = PosixPath(args.db_dir).resolve(strict=True) if args.db_dir else None
    json: bool = args.json

    build(config_file, out_dir, json, db_dir)


def ls_command(args: argparse.Namespace):
    raise NotImplementedError


def rdeps_command(args: argparse.Namespace):
    db_dir = PosixPath(args.db_dir).resolve(strict=True)
    pwd = PosixPath.cwd().resolve()
    config_file = PosixPath(args.config_file).resolve(strict=False).relative_to(pwd)

    with DB.open("r", db_dir) as db:
        from .ConfigStore import ConfigStore

        store = ConfigStore(db)
        for rdep in store.get_rdeps(config_file):
            print(rdep)

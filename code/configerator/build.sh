uv build
uv pip install --force-reinstall dist/configerator-0.1.0-*.whl
exec bash --rcfile <(echo 'source ".venv/bin/activate"')
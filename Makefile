.PHONY: style format quality all

# Applies code style fixes to the specified file or directory
style:
	@echo "Applying style fixes to $(file)"
	ruff format $(file)
	ruff check --fix $(file) --line-length 119

# Checks code quality for the specified file or directory
quality:
	@echo "Checking code quality for $(file)"
	ruff check $(file) --line-length 119

# Applies PEP8 formatting and checks the entire codebase
all:
	@echo "Formatting and checking the entire codebase"
	ruff format .
	ruff check --fix . --line-length 119

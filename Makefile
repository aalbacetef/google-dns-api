
DIST_DIR = ./dist
COVERAGE_DIR = ./coverage

runner = bun x
SHELL = /usr/bin/env bash

.PHONY: lint
lint:
	$(runner) eslint

test: coverage = true
test: 
ifeq ($(coverage), true)
	$(runner) vitest run --coverage
else
	$(runner) vitest
endif 

.PHONY: clean
clean:
	rm -rf $(DIST_DIR)
	rm -rf $(COVERAGE_DIR)


.PHONY: dist 
dist: clean
	npx rollup -c 




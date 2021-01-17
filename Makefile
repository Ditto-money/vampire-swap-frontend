run: node_modules
	@yarn start

prd:
	@git reset --hard HEAD^
	@git pull
	@yarn
	@yarn build
	@rm -rf build-swap
	@mv build build-swap

node_modules:
	@yarn

.PHONY: \
	run \
	prd

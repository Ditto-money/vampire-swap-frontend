www:
	@python2 -m SimpleHTTPServer 3002

prd:
	@git pull

.PHONY: www prd